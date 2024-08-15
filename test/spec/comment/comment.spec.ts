import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import {Account} from '../../../src/apps/backend/modules/account'
import {AccessToken} from '../../../src/apps/backend/modules/access-token'
import { CommentService } from "../../../src/apps/backend/modules/comments";
import { createAccount } from "../../helpers/account";
import { app } from "../../helpers/app";;
import { TaskService } from "../../../src/apps/backend/modules/task";


chai.use(chaiHttp);

describe('Comment API', () => {

    let account:Account;
    let accessToken: AccessToken;
    let taskId: string;

    beforeEach(async () => {
        ({account, accessToken} = await createAccount());

        const task = await TaskService.createTask({
            accountId: account.id,
            title: 'test-task',
            description: 'This is a test description',
          });
          taskId = task.id;

    });


    describe('POST /tasks/:taskId/comments', () => {
        it('should be able to create a new comment', async () => {
            const Testcomment = "This is a Test Comment";

            const res = await chai
            .request(app)
            .post(`/api/tasks/${taskId}/comments`)
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${accessToken.token}`)
            .send({
                comment: Testcomment,
            });

            expect(res.status).to.eq(201);
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('task');
            expect(res.body).to.have.property('account');
            expect(res.body).to.have.property('comment');
            expect(res.body.task).to.eq(taskId);
            expect(res.body.account.id).to.eq(account.id);
            expect(res.body.comment).to.eq(Testcomment);
        })
    })

    describe('GET /tasks/:taskId/comments', () => {
        
        it('should return a list of comments for the task ', async () => {

            await CommentService.createComment({
                taskId: taskId,
                accountId: account.id,
                comment: "This is the First Test Comment",
            });

            await CommentService.createComment({
                taskId: taskId,
                accountId: account.id,
                comment: "This is the Second Test Comment",
            });

            await CommentService.createComment({
                taskId: taskId,
                accountId: account.id,
                comment: "This is the Third Test Comment",
            });

            const res = await chai
            .request(app)
            .get(`/api/tasks/${taskId}/comments`)
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${accessToken.token}`)
            .send();

            expect(res.status).to.eq(200)
            expect(res.body).to.be.an('array')
            expect(res.body.length).to.eq(3);
            expect(res.body[0]).to.have.property('task');
            expect(res.body[0]).to.have.property('account');
            expect(res.body[0]).to.have.property('comment');
            expect(res.body[1]).to.have.property('task');
            expect(res.body[1]).to.have.property('account');
            expect(res.body[1]).to.have.property('comment');

            it('should return an empty list if there are no comments for the task', async () => {
                const res = await chai
                  .request(app)
                  .get(`/tasks/:taskId/${taskId}/comments`)
                  .set('content-type', 'application/json')
                  .set('Authorization', `Bearer ${accessToken.token}`)
                  .send();
          
                expect(res.status).to.eq(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.eq(0);
              });
            });

        })

    
        describe('PUT /tasks/:taskId/comments/commentId', async () => {

            it('should update an existing comments', async () => {

                const existingComment = 'Existing comment';
                const updatedComment = 'Updated comment';


                const comment = await CommentService.createComment({
                    taskId: taskId,
                    accountId: account.id,
                    comment: existingComment,
                })


                const res = await chai
                .request(app)
                .put(`/api/tasks/${taskId}/comments/${comment.id}`)
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${accessToken.token}`)
                .send({
                    taskId:taskId,
                    comment:updatedComment,
                })

                expect(res.status).to.eq(200);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('task');
                expect(res.body).to.have.property('account');
                expect(res.body).to.have.property('comment');
                expect(res.body.task).to.eq(taskId);
                expect(res.body.account.id).to.eq(account.id);
                expect(res.body.comment).to.eq(updatedComment);
            })
        })

        describe('DELETE /tasks/:taskId/comments/:commentId', async () => {

            it('should delete an existing comment', async () => {
                   
                const existingComment = "This comment to be deleted";

                const comment = await CommentService.createComment({
                    taskId: taskId,
                    accountId: account.id,
                    comment: existingComment,
                });

                const res = await chai
                .request(app)
                .delete(`/api/tasks/${taskId}/comments/${comment.id}`)
                .set('comment-type', 'application/json')
                .set('Authorization',`Bearer ${accessToken.token}` )
                .send();

                expect(res.status).to.eq(204);
            })
        })
    })

   