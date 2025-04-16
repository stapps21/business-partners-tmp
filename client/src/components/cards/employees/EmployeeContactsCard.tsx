import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Employee } from '../../../../../server/src/entities/Employee';
import ContactList from '../../ContactList';

type EmployeeContactsCardProps = {
    employee: Employee;
};

const EmployeeContactsCard: React.FC<EmployeeContactsCardProps> = ({ employee }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                    <Typography variant="h5">Contacts</Typography>
                    <Button>TODO</Button>
                </Box>
                {employee.contacts && employee.contacts.length > 0 ? (
                    <ContactList companyId={employee.id} contacts={employee.contacts} />
                ) : (
                    <Typography variant="body1" style={{ textAlign: 'center' }}>
                        No contacts available. Click 'Add Contact' to create a new contact.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default EmployeeContactsCard;
