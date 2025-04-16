require('module-alias/register')
import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, getUserMe, updateUser } from "@controllers/UserController";
import { USER_ROLES } from '@/enum/UserRoles';
import { checkUserRoleMiddleware } from '@/middlewares/AuthMiddleware';

const userRouter = Router();

// CREATE
userRouter.post('/', checkUserRoleMiddleware(USER_ROLES.ADMIN), createUser)
// READ
userRouter.get('/', checkUserRoleMiddleware(USER_ROLES.ADMIN), getAllUsers);
userRouter.get('/me', getUserMe)
userRouter.get('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), getUser)
// UPDATE
userRouter.put('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), updateUser)
// DELETE
userRouter.delete('/:id', checkUserRoleMiddleware(USER_ROLES.ADMIN), deleteUser)


export default userRouter