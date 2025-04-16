import { Box } from '@mui/material';
import { useFetchPaginatedData } from '../../hooks/api/useFetchPaginatedData';
import { Log } from '../../../../server/src/entities/Log';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import createLogTableColumns from '../../config/logTableColumns';
import SearchBox from '../../components/SearchBox';
import { DataGrid, deDE } from '@mui/x-data-grid';
import MyCustomFooter from '../../components/MyCustomFooter';
import useDialogState from '../../hooks/useDialogState';
import DialogShowDifferences from '../../components/dialogs/DialogShowDifferences';


const AdminLogPage = () => {
    const navigate = useNavigate()
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const [logId, setLogId] = useState<number | null>(null)
    const {
        data,
        isLoading,
        isRefetching,
        setSearchTerm,
        handlePaginationModelChange,
        handleSortModelChange,
        limit,
        page,
    } = useFetchPaginatedData<Log>(
        '/log',
        'log',
        { initialLimit: 50, initialSortBy: 'timestamp', initialSortOrder: 'DESC' }
    );

    const columns = useMemo(() => createLogTableColumns(), []);
    const rows = useMemo(() => data?.data ?? [], [data]);

    return (<>
        <Box mx="20px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Box style={{ flex: '0 1 50px' }} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchBox setSearchTerm={setSearchTerm} />
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
                slots={{ pagination: MyCustomFooter }}
                pageSizeOptions={[10, 25, 50, 100]}
                onPaginationModelChange={handlePaginationModelChange}
                onSortModelChange={handleSortModelChange}
                rowCount={data?.total ?? 0}
                onRowClick={(params, event) => {
                    setLogId(params.row.id)
                    handleOpenDialog()
                    //navigate(`/companies/${params.row.id}`)
                }}
            />
        </Box>
        {logId !== null &&
            <DialogShowDifferences id={logId} isDialogOpen={isDialogOpen} handleCloseDialog={handleCloseDialog} />
        }
    </>
    );
};


export default AdminLogPage;
