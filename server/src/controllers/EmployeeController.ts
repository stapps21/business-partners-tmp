require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import {
    addUserInContactService,
    createEmployeeService,
    findEmployeesByCompanyService,
    findEmployeesMeInContactPaginatedService,
    findEmployeesPaginatedService,
    findInactiveEmployeesPaginatedService,
    getEmployeeService,
    removeUserFromContactService,
    updateEmployeeService
} from "@services/EmployeeService";
import ResponseError from "../utils/ResponseError";
import { USER_ROLES } from '@/enum/UserRoles';

/*********************************************
 * CREATE
 *********************************************/

export const createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        // Extract employee data from request body
        const employeeData = req.body;

        // Call the service to create a new employee
        const newEmployee = await createEmployeeService(employeeData);

        return res.status(201).json(newEmployee);
    } catch (error) {
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};

export const addUserInContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;
        const { userInContactId } = req.body;
        console.log(employeeId, userInContactId)
        const updatedEmployee = await addUserInContactService(parseInt(employeeId), parseInt(userInContactId));
        res.status(200).json(updatedEmployee);
    } catch (error) {
        next(error);
    }
}

/*********************************************
 * READ
 *********************************************/

export const getEmployeesByCompany = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const companyId = parseInt(req.params.companyId);
        if (isNaN(companyId)) {
            next(new ResponseError(400, "Invalid company ID", "INVALID_COMPANY_ID", true))
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string ?? 'lastName';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const [employees, total] = await findEmployeesByCompanyService({
            companyId,
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });

        return res.status(200).json({
            data: employees,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        next(error)
        // console.error(error)
        // if (error instanceof ResponseError) {
        //     // Handling custom response errors
        //     next(error)
        // } else if (error instanceof SyntaxError) {
        //     // Handling syntax errors, e.g., in JSON parsing
        //     res.status(400).json({ message: "Bad request", code: "BAD_REQUEST_SYNTAX" });
        // } else if (error.name === "QueryFailedError") {
        //     // Handling database query errors
        //     res.status(500).json({ message: "Database query failed", code: "DB_QUERY_FAILED" });
        // } else if (error.code) {
        //     // Handling MariaDB specific errors based on error codes
        //     switch (error.code) {
        //         case 'ER_DUP_ENTRY':
        //             res.status(409).json({ message: "Duplicate entry", code: "DB_DUPLICATE_ENTRY" });
        //             break;
        //         case 'ER_NO_REFERENCED_ROW_2':
        //             res.status(400).json({ message: "Foreign key constraint fails", code: "DB_FK_CONSTRAINT_FAIL" });
        //             break;
        //         // Add more cases as needed
        //         default:
        //             res.status(500).json({ message: "Database query failed", code: "DB_QUERY_FAILED" });
        //     }
        // } else {
        //     // Handling all other unexpected errors
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
};

export const getEmployeesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'id';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const isAdmin = req.user.roles.findIndex(role => role === USER_ROLES.ADMIN) !== -1
        const [companies, total] = await findEmployeesPaginatedService({
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

export const getEmployeesMeInContactPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'id';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const myId = req.user.id
        const [companies, total] = await findEmployeesMeInContactPaginatedService({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            myId
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

export const getEmployee = async (req: Request, res: Response) => {
    try {
        const employeeId = parseInt(req.params.employeeId);

        // Validate companyId as needed

        const employee = await getEmployeeService(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json(employee);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const findInactiveEmployeesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const [employees, total] = await findInactiveEmployeesPaginatedService({
            page,
            limit,
            sortBy,
            sortOrder,
        });

        return res.status(200).json({
            data: employees,
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

export const updateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const employeeId = parseInt(req.params.employeeId);

        // Validate the employee ID
        if (isNaN(employeeId)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const updateData = req.body;
        const updatedEmployee = await updateEmployeeService(employeeId, updateData);

        return res.status(200).json(updatedEmployee);
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};


/*********************************************
 * DELETE
 *********************************************/

export const removeUserFromContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId, userInContactId } = req.params;
        console.log('Removing user from contact:', employeeId, userInContactId);
        const updatedEmployee = await removeUserFromContactService(parseInt(employeeId), parseInt(userInContactId));
        res.status(200).json(updatedEmployee);
    } catch (error) {
        next(error);
    }
}
