export interface AppErrorType {
    message: string;
    readonly isOperational: boolean;
    readonly httpStatus?: number;
}

export default class AppError extends Error {
    readonly isOperational;

    readonly httpStatus;

    constructor({ message, isOperational, httpStatus }: AppErrorType) {
      super(message);
      this.isOperational = isOperational;
      this.httpStatus = httpStatus;
    }
}
