import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: UsersRepository,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.usersRepository.create({ username, password });
    try {
      await this.usersRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw InternalServerErrorException;
      }
      console.log(e.code);
    }
  }
}
