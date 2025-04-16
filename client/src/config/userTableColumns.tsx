import { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { USER_ROLES } from "../../../server/src/enum/UserRoles";
import { User } from "../../../server/src/entities/User";

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const createUserTableColumns = (): GridColDef<User>[] => [
    { field: "id", headerName: "ID", width: 50, disableColumnMenu: true },
    {
        field: "fullName",
        headerName: "Full name",
        valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        flex: 1,
        disableColumnMenu: true
    },
    { field: "mail", headerName: "Email", flex: 1, disableColumnMenu: true },
    {
        field: "roles",
        headerName: "Role",
        sortable: false,
        renderCell: (params) => {
            return (
                <Chip
                    size="small"
                    label={params.row.roles.map(x => parseInt(x as unknown as string)).includes(USER_ROLES.ADMIN) ? 'Admin' : 'User'}
                />
            );
        },
        flex: 1,
        disableColumnMenu: true
    },
    {
        field: "active",
        headerName: "Status",
        sortable: false,
        renderCell: (params) => {
            return (
                <Chip
                    size="small"
                    label={params.row.active ? 'Active' : 'Inactive'}
                    color={params.row.active ? 'success' : 'error'}
                />
            );
        },
        width: 100,
        disableColumnMenu: true
    },
    {
        field: "createdAt", headerName: "Created at", width: 150, disableColumnMenu: true,
        renderCell: (params) => {
            return (<>{formatDate(params.row.createdAt as unknown as string)}</>);
        },
    },
];

export default createUserTableColumns;
