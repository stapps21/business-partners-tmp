require('module-alias/register')
import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/ResponseError";
import * as jwt from 'jsonwebtoken';
import { JwtWithUserType } from "@/types/api/AuthTypes";
import { USER_ROLES } from "@/enum/UserRoles";
import { User } from "@entities/User";
import { AppDataSource } from "@config/data-source";

export const fakeAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    const userList = await userRepository.find({ take: 1 });
    if (!userList || userList.length === 0) {
        console.error('fakeAuthMiddleware: No user found');
    }

    const user = userList[0]
    const roles = [USER_ROLES.USER, USER_ROLES.ADMIN]


    req.user = {
        id: user.id,
        roles: roles,
    }

    console.log("\n")
    console.log("+==============FAKE-AUTH============")
    console.log(`| id: ${user.id}`)
    console.log(`| mail: ${user.mail}`)
    console.log(`| roles: ${roles}`)
    console.log("+===================================")
    console.log("\n")

    next();
}

export const checkValidTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {

    const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
    if (!authHeader?.startsWith('Bearer ')) {
        next(new ResponseError(403, "No auth token", "AUTH_403_NO_TOKEN", true))
        return;
    }

    // Remove Baerer from token "Baerer <token>"
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
            next(new ResponseError(401, err.message/*"Invalid auth token"*/, "AUTH_401_INVALID_TOKEN", true))
            return;
        }
        const decodedToken = decoded as JwtWithUserType;
        if (!decodedToken.user.id || !decodedToken.user.roles) {
            next(new ResponseError(401, "Invalid auth token (no user)", "AUTH_401_INVALID_TOKEN", true))
            return;
        }

        req.user = {
            id: decodedToken.user.id,
            roles: decodedToken.user.roles.map(role => parseInt(role as unknown as string)),
        }

        next();
    });
};

export const checkUserRoleMiddleware = (...allowedUserRoles: USER_ROLES[]) => {

    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user?.roles) {
            next(new ResponseError(401, "No roles defined for user", "AUTH_401_INVALID_TOKEN"))
            return;
        }

        const result = req.user.roles.map((role) => allowedUserRoles.includes(role)).find((val: boolean) => val);
        if (!result) {
            next(new ResponseError(401, "You don't have the permission for that action", "AUTH_401_INVALID_TOKEN"))
            return;
        }

        next();
    };
}
