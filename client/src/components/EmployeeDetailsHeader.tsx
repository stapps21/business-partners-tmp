import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { Employee } from '../../../server/src/entities/Employee';
import DialogEditEmployee from './dialogs/DialogEditEmployee';

type EmployeeDetailsProps = {
    employee: Employee;
};

const EmployeeDetailsHeader: React.FC<EmployeeDetailsProps> = ({ employee }) => {
    return (
        <Box display="flex" justifyContent="space-between">
            <Box>
                <Typography color="primary">{employee.salutation} {employee.title}</Typography>
                <Typography variant="h3">{employee.firstName} {employee.lastName}</Typography>
                <Typography variant="h5" sx={{ mt: 0 }} color="secondary">
                    {employee.jobTitles.map(jobTitle => jobTitle.name).join(', ')}
                </Typography>
                {employee.subjects.length > 0 &&
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, mt: 2 }}>
                        {employee.subjects.map((subject, index) => (
                            <Chip key={index} label={subject.name} />
                        ))}
                    </Box>
                }
            </Box>
            <Box>
                <DialogEditEmployee employee={employee} />
            </Box>
        </Box>
    );
};

export default EmployeeDetailsHeader;
