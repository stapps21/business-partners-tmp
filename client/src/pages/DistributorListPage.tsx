import { Box, Button, Card, CardContent, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox.tsx";
import { useFetchPaginatedData } from "../hooks/api/useFetchPaginatedData.ts";
import { Distributor, Distributor as DistributorType } from '../../../server/src/entities/Distributor.ts'
import DialogCreateDistributor from "../components/dialogs/DialogCreateDistributor.tsx";
import { CopyAll, Print } from "@mui/icons-material";

const DistributorCard = ({ distributor, onClick }) => {
    // Function to handle copy to clipboard
    const handleCopyEmail = (event: Event) => {
        event.stopPropagation()
        navigator.clipboard.writeText("This is copied"); // Replace with your email field
        //onCopyEmail(); // Optional callback
    };

    const handlePrint = (event: Event) => {
        event.stopPropagation()
        //navigator.clipboard.writeText(distributor.email); // Replace with your email field
        //onCopyEmail(); // Optional callback
    };

    return (
        <Card
            sx={{ maxWidth: 345, mb: 2, boxShadow: 3, '&:hover': { boxShadow: 6, cursor: 'pointer' } }}
            onClick={onClick}
        >
            <Typography align="center" fontSize="72px">
                📧 {distributor.emoji} {/* Replace with your emoji field */}
            </Typography>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {distributor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {distributor.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {distributor.location} {/* Example additional field */}
                </Typography>
            </CardContent>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Tooltip title="Print Address List">
                    <IconButton onClick={handlePrint}>
                        <Print />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy Email">
                    <IconButton onClick={handleCopyEmail}>
                        <CopyAll />
                    </IconButton>
                </Tooltip>
            </CardContent>
        </Card>
    );
};


const DistributorListPage = () => {
    const navigate = useNavigate()
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const {
        data,
        isLoading,
        setSearchTerm,
        setPage
    } = useFetchPaginatedData<DistributorType[]>(
        '/distributors',
        'distributors'
    );

    useEffect(() => {
        setDistributors([]);
    }, []);

    useEffect(() => {
        if (data?.data) {
            setDistributors(prev => [...prev, ...data.data]);
        }
    }, [data]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <Box mx="20px" pt='32px' pb='16px' height="100%" display="flex" flexDirection="column">
            <Box style={{ flex: '0 1 50px' }} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchBox setSearchTerm={setSearchTerm} />
                <DialogCreateDistributor />
            </Box>
            <Grid container spacing={2}>
                {distributors.map(item => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <DistributorCard distributor={item} onClick={() => navigate(`/distributors/${item.id}`)} />
                    </Grid>
                ))}
            </Grid>
            {isLoading && <p>Loading...</p>}
            {(data?.total ?? 0) > distributors.length &&
                <Button onClick={handleLoadMore} disabled={isLoading}>
                    Load More
                </Button>
            }
        </Box>
    );
};

export default DistributorListPage;