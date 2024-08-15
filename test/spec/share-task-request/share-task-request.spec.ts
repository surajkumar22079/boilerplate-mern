import chai, { expect } from 'chai';
import { AccessToken } from '../../../src/apps/backend/modules/access-token';
import { Account } from '../../../src/apps/backend/modules/account';
import { createAccount } from '../../helpers/account';
import { app } from '../../helpers/app';
import { TaskService } from '../../../src/apps/backend/modules/task';

describe('Shared Task API', () => {
  let account: Account;
  let accessToken: AccessToken;
  let taskId: string;

  beforeEach(async () => {
    ({ account, accessToken } = await createAccount());

    const task = await TaskService.createTask({
      accountId: account.id,
      title: 'my-task',
      description: 'This is a test description.',
    }); 

    taskId = task.id;
  });

  describe('POST /tasks/:taskId/share-task-requests', () => {
    it('should share a task with one or more users', async () => {
      const { account: anotherAccount } = await createAccount();

      const res = await chai
        .request(app)
        .post(`/api/tasks/${taskId}/share-task-requests`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({
          taskId: taskId,
          accountIds: [anotherAccount.id],
        }); 
      expect(res.status).to.eq(201);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(1);
      expect(res.body[0].task).to.eq(taskId);
      expect(res.body[0].account).to.eq(anotherAccount.id); 
    });

    it('should return error if trying to share task without taskId or accountIds', async () => {
      const res = await chai
        .request(app)
        .post(`/api/tasks/${taskId}/share-task-requests`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({
          accountIds: [],
        });

      expect(res.status).to.eq(400);
    });
  });

 
});
