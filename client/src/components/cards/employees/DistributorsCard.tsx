import React from 'react';
import { Box, Button, Card, CardContent, Typography, Divider } from '@mui/material';
import Info from '@mui/icons-material/Info'; // Assuming you're using MUI icons
import { Employee } from '../../../../../server/src/entities/Employee';
import DistributorTable from '../../DistributorTable';
import DialogAddEmployeeDistributor from '../../dialogs/DialogAddEmployeeDistributor';

type DistributorsCardProps = {
    employee: Employee;
};

// The DistributorsCard component
const DistributorsCard: React.FC<DistributorsCardProps> = ({ employee }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                    <Typography variant="h5">Distributors</Typography>
                    <DialogAddEmployeeDistributor employee={employee} />
                </Box>
                {employee.distributors && employee.distributors.length > 0 ? (
                    <Box>
                        <DistributorTable distributors={employee.distributors} />
                    </Box>
                ) : (
                    <Box textAlign="center" color="text.secondary" p={3}>
                        <Info sx={{ fontSize: 48 }} />
                        <Typography variant="body1" gutterBottom>
                            No distributors assigned
                        </Typography>
                        <Typography variant="body2">
                            It looks like there are no distributors associated with this employee. You can add distributors by clicking the "TODO" button.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default DistributorsCard;
