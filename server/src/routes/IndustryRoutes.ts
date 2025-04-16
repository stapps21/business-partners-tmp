require('module-alias/register')
import { Router } from 'express';
import {
    createIndustry,
    deleteIndustry,
    getAllIndustries,
    getIndustry,
    updateIndustry
} from "@controllers/IndustryController";
import { checkUserRoleMiddleware } from '@/middlewares/AuthMiddleware';
import { USER_ROLES } from '@/enum/UserRoles';


const industryRouter = Router();

// CREATE
industryRouter.post('/', checkUserRoleMiddleware(USER_ROLES.ADMIN), createIndustry)
// READ
//employeeRouter.get('/', getAllCompanies)
//employeeRouter.get('/paginated', getCompaniesPaginated)
industryRouter.get('/', getAllIndustries);
industryRouter.get('/:id', getIndustry)
// UPDATE
industryRouter.put('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), updateIndustry)
// DELETE
industryRouter.delete('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), deleteIndustry)


export default industryRouter