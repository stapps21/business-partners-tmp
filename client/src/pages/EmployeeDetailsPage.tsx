import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material';
import { useFetchData } from '../hooks/api/useFetchData.ts';
import NotesCard from '../components/cards/employees/NotesCard.tsx';
import DistributorsCard from '../components/cards/employees/DistributorsCard.tsx';
import UsersInContactCard from '../components/cards/employees/UsersInContactCard.tsx';
import EmployeeDetailsHeader from '../components/EmployeeDetailsHeader.tsx';
import WorksAtCard from '../components/cards/employees/WorksAtCard.tsx';
import DSGVOPanel from '../components/cards/employees/DSGVOPanel.tsx';
import AttachmentsCard from '../components/cards/companies/AttachmentsCard.tsx';
import ContactsCard from '../components/cards/companies/ContactsCard.tsx';
import { Employee } from '../../../server/src/entities/Employee.ts';
import DialogDeactivateEmployee from '../components/dialogs/DialogDeactivateEmployee.tsx';

const EmployeeDetailsPage = () => {
    const { employeeId } = useParams();
    const { data: employee, isLoading } = useFetchData<Employee>(`/employees/${employeeId}`, `employee-${employeeId}`);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    if (!employee) {
        return <Typography variant="h6" align="center">No employee found</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={2}>

                {/* Top employee header */}
                <Grid item xs={12}>
                    {!employee.active &&
                        <Tooltip title="This employee is currently deactivated. It is not visible to regular users but remains accessible for administrative purposes.">
                            <Chip size='small' sx={{ mb: 2 }} label="Deactivated" color="error" />
                        </Tooltip>
                    }
                    <EmployeeDetailsHeader employee={employee} />
                </Grid>

                {/* Main Column */}
                <Grid item sm={12} lg={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <NotesCard employee={employee} />
                        </Grid>
                        <Grid item xs={12} >
                            <UsersInContactCard employee={employee} />
                        </Grid>
                        <Grid item xs={12} >
                            <DistributorsCard employee={employee} />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right column */}
                <Grid item sm={12} lg={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <WorksAtCard employee={employee} />
                        </Grid>
                        <Grid item sm={12} >
                            <ContactsCard entityType="employee" id={employee.id} contacts={employee.contacts} />
                        </Grid>
                        <Grid item sm={12} >
                            <DSGVOPanel />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Attachments */}
                <Grid item xs={12} sx={{ pb: 4 }}>
                    <AttachmentsCard attachments={employee.attachments} folder="employee" id={employee.id} />
                </Grid>
            </Grid>

            {/* Footer (createdAt - delete) */}
            <Grid item xs={12} md={12} sx={{ pb: 4 }} display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="secondary" fontSize={14}>Created at: {new Date(employee.createdAt).toLocaleDateString()}</Typography>
                <DialogDeactivateEmployee employee={employee} />
            </Grid>
        </Box>
    );
};

export default EmployeeDetailsPage;
