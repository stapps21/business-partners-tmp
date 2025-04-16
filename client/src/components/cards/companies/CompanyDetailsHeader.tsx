import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Company } from '../../../../../server/src/entities/Company';
import DialogEditCompany from '../../dialogs/DialogEditCompany';

type CompanyDetailsProps = {
    company: Company;
};

const CompanyDetailsHeader: React.FC<CompanyDetailsProps> = ({ company }) => {
    return (
        <Box display="flex" justifyContent="space-between">
            <Box>
                <Typography variant="h3">{company.name}</Typography>
                <Typography sx={{ mb: 2 }} color="secondary">{company.notes}</Typography>
                {company.industries.length > 0 &&
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {company.industries.map((industry, index) => (
                            <Chip key={index} label={industry.name} />
                        ))}
                    </Box>
                }
            </Box>
            <Box>
                <DialogEditCompany company={company} />
            </Box>
        </Box>
    );
};

export default CompanyDetailsHeader;
