import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UserEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, HttpStatus.CONFLICT);
  }
}

export class UserPasswordNotMatchException extends HttpException {
  constructor() {
    super('Password not match', HttpStatus.UNAUTHORIZED);
  }
}

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
