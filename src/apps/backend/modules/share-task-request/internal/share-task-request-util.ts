import { ShareTaskRequest } from '../types';
import { ShareTaskRequestDB } from './store/share-task-request-db'; 

export default class ShareTaskRequestUtil {
  public static convertShareTaskDBRequestToShareTaskRequest(
    shareTaskRequestDb: ShareTaskRequestDB
  ): ShareTaskRequest {
    return {
      id: shareTaskRequestDb._id.toString(),
      task:  shareTaskRequestDb.task.toString(),
      account: shareTaskRequestDb.account.toString(),
    } as ShareTaskRequest;
  }
}
