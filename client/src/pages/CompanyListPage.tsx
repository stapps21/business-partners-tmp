import { Box } from "@mui/material";
import { useMemo } from "react";
import { DataGrid, deDE } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DialogCreateCompany from "../components/dialogs/DialogCreateCompany.tsx";
import SearchBox from "../components/SearchBox.tsx";
import createCompanyTableColumns from "../config/companyTableColumns.tsx";
import { useFetchPaginatedData } from "../hooks/api/useFetchPaginatedData.ts";
import { Company as CompanyType } from '../../../server/src/entities/Company.ts'
import { CompanyContact as CompanyContactType } from '../../../server/src/entities/company/CompanyContact.ts'
import { Industry as IndustryType } from '../../../server/src/entities/company/Industry.ts'
import { CompanyAttachment as CompanyAttachmentType } from '../../../server/src/entities/company/CompanyAttachment.ts'
import { Location as LocationType } from '../../../server/src/entities/shared/Location.ts'
import MyCustomFooter from "../components/MyCustomFooter.tsx";

export interface CompanyData extends CompanyType {
    locations: LocationType[],
    contacts: CompanyContactType[],
    industries: IndustryType[],
    attachments: CompanyAttachmentType[],
}

const CompanyListPage = () => {
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
    } = useFetchPaginatedData<CompanyData>(
        '/companies',
        'companies',
        { initialLimit: 50, initialSortBy: 'name' }
    );

    const columns = useMemo(() => createCompanyTableColumns(), []);
    const rows = useMemo(() => data?.data ?? [], [data]);

    return (
        <Box mx="20px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Box style={{ flex: '0 1 50px' }} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchBox setSearchTerm={setSearchTerm} />
                <DialogCreateCompany />
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
                    navigate(`/companies/${params.row.id}`)
                }}
            />
        </Box>
    );
};

export default CompanyListPage;