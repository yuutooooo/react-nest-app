import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInputDto, UserOutputDto } from 'src/dto/user/createUser';

@Injectable()
export class UserService {
  constructor (private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserOutputDto | null> {
    return this.userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<UserOutputDto | null> {
    return this.userRepository.findByEmail(email)
  }

  async createUser(user: CreateUserInputDto): Promise<UserOutputDto | null> {
    return this.userRepository.createUser(user)
  }
}
