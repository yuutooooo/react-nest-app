import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseOperationException extends HttpException {
  constructor(operation: string, error?: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Database ${operation} operation failed`,
        error: error || 'Database Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
