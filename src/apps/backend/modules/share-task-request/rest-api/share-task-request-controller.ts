import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import ShareTaskRequestService from '../share-task-request-service';
import {
    CreateShareTasksRequestParams,
} from '../types';
import { serializeShareRequestTaskAsJSON } from './share-task-request-serializer';

export class ShareTaskRequestController {
  createSharedTaskRequest = applicationController(
    async (req: Request<CreateShareTasksRequestParams>, res: Response) => {
      const { taskId, accountIds } = req.body;
      if(!taskId || !accountIds){
        res.status(HttpStatusCodes.BAD_REQUEST).send();
      }
      const sharedTasks = await Promise.all(
        accountIds.map((accountId) => 
          ShareTaskRequestService.createSharedTaskRequest({ taskId, accountId })
        )
      );
      const sharedTasksJSON = sharedTasks.map(serializeShareRequestTaskAsJSON);
      console.log(sharedTasksJSON);
      res.status(HttpStatusCodes.CREATED).send(sharedTasksJSON);
    },
  );
}
