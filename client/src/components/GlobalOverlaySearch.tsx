import { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, deDE } from '@mui/x-data-grid';
import { useFetchPaginatedData } from '../hooks/api/useFetchPaginatedData';
import { useNavigate } from 'react-router-dom';
import searchTableColumns from '../config/searchTableColumns';
import GlobalSearchBox from './GlobalSearchBox';
import { Search } from '@mui/icons-material';
import MyCustomFooter from './MyCustomFooter';

const StyledOverlay = styled('div')(({ theme, show }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    backdropFilter: 'blur(8px)',
    transition: 'background-color 0.5s',
    zIndex: show ? 998 : -1,
}));

const GlobalOverlaySearch = () => {
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const {
        data, isLoading, isRefetching, setSearchTerm, searchTerm,
        handlePaginationModelChange, handleSortModelChange,
        limit, page
    } = useFetchPaginatedData('/search', 'search');

    const columns = useMemo(() => (searchTableColumns(searchTerm)), [searchTerm]);

    const rows = useMemo(() => (data?.data.map(item => ({
        ...item,
        id: `${item.type}-${item.id}`,
        entityId: item.id,
    })) || []
    ), [data]);

    const handleRowClick = (params) => {
        const path = `/${params.row.type === 'employee' ? 'employees' : 'companies'}/${params.row.entityId}`;
        navigate(path);
        setIsFocused(false)
    };

    useEffect(() => {
        if (!isFocused)
            setSearchTerm('')
    }, [isFocused, setSearchTerm])

    const searchBoxStyle = isFocused
        ? { position: 'fixed', top: '8px', left: 'calc(50% - 260px)', zIndex: 1001, width: 520, transform: 'translateY(80px)', transition: 'width 0.3s, transform 0.3s' }
        : { position: 'relative', zIndex: 1000, width: 360, transform: 'translateY(0px)', transition: 'width 0.3s, transform 0.3s' };


    return (
        <>
            <StyledOverlay show={isFocused} onClick={() => {
                setIsFocused(false)
            }} />
            <GlobalSearchBox
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                sx={searchBoxStyle}
                onFocus={() => setIsFocused(true)}
            />
            {isFocused && ((searchTerm === '') ? (
                <Box
                    sx={{
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Search sx={{ fontSize: 60, marginBottom: 2 }} />
                    <Typography variant="h4">
                        {searchTerm === "" ? 'Ready to Discover?' : 'Keep Exploring!'}
                    </Typography>
                    <Typography variant="subtitle1">
                        {searchTerm === ""
                            ? "Type in what you're looking for and embark on your journey of discovery."
                            : 'We couldn’t find any matches, but your next discovery might be just a few keystrokes away!'}
                    </Typography>
                </Box>
            ) : (
                <DataGrid
                    style={{ flex: 1 }}
                    sx={{ position: 'fixed', top: 200, height: 'calc(100vh - 232px)', width: '80%', left: '10%', right: '10%', zIndex: 1000 }}
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
                    onRowClick={handleRowClick}
                />
            ))}
        </>
    );
};

export default GlobalOverlaySearch;
