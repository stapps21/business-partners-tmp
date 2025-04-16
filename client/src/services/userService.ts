import { USER_ROLES } from "../../../server/src/enum/UserRoles.ts";
import toast from "react-hot-toast";
import { AxiosInstance } from "axios";

// Types for your data
export interface IUserRequestBody {
    roles: USER_ROLES[],
    email: string,
    firstName: string,
    lastName: string
}

export type IUserResponse = {
    id: number,
    password: string,
    roles: USER_ROLES[],
    email: string,
    firstName: string,
    lastName: string,
    active: boolean,
    lastPasswordChange: string | null,
    createdAt: string
};

// Fetch
export const fetchUsersService = async (privateApi: AxiosInstance): Promise<IUserResponse[]> => {
    const response = privateApi.get<IUserResponse[]>('/users');
    return response.then(response => response.data);
};

// Create
export const createUserService = async ({ privateApi, newUser }: {
    privateApi: AxiosInstance,
    newUser: Omit<IUserRequestBody, 'id'>
}): Promise<IUserRequestBody> => {
    const response = privateApi.post<IUserRequestBody>('/users', newUser);
    await toast.promise(response, {
        loading: 'Creating user...',
        success: 'User created successfully!',
        error: 'Oops! There was an error creating the user',
    });
    return response.then(response => response.data);
};

