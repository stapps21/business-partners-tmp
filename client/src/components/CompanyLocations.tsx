import { FC, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Company } from '../../../server/src/entities/Company';
import { Info } from '@mui/icons-material';
import LocationCard from './LocationCard';
import EmployeeTable from './EmployeeTable';
import DialogAddLocation from './dialogs/DialogAddLocation';
import DialogCreateEmployeeOfCompany from './dialogs/DialogCreateEmployeeOfCompany';

interface Props {
    company: Company;
}

const CompanyLocations: FC<Props> = ({ company }) => {
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const theme = useTheme();

    const handleLocationSelect = (locationId: number) => {
        if (company.locations.length <= 1)
            return

        setSelectedLocation(locationId);
    };

    const handleResetLocation = () => {
        setSelectedLocation(null);
    };

    const isSelected = (locationId: number): boolean => {
        return locationId === selectedLocation;
    };

    const renderNoEmployees = () => {
        const noEmployeesText = selectedLocation
            ? `No Employees at ${company.locations.find(location => location.id === selectedLocation)?.name}`
            : "No Employees in the Company";

        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop={2}>
                <Info style={{ fontSize: 32, color: theme.palette.grey[500] }} />
                <Typography variant="h6" color="textSecondary">{noEmployeesText}</Typography>
                {selectedLocation ? (
                    <Button size='small' color="primary" onClick={handleResetLocation}>
                        Show All Employees
                    </Button>
                ) : (
                    <Button size='small' color="primary">
                        Add Employee
                    </Button>
                )}
            </Box>
        );
    }

    const employeesForLocation = selectedLocation === null
        ? company.locations.flatMap(location => location.employees)
        : company.locations.find(location => location.id === selectedLocation)?.employees || [];

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h5">Locations</Typography>
                    <DialogAddLocation company={company} />
                </Box>
                <Grid container spacing={2}>
                    {company.locations.map((location) => (
                        <Grid item xs={12} sm={6} lg={4} key={location.id}>
                            <LocationCard
                                company={company}
                                location={location}
                                isSelected={isSelected(location.id)}
                                onSelect={() => handleLocationSelect(location.id)}
                            />
                        </Grid>
                    ))}
                </Grid>


                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} marginTop={4}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h5">
                            {selectedLocation
                                ? `Employees at ${company.locations.find(location => location.id === selectedLocation)?.name}`
                                : 'All Employees'}
                        </Typography>
                        {selectedLocation &&
                            <Button
                                sx={{ ml: 1 }}
                                size='small'
                                variant='text'
                                color="primary"
                                onClick={handleResetLocation}
                            >
                                Show from all locations
                            </Button>
                        }
                    </Box>
                    <DialogCreateEmployeeOfCompany company={company} />
                </Box>
                {employeesForLocation.length > 0 ? (
                    <EmployeeTable employees={employeesForLocation} />
                ) : renderNoEmployees()}

            </CardContent>
        </Card>
    );
};

export default CompanyLocations;
