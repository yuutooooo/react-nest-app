import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserOutputDto } from 'src/dto/user/createUser';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // user idをクエリから取得して情報を返す
  @Get()
  getUserById(@Query('id') id: string): Promise<UserOutputDto | null> {
    return this.userService.getUserById(id)
  }

  @Get('email')
  getUserByEmail(@Query('email') email: string): Promise<UserOutputDto | null> {
    return this.userService.getUserByEmail(email)
  }
}
