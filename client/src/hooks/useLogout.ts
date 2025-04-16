import { useAuth } from "./useAuth";
import usePrivateApi from "./usePrivateApi";

const useLogout = (): (() => Promise<void>) => {
    const { logout: logoutFrontend } = useAuth();
    const privateApi = usePrivateApi()

    const logout = async () => {
        logoutFrontend()

        try {
            privateApi.post('/auth/logout')
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export default useLogout;