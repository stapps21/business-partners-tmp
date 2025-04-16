require('module-alias/register')
import { NextFunction, Request, Response } from "express";
import {
    createSubjectService,
    deleteSubjectService,
    getAllSubjectsService,
    updateSubjectService
} from "../services/SubjectService";
import ResponseError from "../utils/ResponseError";

export const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const subject = await createSubjectService(req.body);
        return res.status(201).json(subject);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};

export const getAllSubjects = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const subjects = await getAllSubjectsService();
        return res.json(subjects);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};



export const updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const subject = await updateSubjectService(parseInt(req.params.id), req.body);
        return res.json(subject);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};


export const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await deleteSubjectService(parseInt(req.params.id));
        return res.status(204).send();
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};
