import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { Employee } from '../../../server/src/entities/Employee';
import { useNavigate } from 'react-router-dom';

interface EmployeeTableProps {
    employees: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    if (employees.length === 0) {
        return <Typography variant="h6" color="textSecondary">No Employees Available</Typography>;
    }

    const handleRowClick = (employeeId: number) => {
        navigate(`/employees/${employeeId}`);
    };

    return (
        <Table size="small" sx={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderCollapse: 'separate',
            borderLeft: '1px solid grey',
            borderTop: '1px solid grey',
            borderRight: '1px solid grey'
        }}>
            <TableHead >
                <TableRow >
                    <TableCell>Employee</TableCell>
                    <TableCell>Mail</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Mobile</TableCell>
                </TableRow>
            </TableHead >
            <TableBody>
                {employees.map((employee, idx) => (
                    <TableRow key={idx}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'
                            }
                        }}
                        onClick={() => handleRowClick(employee.id)}>
                        <TableCell sx={{ py: 2 }}>{employee.firstName} {employee.lastName}</TableCell>
                        <TableCell>{employee.contacts?.find(contact => contact.type === 'mail')?.value ?? ''}</TableCell>
                        <TableCell>{employee.contacts?.find(contact => contact.type === 'phone')?.value ?? ''}</TableCell>
                        <TableCell>{employee.contacts?.find(contact => contact.type === 'mobile')?.value ?? ''}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    );
};

export default EmployeeTable;
