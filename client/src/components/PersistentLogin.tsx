import { FC, ReactNode, useEffect, useState } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useLocalStorage from "../hooks/useLocalStorage";
import { useAuth } from "../hooks/useAuth.ts";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

interface PersistentLoginProps {
    children: ReactNode;
}

const PersistentLogin: FC<PersistentLoginProps> = ({ children }) => {
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { user } = useAuth();
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        // Avoids unwanted call to verifyRefreshToken
        if (!user && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false
        };
    }, []) // Depend on refreshToken

    return (
        <>
            {persist && isLoading ? (
                <Box position="fixed" top="0" left={0} height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center" flexDirection="column" bgcolor={theme.palette.background.default}>
                    <CircularProgress />
                    <Typography fontWeight="bold" fontSize={24}>Log in...</Typography>
                </Box>
            ) : children}
        </>
    )
}


export default PersistentLogin