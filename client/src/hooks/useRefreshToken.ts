import api from "../api/axios.ts";
import { useAuth } from "./useAuth.ts";

const useRefreshToken = (): (() => Promise<string>) => {
    const { login } = useAuth();

    return async (): Promise<string> => {
        const response = await api.get("/auth/refresh", {
            withCredentials: true,
        });
        const accessToken = response.data.accessToken
        login(accessToken, response.data.firstName, response.data.lastName, response.data.mail)
        return accessToken;
    };
};

export default useRefreshToken;