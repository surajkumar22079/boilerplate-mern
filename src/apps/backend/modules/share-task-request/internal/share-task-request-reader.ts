import { ShareTaskRequestStatus } from '../types';
import ShareTaskRequestRepository from './store/share-task-request-repository'; 

export default class ShareTaskRequestReader {
 

  
  public static async getSharedTaskIDsForAccount(
    accountId: string,
  ): Promise<string[]> {
    const sharedTasks = await ShareTaskRequestRepository.find({
      account: accountId,
      active: true,
      status: ShareTaskRequestStatus.Approved,
    });

    const taskIdsDB = sharedTasks.map((item) => item.task.toString());

    return taskIdsDB;
  }
}
