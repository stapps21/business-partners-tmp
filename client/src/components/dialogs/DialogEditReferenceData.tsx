import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { DialogContent, IconButton, Tooltip } from '@mui/material';
import CustomDialog from '../CustomDialog';
import CustomSingleDialogTextField from './CustomSingleDialogTextField';
import { useUpdateData } from '../../hooks/api/useUpdateData';
import { Edit } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';

const ReferenceDataSchema = Yup.object().shape({
    name: Yup.string().required('field.required'),
});

interface DialogEditProps {
    route: string,
    queryKey: string,
    type: 'industry' | 'subject' | 'jobtitle'
    initialData: {
        name: string
    }
}

const DialogEditReferenceData = ({ type, queryKey, route, initialData }: DialogEditProps) => {
    const intl = useIntl();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(ReferenceDataSchema),
        defaultValues: initialData
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const { mutate: handleUpdate, isLoading } = useUpdateData<{ name: string }>(route, queryKey);

    const onSubmit = (data) => {
        handleUpdate(data, {
            onSuccess: () => setIsDialogOpen(false),
            onError: (error) => console.error('Error updating reference data:', error),
        });
    };

    return (
        <>
            <Tooltip title={<FormattedMessage id="edit" defaultMessage="Edit" />}>
                <IconButton size='small' onClick={() => setIsDialogOpen(true)}>
                    <Edit fontSize='small' />
                </IconButton>
            </Tooltip>
            {
                isDialogOpen &&
                <CustomDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={intl.formatMessage({ id: `referencedata.update.${type}`, defaultMessage: 'Update reference data' })} labelPositiveButton='Edit' disabled={isSubmitting || isLoading} onConfirm={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogContent>
                                <CustomSingleDialogTextField name="name" label={intl.formatMessage({ id: `referencedata.${type}.label`, defaultMessage: 'Reference Data' })} control={control} error={errors.name ? intl.formatMessage({ id: errors.name.message }) : undefined} />
                            </DialogContent>
                        </form>
                    </DialogContent>
                </CustomDialog>
            }
        </>
    );
};

export default DialogEditReferenceData;
