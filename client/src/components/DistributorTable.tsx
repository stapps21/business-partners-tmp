import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Distributor } from '../../../server/src/entities/Distributor';

interface EmployeeTableProps {
    distributors: Distributor[];
}

const DistributorTable: React.FC<EmployeeTableProps> = ({ distributors }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    if (distributors.length === 0) {
        return <Typography variant="h6" color="textSecondary">No Distributor Available</Typography>;
    }

    const handleRowClick = (distributorId: number) => {
        navigate(`/distributors/${distributorId}`);
    };

    return (
        <Table size="small" sx={{ m: 0 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Distributor</TableCell>
                    <TableCell>Beschreibung</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {distributors.map((distributor, idx) => (
                    <TableRow key={idx}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'
                            }
                        }}
                        onClick={() => handleRowClick(distributor.id)}>
                        <TableCell sx={{ py: 2, width: '250px' }}>{distributor.name}</TableCell>
                        <TableCell>{distributor.description}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DistributorTable;
