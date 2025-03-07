import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { createUserInputDto, userOutputDto } from 'src/dto/user/createUser';
import {
  UserNotFoundException,
  UserEmailAlreadyExistsException,
  UserValidationException,
  UserPasswordNotMatchException,
} from '../common/exceptions/user.exception';
import { UserUtil } from 'src/common/utils/authFunctions';
import { loginUserInputDto } from 'src/dto/user/loginUser';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // ユーザー情報取得処理 idから
  async getUserById(id: string): Promise<userOutputDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  // ユーザー情報取得処理 メールアドレスから
  async getUserByEmail(email: string): Promise<userOutputDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }
    return user;
  }

  // ユーザー登録処理
  async createUser(user: createUserInputDto): Promise<userOutputDto> {
    try {
      // メールアドレスの重複チェック
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        throw new UserEmailAlreadyExistsException(user.email);
      }

      // バリデーションチェック
      if (!user.email || !user.password || !user.name) {
        throw new UserValidationException('Required fields are missing');
      }

      // パスワードのハッシュ化
      user.password = await UserUtil.hashPassword(user.password);
      console.log(user.password);

      return await this.userRepository.createUser(user);
    } catch (error) {
      if (
        error instanceof UserEmailAlreadyExistsException ||
        error instanceof UserValidationException
      ) {
        throw error;
      }
      throw new Error('Failed to create user');
    }
  }

  // ログイン処理
  async login(user: loginUserInputDto) {
    try {
      const existingUser = await this.userRepository.findUserByEmailForLogin(
        user.email,
      );
      if (!existingUser) {
        throw new UserNotFoundException(user.email);
      }

      const isPasswordOK = await UserUtil.comparePassword(
        user.password,
        existingUser.password,
      );
      if (!isPasswordOK) {
        throw new UserPasswordNotMatchException();
      }
      const token = await UserUtil.generateToken(
        existingUser.id,
        existingUser.email,
      );
      console.log(token);
      return { token };
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof UserPasswordNotMatchException
      ) {
        throw error;
      }
      throw new Error('Failed to login');
    }
  }
}
