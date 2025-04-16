require('module-alias/register')
import { Router } from 'express';
import { addUserInContact, createEmployee, findInactiveEmployeesPaginated, getEmployee, getEmployeesMeInContactPaginated, getEmployeesPaginated, removeUserFromContact, updateEmployee } from "@controllers/EmployeeController";


const employeeRouter = Router();

// CREATE
employeeRouter.post('/', createEmployee)
employeeRouter.post('/:employeeId/user-in-contact', addUserInContact)
// READ
//employeeRouter.get('/', getAllCompanies)
employeeRouter.get('/paginated', getEmployeesPaginated)
employeeRouter.get('/me-in-contact/paginated', getEmployeesMeInContactPaginated)
employeeRouter.get('/:employeeId', getEmployee)
employeeRouter.get('/inactive/paginated', findInactiveEmployeesPaginated)
// UPDATE
employeeRouter.put('/:employeeId', updateEmployee)
// DELETE
//employeeRouter.delete('/:employeeId', deleteCompany)
employeeRouter.delete('/:employeeId/user-in-contact/:userInContactId', removeUserFromContact)


export default employeeRouter