require('module-alias/register')
import { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = new Date().getTime();

    res.on('finish', () => {
        const duration = new Date().getTime() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });

    next();
};