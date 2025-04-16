import { useEffect } from "react";
import { useAuth } from "./useAuth.ts";
import useRefreshToken from "./useRefreshToken.ts";
import { privateApi } from "../api/axios.ts";


const usePrivateApi = () => {
    const refresh = useRefreshToken();
    const { accessToken } = useAuth();

    useEffect(() => {

        const requestIntercept = privateApi.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = privateApi.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return privateApi(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            privateApi.interceptors.request.eject(requestIntercept);
            privateApi.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken, refresh])

    return privateApi;
}

export default usePrivateApi;