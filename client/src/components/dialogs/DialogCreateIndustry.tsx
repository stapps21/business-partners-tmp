import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogContent } from '@mui/material';
import CustomDialog from '../CustomDialog';
import { useCreateData } from '../../hooks/api/useCreateData';
import CustomSingleDialogTextField from './CustomSingleDialogTextField';
import { RequestReferenceData, requestCreateReferenceDataSchema } from '../../../../business-partners-common/src/types/referenceData.ts'

const DialogCreateIndustry = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestReferenceData>({
        mode: "onBlur",
        resolver: yupResolver(requestCreateReferenceDataSchema),
        defaultValues: {
            name: '',
        }
    });

    const { handleSubmit: handleCreate } = useCreateData<RequestReferenceData>('/industries', 'industries');

    const onSubmit = (data: RequestReferenceData) => {
        handleCreate(data, {
            onSuccess: () => setIsDialogOpen(false),
            onError: (error: Error) => console.error('Error creating industry:', error),
        });
    };

    return (
        <>
            <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={() => setIsDialogOpen(true)}>
                Add industry
            </Button>
            {
                isDialogOpen &&
                <CustomDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title='Add new industry' labelPositiveButton='Add industry' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogContent>
                                <CustomSingleDialogTextField name="name" label="Industry" control={control} />
                            </DialogContent>
                        </form>
                    </DialogContent>
                </CustomDialog>
            }
        </>
    );
};

export default DialogCreateIndustry;
