require('module-alias/register')
import ResponseError from "../utils/ResponseError";
import { NextFunction, Request, Response } from "express";
import { updateUserService } from "@services/AuthService";
import { AppDataSource } from "@config/data-source";
import { User } from "@entities/User";
import jwt from 'jsonwebtoken';
import { JwtUserPayload, JwtWithUserType, LoginResponseType } from "@interfaces/api/AuthTypes";
import bcrypt from "bcrypt";
import convertToMilliseconds from "@utils/ExpiresInToMilisecondsConverter";

export const handleLogin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { mail, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { mail } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password === null) {
            return res.status(400).json({ message: "Password of user is not set yet" });
        }

        if (user.active === false) {
            return res.status(400).json({ message: "Admin deactivated this user" });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // HINT: user.roles get read as string array, even if it's saved as number array
        // That's why we convert them here manually to a number array
        const userRoles = user.roles.map((role: any) => parseInt(role))

        const payload: JwtUserPayload = {
            user: {
                id: user.id,
                roles: userRoles
            },
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

        // Set httpOnly cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: 'strict',
            maxAge: convertToMilliseconds(process.env.REFRESH_TOKEN_EXPIRES_IN)
        });

        // Save refresh token to database
        await updateUserService(user.id, { refreshToken });


        const response: LoginResponseType = {
            accessToken,
            firstName: user.firstName,
            lastName: user.lastName,
            mail: user.mail,
        }

        return res.json(response);
    } catch (error) {
        next(error);
    }
};

export const handleLogout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.sendStatus(204);
        return;
    }

    const refreshToken = cookies.jwt;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { refreshToken } });

    if (!user) {
        res.clearCookie('jwt')
        res.sendStatus(204);
        return
    }

    await updateUserService(user.id, { refreshToken: null });
    res.clearCookie('jwt')
    res.sendStatus(204);
};

export const handlePasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { otp, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { oneTimePassword: otp } });
        console.log("user", user)
        if (!user) {
            console.log("user11111", user)
            res.status(404).json({ message: "Password reset link already expired" });
            return
        }

        console.log("user11111--222222", user)
        if (user.otpExpiry === null || new Date(user.otpExpiry) <= new Date()) {
            console.log("user222222", user)
            res.status(404).json({ message: "Password reset link already expired" });
            return
        }
        console.log("user222222222--33333333")
        const salt = await bcrypt.genSalt();
        console.log("1111111111111111111111")
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("11122222222222222222", user?.id, hashedPassword)
        await updateUserService(user.id, { oneTimePassword: null, otpExpiry: null, password: hashedPassword });
        console.log("user222222222--33333333, sodd passn", user)
        return res.json({ message: "Passwort isch gsetzt" });
    } catch (error) {
        console.log("user MF")
        next(error);
    }
};

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cookies = req.cookies;
    if (!cookies['jwt']) {
        //next(new Error("No refresh token in cookie"));
        next(new ResponseError(401, "No refresh token in cookie", "COOKIE_401_NO_REFRESH_TOKEN"))
        return;
    }

    const refreshToken: string = cookies['jwt'];
    //res.clearCookie('jwt');

    //const foundUser = await User.findOne({ refreshToken }).exec();
    const userRepository = AppDataSource.getRepository(User);
    const userOfRefreshToken = await userRepository.findOne({ where: { refreshToken } });

    // Detected refresh token reuse!
    /*if (!userOfRefreshToken) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (err: any, decoded: any) => {
                if (err) {
                    next(new ResponseError(403, "403 Invalid token", "AUTH_403_NO_TOKEN"))
                    return;
                }

                console.log('attempted refresh token reuse!')
                const hackedUser = await userRepository.findOne({ where: { id: decoded.user.id } });

                if (hackedUser) {
                    hackedUser.refreshToken = "";
                    await hackedUser.save();
                }
            }
        )
        res.sendStatus(403);
        return;
    }*/

    //const newRefreshTokenArray = foundUser.refreshToken?.filter(rt => rt !== refreshToken) ?? [];
    if (!userOfRefreshToken) {
        next(new ResponseError(403, "Forbidden user not found with refresh token", "UNEXPECTED_ERROR"))
        return;
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded: JwtWithUserType) => {
            const decodedToken = decoded as JwtWithUserType;
            console.log(decodedToken)
            if (err || !decodedToken.user.id || userOfRefreshToken.id !== decoded.user.id) {
                next(new ResponseError(403, "Forbidden", "UNEXPECTED_ERROR"))
                return
            }
            const roles = userOfRefreshToken.roles;
            const accessToken = jwt.sign(
                {
                    user: {
                        id: decoded.user.id,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
            );
            res.status(200).json({ accessToken, firstName: userOfRefreshToken.firstName, lastName: userOfRefreshToken.lastName, mail: userOfRefreshToken.mail })
        }
    );
}