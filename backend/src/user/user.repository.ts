import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { createUserInputDto, userOutputDto } from 'src/dto/user/createUser';
import { foundUser } from 'src/dto/user/loginUser';
import { PrismaService } from 'src/prisma/prisma.service';

export interface UserRepositoryInterface {
  findById(id: string): Promise<userOutputDto | null>;
  findByEmail(email: string): Promise<userOutputDto | null>;
  createUser(user: createUserInputDto): Promise<User>;
  findUserByEmailForLogin(email: string): Promise<foundUser | null>;
}

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<userOutputDto | null> {
    return this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<userOutputDto | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(user: createUserInputDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findUserByEmailForLogin(email: string): Promise<foundUser | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
