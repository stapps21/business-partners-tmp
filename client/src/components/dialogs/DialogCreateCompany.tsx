import {
    Box,
    Button,
    Checkbox,
    Chip,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Typography
} from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import { useFetchData } from '../../hooks/api/useFetchData.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { useCreateData } from '../../hooks/api/useCreateData.ts';
import { Industry } from '../../../../server/src/entities/company/Industry.ts';


interface UseFormProps {
    control: Control<RequestCreateCompany>;
}

interface OtherDetailsProps extends UseFormProps {
    industries: Industry[];
}

// CompanyDetails component
const CompanyDetails = ({ control }: UseFormProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Company Details</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="name" label="Name" control={control} />
            </Grid>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="website" label="Website" control={control} />
            </Grid>
        </Grid>
    </Box>
);

// ContactDetails component
const ContactDetails = ({ control }: UseFormProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Contact Details</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.mail" label="Email" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.mobile" label="Mobile" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.phone" label="Phone" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.fax" label="Fax" control={control} />
            </Grid>
        </Grid>
    </Box>
);

// LocationDetails component
const LocationDetails = ({ control }: UseFormProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Location Details</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="location.name" label="Location Name" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="location.street" label="Street" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="location.houseNumber" label="House Number" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="location.postalCode" label="Postal Code" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="location.city" label="City" control={control} />
            </Grid>
        </Grid>
    </Box>
);

// OtherDetails component
const OtherDetails = ({ control, industries }: OtherDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Other Details</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Controller
                    name="industryIDs"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Industry</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Industry" />}
                                renderValue={(selected) => (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={industries.find((industry) => industry.id === value)?.name || ''}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            >
                                {industries.map((industry) => (
                                    <MenuItem key={industry.id} value={industry.id}>
                                        <Checkbox checked={field.value?.includes(industry.id)} />
                                        <ListItemText primary={industry.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="notes" label="Notes" control={control} />
            </Grid>
        </Grid>
    </Box>
);

import { RequestCreateCompany, requestCreateCompanySchema } from '../../../../business-partners-common/src/types/company.ts'

const DialogCreateCompany = () => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestCreateCompany>({
        mode: "onBlur",
        resolver: yupResolver(requestCreateCompanySchema),
        defaultValues: {
            name: '',
            website: '',
            contact: { mail: '', mobile: '', fax: '', phone: '' },
            notes: '',
            location: { name: null, street: '', houseNumber: '', postalCode: '', city: '' },
            industryIDs: []
        }
    });

    const { data: industries } = useFetchData<Industry[]>('/industries', 'industries')
    const { handleSubmit: handleCreate } = useCreateData<RequestCreateCompany>('/companies', 'companies');

    const onSubmit = (data: RequestCreateCompany) => {
        handleCreate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error: Error) => console.error('Error creating company:', error),
        });
    };

    return (<>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Create company
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Create company' labelPositiveButton='Create company' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CompanyDetails control={control} />
                    <ContactDetails control={control} />
                    <LocationDetails control={control} />
                    <OtherDetails control={control} industries={industries ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogCreateCompany;
