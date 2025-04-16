import { Box, Button, DialogContent, Grid } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { useCreateData } from '../../hooks/api/useCreateData.ts';
import { RequestCreateDistributor, requestCreateDistributorSchema } from '../../../../business-partners-common/src/types/distributor.ts'

interface CompanyDetailsProps {
    control: Control<RequestCreateDistributor>;
}

// CompanyDetails component
const CompanyDetails = ({ control }: CompanyDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="name" label="Name" control={control} />
            </Grid>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="description" label="Description" control={control} />
            </Grid>
        </Grid>
    </Box>
);

const DialogCreateDistributor = () => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestCreateDistributor>({
        mode: "onBlur",
        resolver: yupResolver(requestCreateDistributorSchema),
        defaultValues: {
            name: '',
            description: null
        }
    });

    const { handleSubmit: handleCreate } = useCreateData<RequestCreateDistributor>('/distributors', 'distributors');

    const onSubmit = (data: RequestCreateDistributor) => {
        handleCreate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error: Error) => console.error('Error creating distributor:', error),
        });
    };

    return (<>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Create distributor
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Create distributor' labelPositiveButton='Create distributor' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CompanyDetails control={control} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogCreateDistributor;
