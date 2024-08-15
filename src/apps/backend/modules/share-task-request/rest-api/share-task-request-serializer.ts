import { Account } from '../../account/types';
import { Task } from '../../task/types';
import { ShareTaskRequest } from '../types';

export function serializeShareRequestTaskAsJSON(shareTaskRequest: ShareTaskRequest): object {
  const task = shareTaskRequest.task as Task;
  const account = shareTaskRequest.account as Account;

  return {
    id: shareTaskRequest.id,
    task:
      typeof shareTaskRequest.task === 'string'
        ? shareTaskRequest.task
        : {
            id: task.id,
            title: task.title,
            description: task.description,
            account:
              typeof task.account === 'string'
                ? task.account
                : {
                    id: (task.account as Account).id,
                    firstName: (task.account as Account).firstName,
                    lastName: (task.account as Account).lastName,
                    username: (task.account as Account).username,
                  },
          },
    account:
      typeof shareTaskRequest.account === 'string'
        ? shareTaskRequest.account
        : {
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
          },
  };
}