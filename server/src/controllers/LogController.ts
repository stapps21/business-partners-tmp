require('module-alias/register')
import { NextFunction, Request, Response } from "express";
import ResponseError from "@utils/ResponseError";
import { findLogPaginatedService, getLogEntryService } from "@/services/LogService";
import { USER_ROLES } from "@/enum/UserRoles";

export const findLogPaginated = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const [logs, total] = await findLogPaginatedService({
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });

        return res.status(200).json({
            data: logs,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        next(error);
    }
};

export const getLogEntry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const log = await getLogEntryService(parseInt(req.params.logId));
        if (!log) {
            next(new ResponseError(404, "Log entry not found", "IND_404_NOT_FOUND", true));
            return
        }
        return res.json(log);
    } catch (error) {
        next(error);
    }
};

