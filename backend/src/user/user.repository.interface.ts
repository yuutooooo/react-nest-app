import { User } from '@prisma/client';
import { createUserInputDto, userOutputDto } from '../dto/user/createUser';

export interface UserRepositoryInterface {
  getUserById(id: string): Promise<userOutputDto | null>;
  getUserByEmail(email: string): Promise<userOutputDto | null>;
  createUser(user: createUserInputDto): Promise<User>;
  findUserByEmailForLogin(email: string): Promise<User | null>;
  getUsers(): Promise<userOutputDto[]>;
}

export const USER_REPOSITORY = 'UserRepositoryInterface';
