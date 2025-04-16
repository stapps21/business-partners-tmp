import { Box, TableCell, styled } from "@mui/material";

export const ActionIcons = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    visibility: 'hidden',
    '&:hover': {
        visibility: 'visible'
    }
}));

export const ActionTableCell = styled(TableCell)({
    width: '10%',
    textAlign: 'right'
});