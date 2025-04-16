import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { Employee } from '../../../../../server/src/entities/Employee';

type EmployeeWorkDetailsProps = {
    employee: Employee;
};

// The EmployeeWorkDetails component
const WorksAtCard: React.FC<EmployeeWorkDetailsProps> = ({ employee }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Works at</Typography>
                    <Button size='small' onClick={() => navigate(`/companies/${employee.location.company.id}`)}>Go to company</Button>
                </Box>

                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <Typography variant="subtitle1">{employee.location.company.name}</Typography>
                    <Typography color="secondary" marginTop={-1} marginBottom={1} fontSize={14}>{employee.location.name}</Typography>
                </Box>
                {/* Additional location details can be uncommented and used here */}
            </CardContent>
        </Card>
    );
};

export default WorksAtCard;
