require('module-alias/register')
import { Router } from 'express';
import {
    createCompany,
    deleteCompany,
    findCompaniesWithLocations,
    findInactiveCompaniesPaginated,
    getAllCompanies,
    getCompaniesPaginated,
    getCompany,
    updateCompany
} from "@controllers/CompanyController";
import { getEmployeesByCompany } from "@controllers/EmployeeController";

const companyRouter = Router();

// CREATE
companyRouter.post('/', createCompany)
// READ
companyRouter.get('/', getAllCompanies)
companyRouter.get('/paginated', getCompaniesPaginated)
companyRouter.get('/locations', findCompaniesWithLocations)
companyRouter.get('/inactive/paginated', findInactiveCompaniesPaginated)
companyRouter.get('/:companyId/employees/paginated', getEmployeesByCompany)
companyRouter.get('/:companyId', getCompany)
// UPDATE
companyRouter.put('/:companyId', updateCompany)
// DELETE
companyRouter.delete('/:companyId', deleteCompany)


export default companyRouter