require('module-alias/register')
import { MessageCodeType, ResponseErrorType } from "@interfaces/api/ResponseErrorType";


export default class ResponseError extends Error implements ResponseErrorType {
    error: string;
    status: number;
    messageCode: MessageCodeType;
    notifyUser: boolean;
    timestamp: string;

    constructor(status: number, error: string, messageCode: MessageCodeType, notifyUser: boolean = false) {
        super(error);
        this.error = error;
        this.status = status;
        this.messageCode = messageCode;
        this.notifyUser = true;
        this.timestamp = new Date().toISOString();

        // Restore the prototype chain (for correct instanceof)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
