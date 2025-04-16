import { Box } from "@mui/material";
import { useMemo } from "react";
import { DataGrid, deDE } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox.tsx";
import createEmployeeTableColumns from "../config/employeeTableColumns.tsx";
import { useFetchPaginatedData } from "../hooks/api/useFetchPaginatedData.ts";
import { Employee as EmployeeType } from '../../../server/src/entities/Employee.ts'
import { EmployeeAttachment as EmployeeAttachmentType } from '../../../server/src/entities/employee/EmployeeAttachment.ts'
import { Subject as SubjectType } from '../../../server/src/entities/employee/Subject.ts'
import { JobTitle as JobTitleType } from '../../../server/src/entities/employee/JobTitle.ts'
import { EmployeeContact as EmployeeContactType } from '../../../server/src/entities/employee/EmployeeContact.ts'
import { Location as LocationType } from '../../../server/src/entities/shared/Location.ts'
import DialogCreateEmployee from "../components/dialogs/DialogCreateEmployee.tsx";
import MyCustomFooter from "../components/MyCustomFooter.tsx";

interface EmployeeData extends EmployeeType {
    locations: LocationType[],
    contacts: EmployeeContactType[],
    jobTitles: JobTitleType[],
    subjects: SubjectType[],
    attachments: EmployeeAttachmentType[],
}

const EmployeeListPage = () => {
    const navigate = useNavigate()

    const {
        data,
        isLoading,
        isRefetching,
        setSearchTerm,
        handlePaginationModelChange,
        handleSortModelChange,
        limit,
        page,
    } = useFetchPaginatedData<EmployeeData>(
        '/employees',
        'employees',
    );

    const columns = useMemo(() => createEmployeeTableColumns(), []);
    const rows = useMemo(() => data?.data ?? [], [data]);

    return (
        <Box mx="20px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Box style={{ flex: '0 1 50px' }} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchBox setSearchTerm={setSearchTerm} />
                <DialogCreateEmployee />
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
                slots={{ pagination: MyCustomFooter }}
                onRowClick={(params) => {
                    navigate(`/employees/${params.row.id}`)
                }}
            />
        </Box>
    );
};

export default EmployeeListPage;