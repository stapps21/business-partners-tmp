require('module-alias/register')
import { Router } from 'express';
import { handleLogin, handleLogout, handlePasswordReset, handleRefreshToken } from "@controllers/AuthController";

const authRouter = Router();

authRouter.post('/login', handleLogin)
authRouter.post('/logout', handleLogout)
authRouter.post('/password-reset', handlePasswordReset)
authRouter.get('/refresh', handleRefreshToken)

export default authRouter