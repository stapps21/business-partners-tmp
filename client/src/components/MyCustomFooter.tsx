import { useGridApiContext, GridFooterContainer } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { MenuItem, Select } from '@mui/material';

const MyCustomFooter = () => {
    const apiRef = useGridApiContext();

    const handlePageChange = (event, value) => {
        apiRef.current.setPage(value - 1);
    };
    const handlePageSizeChange = (event) => {
        apiRef.current.setPageSize(Number(event.target.value));
    };

    // Define page size options
    const pageSizeOptions = [10, 20, 50, 100];

    // Current page size
    const currentPageSize = apiRef.current.state.pagination.paginationModel.pageSize;


    // Calculate the number of pages
    const totalPages = Math.ceil(apiRef.current.state.rows.totalRowCount / apiRef.current.state.pagination.paginationModel.pageSize);

    // Display current rows info
    const currentPage = apiRef.current.state.pagination.paginationModel.page + 1;
    const from = currentPage * apiRef.current.state.pagination.paginationModel.pageSize - apiRef.current.state.pagination.paginationModel.pageSize + 1;
    const to = from + apiRef.current.state.pagination.paginationModel.pageSize - 1;
    const rowsInfo = `Rows ${from}-${to}`;

    return (
        <GridFooterContainer style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 32px' }}>
            <div>{rowsInfo}</div>
            <Select
                sx={{ height: '40px' }}
                value={currentPageSize}
                onChange={handlePageSizeChange}
            >
                {pageSizeOptions.map((size) => (
                    <MenuItem key={size} value={size}>
                        {size}
                    </MenuItem>
                ))}
            </Select>
            {/* <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer> */}
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </GridFooterContainer>
    );
}

export default MyCustomFooter