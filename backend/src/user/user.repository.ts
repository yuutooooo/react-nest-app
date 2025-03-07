import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { createUserInputDto, userOutputDto } from '../dto/user/createUser';
import { PrismaService } from '../prisma/prisma.service';
import { DatabaseOperationException } from '../common/exceptions/database.exception';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<userOutputDto[]> {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseOperationException('read', error.message);
      }
      throw new DatabaseOperationException('read');
    }
  }

  async getUserById(id: string): Promise<userOutputDto | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseOperationException('read', error.message);
      }
      throw new DatabaseOperationException('read');
    }
  }

  async getUserByEmail(email: string): Promise<userOutputDto | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseOperationException('read', error.message);
      }
      throw new DatabaseOperationException('read');
    }
  }

  async createUser(user: createUserInputDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DatabaseOperationException(
            'create',
            'Unique constraint violation',
          );
        }
        throw new DatabaseOperationException('create', error.message);
      }
      throw new DatabaseOperationException('create');
    }
  }

  async findUserByEmailForLogin(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { email },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseOperationException('read', error.message);
      }
      throw new DatabaseOperationException('read');
    }
  }
}
