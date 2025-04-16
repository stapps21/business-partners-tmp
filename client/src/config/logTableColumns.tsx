import { GridColDef } from "@mui/x-data-grid";
import { Log } from "../../../server/src/entities/Log";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { AccountCircle, Business, Person } from "@mui/icons-material";

const createLogTableColumns = (): GridColDef<Log>[] => [
    {
        field: "timestamp", headerName: "timestamp", flex: 1, maxWidth: 270,
        renderCell: (params) => {
            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                //second: '2-digit',
                hour12: false
            };
            const date = new Date(params.row.timestamp);
            return (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2">
                        {date.toLocaleString('de-DE', dateOptions)}
                    </Typography>
                    <Typography variant="body2" style={{ color: 'grey' }}>
                        {date.toLocaleString('de-DE', timeOptions)} Uhr
                    </Typography>
                </Box>
            );
        }
    },
    {
        field: "action", headerName: "action", flex: 1, maxWidth: 100, renderCell: (params) => {
            let color;
            let label;
            switch (params.value) {
                case 'CREATE':
                    color = 'green';
                    label = 'Create';
                    break;
                case 'UPDATE':
                    color = 'blue';
                    label = 'Update';
                    break;
                case 'DELETE':
                    color = 'red';
                    label = 'Delete';
                    break;
                default:
                    color = 'default';
                    label = 'default';
            }

            return (
                <Chip label={label} style={{ backgroundColor: color, color: 'white' }} />
            );
        }
    },
    {
        field: "name", headerName: "Name", flex: 1, renderCell: (params) => {
            const renderType = () => {
                if (params.row.entityName === 'Employee') {
                    return <><Person /><Typography sx={{ ml: 2 }}>{params.row.name}</Typography></>;
                } else if (params.row.entityName === 'Company') {
                    return <><Business /><Typography sx={{ ml: 2 }}>{params.row.name}</Typography></>;
                } else if (params.row.entityName === 'User') {
                    return <><AccountCircle /><Typography sx={{ ml: 2 }}>{params.row.name}</Typography></>;
                } else {
                    return null; // or some default icon
                }
            };
            return renderType()
        }
    },
    {
        field: "user", headerName: "user", flex: 1,
        renderCell: (params) => {
            const user = params.row.user
            return (
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ height: 32, width: 32, fontSize: 16, mr: 1 }}>{user.firstName[0]}{user.lastName[0]}</Avatar>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body2">
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" style={{ color: 'grey' }}>
                            {user.mail}
                        </Typography>
                    </Box>
                </Box>
            );
        }
    },
];

export default createLogTableColumns;
