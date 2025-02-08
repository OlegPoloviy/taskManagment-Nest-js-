import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {}

export const UsersRepositoryProvider = {
  provide: 'USERS_REPOSITORY',
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(User).extend(UsersRepository),
  inject: [DataSource],
};
