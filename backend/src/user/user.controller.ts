import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserInputDto, userOutputDto } from '../dto/user/createUser';
import {
  UserNotFoundException,
  UserEmailAlreadyExistsException,
  UserValidationException,
  UserInternalServerException,
  UserPasswordNotMatchException,
} from '../common/exceptions/user.exception';
import { DatabaseOperationException } from '../common/exceptions/database.exception';
import { loginUserInputDto } from '../dto/user/loginUser';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<userOutputDto[]> {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to fetch users');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }

  // ユーザー情報取得処理
  @Get('id')
  async getUserById(@Query('id') id: string): Promise<userOutputDto> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      // ユーザーが存在してない場合にエラー投げる
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to fetch user');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }

  // ユーザー情報取得処理
  // todo 削除予定
  @Get('email')
  async getUserByEmail(@Query('email') email: string): Promise<userOutputDto> {
    try {
      return await this.userService.getUserByEmail(email);
    } catch (error) {
      // ユーザーが存在してない場合にエラー投げる
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to fetch user');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }

  // ユーザー登録処理
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() user: createUserInputDto): Promise<userOutputDto> {
    try {
      return await this.userService.createUser(user);
    } catch (error) {
      if (
        error instanceof UserEmailAlreadyExistsException ||
        error instanceof UserValidationException
      ) {
        throw error;
      }
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to create user');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }

  // ログイン処置
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() user: loginUserInputDto) {
    try {
      return await this.userService.login(user);
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof UserPasswordNotMatchException
      ) {
        throw error;
      }
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to process login');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }
}
