import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({})
export class UserModule {
  imports: [PrismaModule];
  providers: [UserService, UserRepository];
  controllers: [UserController];
}
