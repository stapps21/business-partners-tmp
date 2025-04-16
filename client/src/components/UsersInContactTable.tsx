import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
import { User } from '../../../server/src/entities/User';
import { ActionIcons, ActionTableCell } from './table-cell/ActionTableCell';
import DialogRemoveUserInContact from './dialogs/DialogRemoveUserInContact';
import { Employee } from '../../../server/src/entities/Employee';

interface EmployeeTableProps {
    employee: Employee,
    usersInContact: User[];
}

const UsersInContactTable: React.FC<EmployeeTableProps> = ({ employee, usersInContact }) => {
    const theme = useTheme();
    //const navigate = useNavigate();

    if (usersInContact.length === 0) {
        return <Typography variant="h6" color="textSecondary">No Users in contact</Typography>;
    }

    const handleRowClick = (distributorId: number) => {
        //navigate(`/users/${distributorId}`);
    };

    return (
        <Table size="small" sx={{ m: 0 }}>
            <TableHead>
                <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Mail</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {usersInContact.map((userInContact, idx) => (
                    <TableRow key={idx}
                        hover
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'
                            },
                            '&:hover .action-icons': { visibility: 'visible' }, maxHeight: '20px'
                        }}
                        onClick={() => handleRowClick(userInContact.id)}>
                        <TableCell sx={{ py: 2, width: '250px' }}>{userInContact.firstName} {userInContact.lastName}</TableCell>
                        <TableCell>{userInContact.mail}</TableCell>
                        <ActionTableCell>
                            <ActionIcons className="action-icons">
                                <DialogRemoveUserInContact employee={employee} userInContact={userInContact} />
                            </ActionIcons>
                        </ActionTableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UsersInContactTable;
