import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomUnauthorizedException extends HttpException {
    constructor(message: string, statusCode?: HttpStatus) {
        super(
            {
                code: statusCode || HttpStatus.UNAUTHORIZED,
                message: message,
            },
            statusCode || HttpStatus.UNAUTHORIZED,
        );
    }
}
