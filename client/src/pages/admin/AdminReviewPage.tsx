import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, deDE } from '@mui/x-data-grid';
import { useFetchPaginatedData } from '../../hooks/api/useFetchPaginatedData';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import createCompanyTableColumnsDeactivated from '../../config/companyTableColumnsDeactivated';
import { Company } from '../../../../server/src/entities/Company';
import { Employee } from '../../../../server/src/entities/Employee';
import createEmployeeTableColumnsDeactivated from '../../config/employeeTableColumnsDeactivated';


const AdminReviewPage = () => {
    const navigate = useNavigate()
    const {
        data: companies,
        isLoading: isLoadingCompanies,
        isRefetching: isRefetchingCompanies,
        handlePaginationModelChange: handlePaginationModelChangeCompanies,
        handleSortModelChange: handleSortModelChangeCompanies,
        limit: limitCompanies,
        page: pageCompanies,
    } = useFetchPaginatedData<Company>(
        '/companies/inactive',
        'companies-deactivated',
        { initialLimit: 50, initialSortBy: 'name' }
    );

    const {
        data: employees,
        isLoading: isLoadingEmployees,
        isRefetching: isRefetchingEmployees,
        handlePaginationModelChange: handlePaginationModelChangeEmployees,
        handleSortModelChange: handleSortModelChangeEmployees,
        limit: limitEmployees,
        page: pageEmployees,
    } = useFetchPaginatedData<Employee>(
        '/employees/inactive',
        'employees-deactivated',
        { initialLimit: 50, initialSortBy: 'firstName' }
    );

    const columnsCompany = useMemo(() => createCompanyTableColumnsDeactivated(), []);
    const rowsCompany = useMemo(() => companies?.data ?? [], [companies]);

    const columnsEmployee = useMemo(() => createEmployeeTableColumnsDeactivated(), []);
    const rowsEmployee = useMemo(() => employees?.data ?? [], [employees]);

    return (
        <Box mx="20px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Typography color="secondary" gutterBottom>Review and manage deactivated companies and employees<br />You can permanently delete them or reactivate them as needed.</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} >


                    <DataGrid
                        style={{ flex: 1 }}
                        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                        loading={isLoadingCompanies || isRefetchingCompanies}
                        rows={rowsCompany}
                        columns={columnsCompany}
                        pagination
                        paginationMode="server"
                        paginationModel={{
                            pageSize: limitCompanies,
                            page: pageCompanies - 1,
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        onPaginationModelChange={handlePaginationModelChangeCompanies}
                        onSortModelChange={handleSortModelChangeCompanies}
                        rowCount={companies?.total ?? 0}
                        onRowClick={(params) => {
                            navigate(`/companies/${params.row.id}`)
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} >
                    <DataGrid
                        style={{ flex: 1 }}
                        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                        loading={isLoadingEmployees || isRefetchingEmployees}
                        rows={rowsEmployee}
                        columns={columnsEmployee}
                        pagination
                        paginationMode="server"
                        paginationModel={{
                            pageSize: limitEmployees,
                            page: pageEmployees - 1,
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        onPaginationModelChange={handlePaginationModelChangeEmployees}
                        onSortModelChange={handleSortModelChangeEmployees}
                        rowCount={employees?.total ?? 0}
                        onRowClick={(params) => {
                            navigate(`/employees/${params.row.id}`)
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};


export default AdminReviewPage;
