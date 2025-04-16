import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { USER_ROLES } from "../../server/src/enum/UserRoles.ts";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import CompanyListPage from "./pages/CompanyListPage.tsx";
import EmployeeListPage from "./pages/EmployeeListPage.tsx";
import DistributorListPage from "./pages/DistributorListPage.tsx";
import UserListPage from "./pages/admin/UserListPage.tsx";
import CompanyDetailsPage from "./pages/CompanyDetailsPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import ReferenceDataPage from "./pages/admin/ReferenceDataPage.tsx";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage.tsx";
import DistributorDetailsPage from "./pages/DistributorDetailsPage.tsx";
import AdminLogPage from "./pages/admin/AdminLogPage.tsx";
import AdminReviewPage from "./pages/admin/AdminReviewPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

export interface RouteMeta {
    title: string,
    showBackArrow?: boolean,
    selectedSidenavItem: string
}

export const metaFallback: RouteMeta = {
    title: 'Unknown',
    showBackArrow: false,
    selectedSidenavItem: 'Home'
}

export type RoutObjectWithMetaData = RouteObject & { meta: RouteMeta };

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/password-reset/:otp',
        element: <ResetPasswordPage />
    },
    {
        path: '/unauthorized',
        element: <LoginPage />
    },
    {
        element: <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]} />,
        children: [
            {
                path: '/users',
                element: <UserListPage />,
                meta: {
                    title: "Manage users",
                    showBackArrow: false,
                    selectedSidenavItem: "ManageUsers"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/reference-data',
                element: <ReferenceDataPage />,
                meta: {
                    title: "Reference data",
                    showBackArrow: false,
                    selectedSidenavItem: "ReferenceData"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/log',
                element: <AdminLogPage />,
                meta: {
                    title: "Log",
                    showBackArrow: false,
                    selectedSidenavItem: "Log"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/trash',
                element: <AdminReviewPage />,
                meta: {
                    title: "Trash",
                    showBackArrow: false,
                    selectedSidenavItem: "Trash"
                }
            } as RoutObjectWithMetaData

        ],
    },
    {
        element: <ProtectedRoute requiredRoles={[USER_ROLES.USER, USER_ROLES.ADMIN]} />,
        children: [
            {
                path: '/',
                element: <HomePage />,
                meta: {
                    title: "Home",
                    showBackArrow: false,
                    selectedSidenavItem: "Home"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/companies',
                element: <CompanyListPage />,
                meta: {
                    title: "Companies",
                    showBackArrow: false,
                    selectedSidenavItem: "Companies"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/companies/:companyId',
                element: <CompanyDetailsPage />,
                meta: {
                    title: "Company",
                    showBackArrow: true,
                    selectedSidenavItem: "Companies"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/employees',
                element: <EmployeeListPage />,
                meta: {
                    title: "Employees",
                    showBackArrow: false,
                    selectedSidenavItem: "Employees"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/employees/:employeeId',
                element: <EmployeeDetailsPage />,
                meta: {
                    title: "Employee",
                    showBackArrow: true,
                    selectedSidenavItem: "Employees"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/distributors',
                element: <DistributorListPage />,
                meta: {
                    title: "Distributors",
                    showBackArrow: false,
                    selectedSidenavItem: "Distributors"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/distributors/:distributorId',
                element: <DistributorDetailsPage />,
                meta: {
                    title: "Distributor",
                    showBackArrow: true,
                    selectedSidenavItem: "Distributors"
                }
            } as RoutObjectWithMetaData,
            {
                path: '/profile',
                element: <ProfilePage />,
                meta: {
                    title: "My Profile",
                    showBackArrow: true,
                    selectedSidenavItem: "Profile"
                }
            } as RoutObjectWithMetaData,
            {
                path: '*',
                element: <Navigate to="/" replace />
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    },
]);