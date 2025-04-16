require('module-alias/register')
import {
    createIndustryService,
    deleteIndustryService,
    findIndustryById,
    getAllIndustriesService,
    updateIndustryService
} from "@services/IndustryService";
import { NextFunction, Request, Response } from "express";
import ResponseError from "@utils/ResponseError";

export const createIndustry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const industry = await createIndustryService(req.body);
        return res.status(201).json(industry);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};


export const getIndustry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const industry = await findIndustryById(parseInt(req.params.id));
        if (!industry) {
            next(new ResponseError(404, "Industry not found", "IND_404_NOT_FOUND", true));
            return
        }
        return res.json(industry);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};

export const getAllIndustries = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const industries = await getAllIndustriesService();
        return res.json(industries);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};



export const updateIndustry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const industry = await updateIndustryService(parseInt(req.params.id), req.body);
        return res.json(industry);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};


export const deleteIndustry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await deleteIndustryService(parseInt(req.params.id));
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
