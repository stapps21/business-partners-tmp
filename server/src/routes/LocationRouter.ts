require('module-alias/register')
import { Router } from 'express';
import { createLocation, deleteLocation, updateLocation } from '@/controllers/LocationController';

const locationRouter = Router();

// CREATE
locationRouter.post('/', createLocation)
// READ
//companyRouter.get('/', getAllCompanies)
//companyRouter.get('/paginated', getCompaniesPaginated)
//companyRouter.get('/locations', findCompaniesWithLocations)
//companyRouter.get('/:companyId/employees/paginated', getEmployeesByCompany)
//companyRouter.get('/:companyId', getCompany)
// UPDATE
locationRouter.put('/:locationId', updateLocation)
// DELETE
locationRouter.delete('/:locationId', deleteLocation)


export default locationRouter