import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryInterface,
  USER_REPOSITORY,
} from './user.repository.interface';
import { createUserInputDto, userOutputDto } from '../dto/user/createUser';
import {
  UserNotFoundException,
  UserEmailAlreadyExistsException,
  UserValidationException,
  UserPasswordNotMatchException,
  UserInternalServerException,
} from '../common/exceptions/user.exception';
import { DatabaseOperationException } from '../common/exceptions/database.exception';
import { UserUtil } from '../common/utils/authFunctions';
import { loginUserInputDto } from '../dto/user/loginUser';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async getUsers(): Promise<userOutputDto[]> {
    try {
      return await this.userRepository.getUsers();
    } catch (error) {
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to fetch users');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }

  // ユーザー情報取得処理 idから
  async getUserById(id: string): Promise<userOutputDto> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DatabaseOperationException) {
        throw new UserInternalServerException('Failed to fetch user');
      }
      throw new UserInternalServerException('An unexpected error occurred');
    }
  }

  // ユーザー情報取得処理 メールアドレスから
  async getUserByEmail(email: string): Promise<userOutputDto> {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        throw new UserNotFoundException(email);
      }
      return user;
    } catch (error) {
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
  async createUser(user: createUserInputDto): Promise<userOutputDto> {
    try {
      // メールアドレスの重複チェック
      const existingUser = await this.userRepository.getUserByEmail(user.email);
      if (existingUser) {
        throw new UserEmailAlreadyExistsException(user.email);
      }

      // バリデーションチェック
      if (!user.email || !user.password || !user.name) {
        throw new UserValidationException('Required fields are missing');
      }

      // パスワードのハッシュ化
      user.password = await UserUtil.hashPassword(user.password);

      return await this.userRepository.createUser(user);
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
      return { token };
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
