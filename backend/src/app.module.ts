import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PatientController } from './patient/patient.controller';
import { PatientModule } from './patient/patient.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [UserModule, PatientModule, PrismaModule],
  controllers: [AppController, UserController, PatientController],
  providers: [AppService, UserService, UserRepository],
})
export class AppModule {}
