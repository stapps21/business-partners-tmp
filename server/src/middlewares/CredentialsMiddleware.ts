require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import allowedOrigins from "@config/allowed-origins";

const credentials = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin as string)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
}

export default credentials;
