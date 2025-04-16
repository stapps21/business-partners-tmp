require('module-alias/register')
import { createDistributor, findDistributorEmployeesPaginated, findDistributorsPaginated, getDistributorById, getDistributorMail, getDistributorPdf } from '@/controllers/DistributorController';
import { Router } from 'express';

const distributorRouter = Router();

// CREATE
distributorRouter.post('/', createDistributor)
// READ
//companyRouter.get('/', getAllCompanies)
distributorRouter.get('/paginated', findDistributorsPaginated)
distributorRouter.get('/:distributorId', getDistributorById)
distributorRouter.get('/:distributorId/pdf', getDistributorPdf)
distributorRouter.get('/:distributorId/mail', getDistributorMail)
distributorRouter.get('/:distributorId/employees/paginated', findDistributorEmployeesPaginated) // TODO
//companyRouter.get('/:companyId', getCompany)
// UPDATE
//companyRouter.put('/:companyId', updateCompany)
// DELETE
//companyRouter.delete('/:companyId', deleteCompany)


export default distributorRouter