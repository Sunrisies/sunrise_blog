import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomUnauthorizedException extends HttpException {
  constructor(message: string, statusCode?: HttpStatus, data?: any) {
    super(
      {
        code: statusCode || HttpStatus.UNAUTHORIZED,
        message: message,
        data: data || null,
      },
      statusCode || HttpStatus.UNAUTHORIZED,
    );
  }
}
