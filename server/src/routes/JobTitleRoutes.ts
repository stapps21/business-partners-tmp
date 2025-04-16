require('module-alias/register')
import { Router } from 'express';
import { createJobTitle, deleteJobTitle, getAllJobTitles, updateJobTitle } from "@controllers/JobTitleController";
import { checkUserRoleMiddleware } from '@/middlewares/AuthMiddleware';
import { USER_ROLES } from '@/enum/UserRoles';

const jobTitleRouter = Router();

// CREATE
jobTitleRouter.post('/', checkUserRoleMiddleware(USER_ROLES.ADMIN), createJobTitle)
// READ
jobTitleRouter.get('/', getAllJobTitles);
// UPDATE
jobTitleRouter.put('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), updateJobTitle)
// DELETE
jobTitleRouter.delete('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), deleteJobTitle)


export default jobTitleRouter