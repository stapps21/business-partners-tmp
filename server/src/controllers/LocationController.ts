require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import ResponseError from "@utils/ResponseError";
import { createLocationService, deleteLocationService, updateLocationService } from '@/services/LocationService';

/*********************************************
 * CREATE
 *********************************************/

export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const location = await createLocationService(req.body);
        return res.status(201).json(location);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
}

/*********************************************
 * READ
 *********************************************/



/*********************************************
 * UPDATE
 *********************************************/

export const updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const location = await updateLocationService(parseInt(req.params.locationId), req.body);
        return res.json(location);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};

/*********************************************
 * DELETE
 *********************************************/

export const deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        await deleteLocationService(parseInt(req.params.locationId));
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
