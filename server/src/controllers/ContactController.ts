require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import ResponseError from "@utils/ResponseError";
import { createContactService, deleteContactService, updateContactService } from '@/services/ContactService';

/*********************************************
 * CREATE
 *********************************************/

export const createContact = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const entityType = req.params.entityType;
        const contact = await createContactService(entityType, req.body);
        return res.status(201).json(contact);
    } catch (error) {
        // console.error(error);
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

export const updateContact = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const newContact = {
            type: req.body.contactType,
            value: req.body.contactValue,
        }
        const entityType = req.params.entityType;
        const contact = await updateContactService(parseInt(req.params.contactId), entityType, newContact);
        return res.json(contact);
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

export const deleteContact = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const entityType = req.params.entityType;
        const contactId = parseInt(req.params.contactId);
        await deleteContactService(entityType, contactId);
        return res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        // console.error(error);
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};
