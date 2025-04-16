import { GridColDef } from "@mui/x-data-grid";
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Typography } from "@mui/material";

const renderType = (params) => {
    if (params.value === 'employee') {
        return <><PersonIcon /></>;
    } else if (params.value === 'company') {
        return <><BusinessIcon /></>;
    } else if (params.value === 'user') {
        return <><AccountCircleIcon /></>;
    } else { 
        return null; // TODO: some default icon
    }
};

const highlightText = (text, search) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search.trim()})`, 'gi'));
    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === search.trim().toLowerCase()
                    ? <Box component="span" sx={{ bgcolor: '#999900', borderRadius: 0 }} key={index}>{part}</Box>
                    : part
            )}
        </span>
    );
};


const searchTableColumns = (localSearch: string): GridColDef[] => [
    {
        field: "type",
        headerName: "",
        minWidth: 48,
        width: 48,
        renderCell: renderType
    },
    {
        field: "text", headerName: "Text", flex: 1,
        renderCell: (params) => <Typography>{highlightText(params.value, localSearch)}</Typography>
    },
];

export default searchTableColumns;
