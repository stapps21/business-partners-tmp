require('module-alias/register')
import { NextFunction, Request, Response } from "express";
import {
    createJobTitleService,
    deleteJobTitleService,
    getAllJobTitlesService,
    updateJobTitleService
} from "@services/JobTitleService";


export const createJobTitle = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const jobTitle = await createJobTitleService(req.body);
        return res.status(201).json(jobTitle);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};

export const getAllJobTitles = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const jobTitles = await getAllJobTitlesService();
        return res.json(jobTitles);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};



export const updateJobTitle = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const jobTitle = await updateJobTitleService(parseInt(req.params.id), req.body);
        return res.json(jobTitle);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};


export const deleteJobTitle = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await deleteJobTitleService(parseInt(req.params.id));
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
