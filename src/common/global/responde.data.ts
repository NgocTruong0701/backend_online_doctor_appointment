export class ResponseData<T> {
    data: T | T[];
    statusCode: number;
    message: string;
    error: string | null;

    constructor(data: T | T[], statusCode: number, message: string, error?: string | null) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;

        return this;
    }
}