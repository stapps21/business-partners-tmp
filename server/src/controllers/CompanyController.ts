require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import {
    createCompanyService,
    deleteCompanyService,
    findAllCompaniesService,
    findCompaniesPaginatedService,
    findCompaniesWithLocationsService,
    findInactiveCompaniesPaginatedService,
    getCompanyService,
    updateCompanyService
} from "@services/CompanyService";
import ResponseError from "@utils/ResponseError";
import { USER_ROLES } from '@/enum/UserRoles';

/*********************************************
 * CREATE
 *********************************************/

export const createCompany = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const data = req.body;

        if (data.contact) {
            for (const key in data.contact) {
                data.contact[key] = data.contact[key]?.trim()
                if (data.contact[key] === '') {
                    delete data.contact[key];
                }
            }
        }

        const company = await createCompanyService(req.user.id, data);
        return res.status(201).json(company);
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

export const getCompany = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.companyId);

        const isAdmin = req.user.roles.findIndex(role => role === USER_ROLES.ADMIN) !== -1

        // Validate companyId as needed

        const company = await getCompanyService(companyId, isAdmin);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).json(company);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAllCompanies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const isAdmin = req.user.roles.findIndex(role => role === USER_ROLES.ADMIN) !== -1
        const companies = await findAllCompaniesService(isAdmin);
        return res.status(200).json(companies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getCompaniesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const isAdmin = req.user.roles.findIndex(role => role === USER_ROLES.ADMIN) !== -1
        const [companies, total] = await findCompaniesPaginatedService({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            isAdmin
        });

        return res.status(200).json({
            data: companies,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};

export const findCompaniesWithLocations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const limit = parseInt(req.query.limit as string) ?? 25;
        const search = req.query.search as string ?? '';

        const isAdmin = req.user.roles.findIndex(role => role === USER_ROLES.ADMIN) !== -1
        const [companies] = await findCompaniesWithLocationsService({ search, isAdmin });

        return res.status(200).json(companies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const findInactiveCompaniesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const [companies, total] = await findInactiveCompaniesPaginatedService({
            page,
            limit,
            sortBy,
            sortOrder,
        });

        return res.status(200).json({
            data: companies,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};

/*********************************************
 * UPDATE
 *********************************************/

export const updateCompany = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.companyId);
        const updateData = req.body;

        // Validate companyId and updateData as needed

        const updatedCompany = await updateCompanyService(req.user.id, companyId, updateData);

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).json(updatedCompany);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/*********************************************
 * DELETE
 *********************************************/

export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.companyId);

        // Validate companyId as needed

        const result = await deleteCompanyService(companyId);

        if (!result) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).json({ message: 'Company successfully deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}