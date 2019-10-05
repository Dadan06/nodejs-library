import { HttpStatusCode } from '../constants/http-status-codes.constant';

export class HttpException extends Error {
    status: HttpStatusCode;
    message: string;
    constructor(status: HttpStatusCode, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
