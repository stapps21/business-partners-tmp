import { useParams } from "react-router-dom";
import {
    Box,
    Chip,
    CircularProgress,
    Grid,
    Tooltip,
    Typography
} from "@mui/material";
import { useFetchData } from '../hooks/api/useFetchData.ts';
import { CompanyAttachment } from '../../../server/src/entities/company/CompanyAttachment.ts';
import CompanyLocations from '../components/CompanyLocations.tsx';
import DialogDeactivateCompany from '../components/dialogs/DialogDeactivateCompany.tsx';
import { Company } from "../../../server/src/entities/Company.ts";
import { Location } from "../../../server/src/entities/shared/Location.ts";
import { CompanyContact } from "../../../server/src/entities/company/CompanyContact.ts";
import AttachmentsCard from "../components/cards/companies/AttachmentsCard.tsx";
import CompanyDetailsHeader from "../components/cards/companies/CompanyDetailsHeader.tsx";
import CompanyWebsiteCard from "../components/cards/companies/CompanyWebsiteCard.tsx";
import ContactsCard from "../components/cards/companies/ContactsCard.tsx";

interface GetCompanyResponse extends Company {
    locations: Location[],
    attachments: CompanyAttachment[],
    contacts: CompanyContact[]
}

const CompanyDetailsPage = () => {
    const { companyId } = useParams();
    const { data: company, isLoading } = useFetchData<GetCompanyResponse>(`/companies/${companyId}`, `company-${companyId}`)

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
    }

    if (!company) {
        return <Typography variant="h6" align="center">No company found</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={2}>

                {/* Top Header */}
                <Grid item xs={12}>
                    {!company.active &&
                        <Tooltip title="This company is currently deactivated. It is not visible to regular users but remains accessible for administrative purposes.">
                            <Chip size='small' sx={{ mb: 2 }} label="Deactivated" color="error" />
                        </Tooltip>
                    }
                    <CompanyDetailsHeader company={company} />
                </Grid>

                {/* Main (Location & Employees) */}
                <Grid item xs={12} lg={8}>
                    <CompanyLocations company={company} />
                </Grid>

                {/* Right Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ContactsCard entityType="company" id={company.id} contacts={company.contacts} />
                        </Grid>
                        <Grid item xs={12}>
                            <CompanyWebsiteCard company={company} />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Attachments */}
                <Grid item xs={12} sx={{ pb: 4 }}>
                    <AttachmentsCard attachments={company.attachments} folder="company" id={company.id} />
                </Grid>
            </Grid>

            {/* Footer */}
            <Grid item xs={12} sx={{ pb: 4 }} display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="secondary" fontSize={14}>Created at: {new Date(company.createdAt).toLocaleDateString()}</Typography>
                <DialogDeactivateCompany company={company} />
            </Grid>
        </Box>
    );
};

export default CompanyDetailsPage;
