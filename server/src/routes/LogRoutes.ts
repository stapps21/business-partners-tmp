require('module-alias/register')
import { findLogPaginated, getLogEntry } from '@/controllers/LogController';
import { USER_ROLES } from '@/enum/UserRoles';
import { checkUserRoleMiddleware } from '@/middlewares/AuthMiddleware';
import { Router } from 'express';

const logRouter = Router();

logRouter.get('/paginated', checkUserRoleMiddleware(USER_ROLES.ADMIN), findLogPaginated);
logRouter.get('/:logId', checkUserRoleMiddleware(USER_ROLES.ADMIN), getLogEntry)

export default logRouter