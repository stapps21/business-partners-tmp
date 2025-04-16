require('module-alias/register')
import { Router } from 'express';
import { createSubject, deleteSubject, getAllSubjects, updateSubject } from "../controllers/SubjectController";
import { checkUserRoleMiddleware } from '@/middlewares/AuthMiddleware';
import { USER_ROLES } from '@/enum/UserRoles';

const subjectRouter = Router();

// CREATE
subjectRouter.post('/', checkUserRoleMiddleware(USER_ROLES.ADMIN), createSubject)
// READ
//employeeRouter.get('/', getAllCompanies)
//employeeRouter.get('/paginated', getCompaniesPaginated)
subjectRouter.get('/', getAllSubjects);
//subjectRouter.get('/:id', getSubject)
// UPDATE
subjectRouter.put('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), updateSubject)
// DELETE
subjectRouter.delete('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), deleteSubject)


export default subjectRouter