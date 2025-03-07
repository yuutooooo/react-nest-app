import { HttpException, HttpStatus } from '@nestjs/common';

// ユーザーが存在しない場合の例外
export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

// ユーザーが既に存在する場合の例外
export class UserEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, HttpStatus.CONFLICT);
  }
}

// パスワードが一致しない場合の例外
export class UserPasswordNotMatchException extends HttpException {
  constructor() {
    super('Password not match', HttpStatus.UNAUTHORIZED);
  }
}

// バリデーションエラーの場合の例外
export class UserValidationException extends HttpException {
  constructor(errors: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: errors,
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

// サーバーエラーの場合の例外
export class UserInternalServerException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: message,
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
