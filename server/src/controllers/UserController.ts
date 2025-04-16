require('module-alias/register')
import ResponseError from "../utils/ResponseError";
import { NextFunction, Request, Response } from "express";
import {
    createUserService,
    deleteUserService,
    findUserByIdService,
    getAllUsersService,
    updateUserService
} from "@services/AuthService";
import { User } from "@/entities/User";

function modifyReturnUser(user: User) {
    return {
        id: user.id,
        roles: user.roles,
        mail: user.mail,
        firstName: user.firstName,
        lastName: user.lastName,
        active: user.active,
        lastPasswordChange: user.lastPasswordChange,
        createdAt: user.createdAt,
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const user = await createUserService(req.body);
        return res.status(201).json(modifyReturnUser(user));
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const user = await findUserByIdService(parseInt(req.params.id));
        if (!user) {
            next(new ResponseError(404, "User not found", "IND_404_NOT_FOUND", true));
            return
        }
        return res.json(modifyReturnUser(user));
    } catch (error) {
        next(error);
    }
};

export const getUserMe = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const user = await findUserByIdService(req.user.id);
        if (!user) {
            next(new ResponseError(404, "User not found", "IND_404_NOT_FOUND", true));
            return
        }
        return res.json(modifyReturnUser(user));
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const users = await getAllUsersService();
        const usersWithoutPasswords = users.map(user => modifyReturnUser(user));
        return res.json(usersWithoutPasswords);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const user = await updateUserService(parseInt(req.params.id), req.body);
        return res.json(modifyReturnUser(user));
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await deleteUserService(parseInt(req.params.id));
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
