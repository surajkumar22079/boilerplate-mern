import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import TaskService from '../task-service';
import {
  Task,
  CreateTaskParams,
  GetAllTaskParams,
  DeleteTaskParams,
  GetTaskParams,
  UpdateTaskParams, 
} from '../types';

import { serializeTaskAsJSON } from './task-serializer';

export class TaskController {
  createTask = applicationController(async (
    req: Request<CreateTaskParams>,
    res: Response,
  ) => {
    const task: Task = await TaskService.createTask({
      accountId: req.accountId,
      description: req.body.description,
      title: req.body.title,
    });
    const taskJSON = serializeTaskAsJSON(task);

    res
      .status(HttpStatusCodes.CREATED)
      .send(taskJSON);
  });

  deleteTask = applicationController(async (
    req: Request<DeleteTaskParams>,
    res: Response,
  ) => {
    await TaskService.deleteTask({
      accountId: req.accountId,
      taskId: req.params.id,
    });

    res
      .status(HttpStatusCodes.NO_CONTENT)
      .send();
  });

  getTask = applicationController(async (
    req: Request<GetTaskParams>,
    res: Response,
  ) => {
    const task = await TaskService.getTaskForAccount({
      accountId: req.accountId,
      taskId: req.params.id,
    });
    const taskJSON = serializeTaskAsJSON(task);

    res
      .status(HttpStatusCodes.OK)
      .send(taskJSON);
  });

  getTasks = applicationController(async (
    req: Request,
    res: Response,
  ) => {
    const page = +req.query.page;
    const size = +req.query.size;
    
    // Convert sharedTask to a boolean
    const sharedTask = req.query.sharedTask === 'true';
  
    const params: GetAllTaskParams = {
      accountId: req.accountId,
      page,
      size,
      sharedTask, // Now sharedTask is correctly typed as a boolean
    };
    let tasks: any[];
    if(sharedTask===false)
     tasks = await TaskService.getTasksForAccount(params);

    else tasks = await TaskService.getSharedTasksForAccount(params);
    const tasksJSON = tasks.map((task) => serializeTaskAsJSON(task));
  
    res
      .status(HttpStatusCodes.OK)
      .send(tasksJSON);
  }); 
  updateTask = applicationController(async (
    req: Request<UpdateTaskParams>,
    res: Response,
  ) => {
    const updatedTask: Task = await TaskService.updateTask({
      accountId: req.accountId,
      taskId: req.params.id,
      description: req.body.description,
      title: req.body.title,
    });
    const taskJSON = serializeTaskAsJSON(updatedTask);

    res
      .status(HttpStatusCodes.OK)
      .send(taskJSON);
  });

  

}

