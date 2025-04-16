require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import ResponseError from "../utils/ResponseError";
import { ResponseErrorType } from "@interfaces/api/ResponseErrorType";

export const errorMiddleware = (err: ResponseError | Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err.constructor.name, err)

    if (err instanceof ResponseError) {
        // Error is a ResponseError instance
        return res.status(err.status).json({
            status: err.status,
            error: err.error,
            messageCode: err.messageCode,
            //details: err.details,
            timestamp: err.timestamp,
            notifyUser: err.notifyUser
        });
    } else {
        const responseError: ResponseErrorType = {
            status: 500,
            error: 'Internal Server Error',
            messageCode: 'INTERNAL_SERVER_ERROR',
            timestamp: new Date().toISOString(),
            //path: req.originalUrl,
            notifyUser: false
        }

        return res.status(500).json(responseError);
    }
};
