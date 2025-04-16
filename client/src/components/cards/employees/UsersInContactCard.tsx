import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Info from '@mui/icons-material/Info';
import { Employee } from '../../../../../server/src/entities/Employee';
import UsersInContactTable from '../../UsersInContactTable';
import DialogAddEmployeeUsersInContact from '../../dialogs/DialogAddEmployeeUsersInContact';
import { useCreateData } from '../../../hooks/api/useCreateData';
import { RequestAddEmployeeUsersInContact } from '../../../../../business-partners-common/src/types/employee.ts';
import { useAuth } from '../../../hooks/useAuth';

type UsersInContactCardProps = {
    employee: Employee;
};

// The UsersInContactCard component
const UsersInContactCard: React.FC<UsersInContactCardProps> = ({ employee }) => {
    const { user } = useAuth()
    const { handleSubmit: handleCreate } = useCreateData<RequestAddEmployeeUsersInContact>(`/employees/${employee.id}/user-in-contact`, `employee-${employee.id}`);

    const assignSelf = () => {
        handleCreate({ userInContactId: user?.id }, {
            onSuccess: () => { },
            onError: (error: Error) => console.error('Error adding user in contact:', error),
        });
    };
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                    <Typography variant="h5">Users in contact</Typography>
                    <Box>
                        {!employee.usersInContact.some(userInContact => userInContact.id === user?.id) &&
                            <Button size='small' variant="text" onClick={assignSelf}>Assign me</Button>
                        }
                        <DialogAddEmployeeUsersInContact employee={employee} />
                    </Box>

                </Box>
                {employee.usersInContact && employee.usersInContact.length > 0 ? (
                    <Box>
                        <UsersInContactTable employee={employee} usersInContact={employee.usersInContact} />
                    </Box>
                ) : (
                    <Box textAlign="center" color="text.secondary" p={3}>
                        <Info sx={{ fontSize: 48 }} />
                        <Typography variant="body1" gutterBottom>
                            No intern users assigned
                        </Typography>
                        <Typography variant="body2">
                            It looks like there are no intern users associated with this employee. You can add intern users by clicking the "TODO" button.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default UsersInContactCard;
