import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {}

export const TasksRepositoryProvider = {
  provide: 'TASKS_REPOSITORY',
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Task).extend(TasksRepository),
  inject: [DataSource],
};
