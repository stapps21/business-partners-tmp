import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth.ts";
import Sidebar from "./Sidebar.tsx";
import Topbar from "./Topbar.tsx";
import { USER_ROLES } from "../../../server/src/enum/UserRoles.ts";
import { Box, useTheme } from '@mui/material';

interface ProtectedRouteProps {
    requiredRoles: USER_ROLES[];
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
    const theme = useTheme()
    const { user } = useAuth();

    // Check for authentication and required roles
    if (!user) {
        // User not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (!user || !requiredRoles.some((role) => user.roles.includes(role))) {
        // User doesn't have the required roles, redirect to an unauthorized page or show a message
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <Box className="app" bgcolor={theme.palette.background.default}>
            <Sidebar />
            <main className="content" style={{ overflowY: "hidden" }} >
                <Topbar />
                <div style={{ overflowY: "auto", height: "calc(100vh - 75px)" }}>
                    <Outlet />
                </div>
            </main>
        </Box>
    );
};

export default ProtectedRoute;
