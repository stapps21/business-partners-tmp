import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, deDE } from '@mui/x-data-grid';
import { useAuth } from '../hooks/useAuth';
import { useFetchPaginatedData } from '../hooks/api/useFetchPaginatedData';
import createEmployeeTableColumns from '../config/employeeTableColumns';
import { Box, Typography } from '@mui/material';
import { Employee } from '../../../server/src/entities/Employee';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        data, isLoading, isRefetching,
        handlePaginationModelChange, handleSortModelChange,
        limit, page
    } = useFetchPaginatedData<Employee>('/employees/me-in-contact', 'employees');

    const columns = useMemo(() => (createEmployeeTableColumns()), []);
    const rows = useMemo(() => (data?.data ?? []), [data]);

    const handleRowClick = (params) => {
        const path = `/employees/${params.row.id}`;
        navigate(path);
    };

    return (
        <Box mx="32px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Box display="flex" flexDirection="column" justifyContent="space-between">
                <Typography variant="h3">Welcome back, {user?.firstName}!</Typography>
                <Typography sx={{ mb: 2 }} color="secondary">Here you can see all the employees you marked to often have contact with</Typography>
            </Box>

            <DataGrid
                style={{ flex: 1 }}
                localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                loading={isLoading || isRefetching}
                rows={rows}
                columns={columns}
                pagination
                paginationMode="server"
                paginationModel={{
                    pageSize: limit,
                    page: page - 1,
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                onPaginationModelChange={handlePaginationModelChange}
                onSortModelChange={handleSortModelChange}
                rowCount={data?.total ?? 0}
                onRowClick={handleRowClick}
            />
        </Box>
    );
};

export default HomePage;
