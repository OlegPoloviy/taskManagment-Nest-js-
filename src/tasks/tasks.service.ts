import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TaskStatus } from './task.status';
import { CreateTaskDto } from './DTO/create-task.dto';
import { getFilterDTO } from './DTO/create-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { log } from 'console';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_REPOSITORY')
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }

    const result = await this.tasksRepository.delete({ id });
    log(result);
  }

  // getTaskWithFilters(filterDto: getFilterDTO): Task[]{
  //     const {status,search} = filterDto;

  //     let tasks = this.getAllTasks();

  //     if(status){
  //         tasks = tasks.filter((task) => task.status === status);
  //     }

  //     if(search){
  //         tasks = tasks.filter((task) => {
  //             if(task.title.includes(search) || task.description.includes(search)){
  //                 return true;
  //             }
  //             return false;
  //         });
  //     }

  //     return tasks;

  // }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
