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
import { createUserInputDto, userOutputDto } from 'src/dto/user/createUser';
import {
  UserNotFoundException,
  UserEmailAlreadyExistsException,
  UserValidationException,
  UserInternalServerException,
} from '../common/exceptions/user.exception';
import { loginUserInputDto } from 'src/dto/user/loginUser';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // user idをクエリから取得して情報を返す
  @Get()
  async getUserById(@Query('id') id: string): Promise<userOutputDto> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      // ユーザーが存在してない場合にエラー投げる
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new UserInternalServerException('Failed to get user');
    }
  }

  @Get('email')
  async getUserByEmail(@Query('email') email: string): Promise<userOutputDto> {
    try {
      return await this.userService.getUserByEmail(email);
    } catch (error) {
      // ユーザーが存在してない場合にエラー投げる
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new UserInternalServerException('Failed to get user');
    }
  }

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
      throw new UserInternalServerException('Failed to create user');
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() user: loginUserInputDto) {
    try {
      return await this.userService.login(user);
    } catch (error) {}
  }
}
