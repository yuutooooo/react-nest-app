import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { CreateUserInputDto, UserOutputDto } from "src/dto/user/createUser";
import { PrismaService } from "src/prisma/prisma.service";

export interface UserRepositoryInterface {
  findById(id: string): Promise<UserOutputDto | null>
  findByEmail(email: string): Promise<UserOutputDto | null>
  createUser(user: CreateUserInputDto): Promise<User>
}

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService){}

  async findById(id: string): Promise<UserOutputDto | null> {
    return this.prisma.user.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  async findByEmail(email: string): Promise<UserOutputDto | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  async createUser(user: CreateUserInputDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      }
    })
  }
}