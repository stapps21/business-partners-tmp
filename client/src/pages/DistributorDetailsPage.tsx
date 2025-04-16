import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useFetchData } from '../hooks/api/useFetchData.ts';
import { Employee } from '../../../server/src/entities/Employee.ts';
import { Distributor } from '../../../server/src/entities/Distributor.ts';
import { useFetchPaginatedData } from '../hooks/api/useFetchPaginatedData.ts';
import DistributorDetailsHeader from '../components/cards/distributors/DistributorDetailsHeader.tsx';




const DistributorDetailsPage = () => {
    const { distributorId } = useParams();
    const { data: distributor, isLoading } = useFetchData<Distributor>(`/distributors/${distributorId}`, `distributor-${distributorId}`);
    const { data: employees } = useFetchPaginatedData<Employee>(`/distributors/${distributorId}/employees`, `distributor-employees-${distributorId}`);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    if (!employees) {
        return <Typography variant="h6" align="center">No distributor found</Typography>;
    }

    return (

        <Box sx={{ padding: 4 }}>
            <Grid container spacing={2}>

                {/* Top Header */}
                <Grid item xs={12}>
                    {distributor &&
                        <DistributorDetailsHeader distributor={distributor} />
                    }
                </Grid>

                {/* Content */}
                <Grid item xs={12}>
                    {employees?.data.map(emp => <div key={emp.id}>{emp.firstName}</div>)}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DistributorDetailsPage;
