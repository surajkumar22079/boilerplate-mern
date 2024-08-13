import {
  GetAllTaskParams,
  GetTaskParams,
  Task,
  TaskNotFoundError,
  PaginationParams,
} from '../types';

import TaskRepository from './store/task-repository';
import TaskUtil from './task-util';
import ShareTaskRequestReader from '../../share-task-request/internal/share-task-request-reader';


interface TaskQuery {
  account: string;
  active: boolean;
  sharedTask?: boolean;
}

export default class TaskReader {
  public static async getTaskForAccount(params: GetTaskParams): Promise<Task> {
    const taskDb = await TaskRepository.findOne({
      _id: params.taskId,
      account: params.accountId,
      active: true,
    });
    if (!taskDb) {
      throw new TaskNotFoundError(params.taskId);
    }

    return TaskUtil.convertTaskDBToTask(taskDb);
  }

  public static async getTasksForAccount(
    params: GetAllTaskParams,
  ): Promise<Task[]> {
    const query: TaskQuery = {
      account: params.accountId,
      active: true,
    };

    if (params.sharedTask) {
      query.sharedTask = params.sharedTask;
    }

    const totalTasksCount = await TaskRepository.countDocuments(query);

    const paginationParams: PaginationParams = {
      page: params.page ? params.page : 1,
      size: params.size ? params.size : totalTasksCount,
    };
    const startIndex = (paginationParams.page - 1) * paginationParams.size;

    const tasksDb = await TaskRepository.find(query)
      .limit(paginationParams.size)
      .skip(startIndex);

    return tasksDb.map((taskDb) => TaskUtil.convertTaskDBToTask(taskDb));
  }

  public static async getSharedTasksForAccount(
    params: GetAllTaskParams,
  ): Promise<Task[]> {
    const taskIds = await ShareTaskRequestReader.getSharedTaskIDsForAccount(
      params.accountId,
    );

    const totalTasksCount = await TaskRepository.countDocuments({
      account: params.accountId,
      active: true,
    });

    const paginationParams: PaginationParams = {
      page: params.page ? params.page : 1,
      size: params.size ? params.size : totalTasksCount,
    };
    const startIndex = (paginationParams.page - 1) * paginationParams.size;

    const tasksDb = await TaskRepository.find({
      _id: { $in: taskIds },
      active: true,
    })
      .limit(paginationParams.size)
      .skip(startIndex);
    return tasksDb.map((taskDb) => TaskUtil.convertTaskDBToTask(taskDb));
  }
}
