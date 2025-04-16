import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Employee } from '../../../../../server/src/entities/Employee';
import DialogEditEmployeeNotes from '../../dialogs/DialogEditEmployeeNotes';

type NotesCardProps = {
    employee: Employee;
};

const NotesCard: React.FC<NotesCardProps> = ({ employee }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Typography variant="h5">Notes</Typography>
                    <DialogEditEmployeeNotes employee={employee} />
                </Box>

                <pre style={{ width: '100%', whiteSpace: 'pre-wrap' }}>
                    <Typography
                        sx={(employee.notes?.length ?? 0) === 0 ? {
                            color: "grey.400",
                        } : {}}
                        paragraph
                    >
                        {(employee.notes?.length ?? 0) === 0 ? 'No notes' : employee.notes}

                    </Typography>
                </pre>
            </CardContent>
        </Card >
    );
};

export default NotesCard;
