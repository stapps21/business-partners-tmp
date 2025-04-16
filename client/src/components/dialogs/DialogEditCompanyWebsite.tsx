import { Box, Button, DialogContent, Grid } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { Company } from '../../../../server/src/entities/Company.ts';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { RequestUpdateCompanyWebsite, requestUpdateCompanyWebsiteSchema } from '../../../../business-partners-common/src/types/company.ts'


interface OtherDetailsProps {
    control: Control<RequestUpdateCompanyWebsite>;
}

// OtherDetails component
const OtherDetails = ({ control }: OtherDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="website" label="Website" control={control} />
            </Grid>
        </Grid>
    </Box>
);

const DialogEditCompanyWebsite = ({ company }: { company: Company }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateCompanyWebsite>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateCompanyWebsiteSchema),
        defaultValues: {
            website: company.website,
        }
    });

    const { mutate: handleUpdate } = useUpdateData<RequestUpdateCompanyWebsite>(`/companies/${company.id}`, `company-${company.id}`);

    const onSubmit = (data: RequestUpdateCompanyWebsite) => {
        handleUpdate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error updating company:', error),
        });
    };

    return (<>
        <Button size='small' variant="outlined" color="primary" onClick={handleOpenDialog}>
            Edit
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Edit website' labelPositiveButton='Update website' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <OtherDetails control={control} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogEditCompanyWebsite;
