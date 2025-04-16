import React from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Language from '@mui/icons-material/Language'; // Import the Language icon from MUI icons
import { Company } from '../../../../../server/src/entities/Company';
import DialogEditCompanyWebsite from '../../dialogs/DialogEditCompanyWebsite';

type CompanyWebsiteCardProps = {
    company: Company;
};

// The CompanyWebsiteCard component
const CompanyWebsiteCard: React.FC<CompanyWebsiteCardProps> = ({ company }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Website</Typography>
                    <DialogEditCompanyWebsite company={company} />
                </Box>
                <List>
                    {company.website ? (
                        <ListItem sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }} >
                                <Language />
                            </ListItemIcon>
                            <ListItemText primary={
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        textDecoration: 'none',
                                        color: 'white', // Set text color to white
                                    }}
                                    onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    {company.website}
                                </a>
                            } />
                        </ListItem>
                    ) : (
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary="No website available" />
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default CompanyWebsiteCard;
