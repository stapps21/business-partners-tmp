import { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload {
    user: {
        id: number;
        roles: number[];
    }
}

export interface JwtWithUserType extends JwtUserPayload, JwtPayload { }

export interface LoginResponseType {
    accessToken: string,
    firstName: string,
    lastName: string,
    mail: string
}