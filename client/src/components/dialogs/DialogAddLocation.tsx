import { Box, Button, DialogContent, Grid } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { useCreateData } from '../../hooks/api/useCreateData.ts';
import { Company } from '../../../../server/src/entities/Company.ts';
import { RequestAddLocation, requestAddLocationSchema } from '../../../../business-partners-common/src/types/location.ts'


interface LocationDetailsProps {
    control: Control<RequestAddLocation>;
}

// LocationDetails component
const LocationDetails = ({ control }: LocationDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="name" label="Location Name" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="street" label="Street" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="houseNumber" label="House Number" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="postalCode" label="Postal Code" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="city" label="City" control={control} />
            </Grid>
        </Grid>
    </Box>
);

const DialogAddLocation = ({ company }: { company: Company }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestAddLocation>({
        mode: "onBlur",
        resolver: yupResolver(requestAddLocationSchema),
        defaultValues: {
            companyId: company.id,
            name: null,
            street: '',
            houseNumber: '',
            postalCode: '',
            city: '',
        }
    });

    const { handleSubmit: handleCreate } = useCreateData<RequestAddLocation>('/locations', `company-${company.id}`);

    const onSubmit = (data: RequestAddLocation) => {
        handleCreate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error: Error) => console.error('Error creating location:', error),
        });
    };

    return (<>
        <Button size='small' variant="outlined" color="primary" onClick={handleOpenDialog}>
            Add Location
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title={`Add new location for ${company.name}`} labelPositiveButton='Add location' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <LocationDetails control={control} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogAddLocation;
