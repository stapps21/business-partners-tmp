require('module-alias/register')
import { Router } from 'express';
import { createContact, deleteContact, updateContact } from '@/controllers/ContactController';

const contactRouter = Router();

// CREATE
contactRouter.post('/:entityType/', createContact)
// READ
//companyRouter.get('/', getAllCompanies)
//companyRouter.get('/paginated', getCompaniesPaginated)
//companyRouter.get('/locations', findCompaniesWithLocations)
//companyRouter.get('/:companyId/employees/paginated', getEmployeesByCompany)
//companyRouter.get('/:companyId', getCompany)
// UPDATE
contactRouter.put('/:entityType/:contactId', updateContact)
// DELETE
contactRouter.delete('/:entityType/:contactId', deleteContact)


export default contactRouter