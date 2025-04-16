import React from 'react';
import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import AddFileCard from '../../AddFileCard';

type DSGVOPanelProps = {
    // Add any additional props if needed
};

// The DSGVOPanel component
const DSGVOPanel: React.FC<DSGVOPanelProps> = () => {
    // Define the onFileSelected function or pass it as a prop if necessary
    const onFileSelected = () => {
        // Handle file selection
    };

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">DSGVO</Typography>
                    <Button>TODO</Button>
                </Box>
                <Chip color='error' label="Nicht eingewilligt" size='small' sx={{ mb: 2 }} />
                <AddFileCard onFileSelected={onFileSelected} />
            </CardContent>
        </Card>
    );
};

export default DSGVOPanel;
