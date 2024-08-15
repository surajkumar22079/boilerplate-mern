import ShareTaskRequestWriter from './internal/share-task-request-writer';
import {
  CreateShareTaskRequestParams, 
  ShareTaskRequest,
} from './types';

export default class ShareTaskRequestService {
  public static async createSharedTaskRequest(
    params: CreateShareTaskRequestParams,
  ): Promise<ShareTaskRequest> {
    return ShareTaskRequestWriter.createSharedTaskRequest(params);
  }
 
}
