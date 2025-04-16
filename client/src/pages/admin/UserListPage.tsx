import { Box, Button } from '@mui/material';
import { useState } from "react";
import UserCreationDialog from "../../components/dialogs/UserCreationDialog.tsx";
import { DataGrid, deDE, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useQuery } from "react-query";
import usePrivateApi from "../../hooks/usePrivateApi.ts";
import { fetchUsersService } from "../../services/userService.ts";
import SearchBox from '../../components/SearchBox.tsx';
import createUserTableColumns from '../../config/userTableColumns.tsx';

const UserListPage = () => {
    const privateApi = usePrivateApi()

    const fetchUsers = async () => fetchUsersService(privateApi)
    const { data: users, isLoading } = useQuery('users', fetchUsers);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns: GridColDef[] = createUserTableColumns()
    const rows: GridRowsProp[] = users as unknown as GridRowsProp[] ?? []


    return (
        <Box mx="20px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Box style={{ flex: '0 1 50px' }} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchBox setSearchTerm={() => { }} />
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Create user
                </Button>
            </Box>
            <UserCreationDialog open={open} handleClose={handleClose} />
            <DataGrid
                style={{ flex: 1 }}
                localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                loading={isLoading}
                rows={rows}
                columns={columns}
            />
        </Box>
    );
};

export default UserListPage;