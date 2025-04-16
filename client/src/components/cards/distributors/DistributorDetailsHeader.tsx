import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Distributor } from '../../../../../server/src/entities/Distributor';
import { Email, Print } from '@mui/icons-material';
import usePrivateApi from '../../../hooks/usePrivateApi';

type DistributorDetailsProps = {
    distributor: Distributor;
};

const DistributorDetailsHeader: React.FC<DistributorDetailsProps> = ({ distributor }) => {

    const privateApi = usePrivateApi()

    const handleDownload = async () => {
        try {
            const response = await privateApi.get(`/distributors/${distributor.id}/pdf`, {
                responseType: 'blob',
            });

            // Create a Blob from the PDF Stream
            const file = new Blob([response.data], { type: 'application/pdf' });

            // Build a URL from the file
            const fileURL = URL.createObjectURL(file);

            // Alternatively, you can download the file directly
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `${distributor.name}-distributor.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error during PDF download', error);
        }
    };

    const handleGetMailDistibutor = async () => {
        try {
            const response = await privateApi.get(`/distributors/${distributor.id}/mail`);
            const mails = response.data.mails

            // Copying to clipboard
            navigator.clipboard.writeText(mails).then(() => {
                console.log('Mails copied to clipboard successfully.');
                // TODO: Open Dialog wich holds that email distributor is copied to clipboard, Below a text with all the mails and below a button which says open email programm, (or close)
                // Open the default email program
                //window.open('mailto:', '_self');
            }).catch(err => {
                console.error('Could not copy mails to clipboard: ', err);
            });

        } catch (error) {
            console.error('Error during generating mail distributor', error);
        }
    };

    return (
        <Box display="flex" justifyContent="space-between">
            <Box>
                <Typography variant="h3">{distributor.name}</Typography>
                <Typography sx={{ mb: 2 }} color="secondary">{distributor.description}</Typography>
            </Box>
            <Box>
                <Button onClick={handleGetMailDistibutor} variant="outlined" sx={{ mr: 1 }}>
                    <Email />
                </Button>
                <Button onClick={handleDownload} variant="outlined" sx={{ mr: 1 }}>
                    <Print />
                </Button>
                <Button variant='contained'>Add employee</Button>
            </Box>
        </Box>
    );
};

export default DistributorDetailsHeader;
