import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CustomDialog from '../CustomDialog';
import { Delete } from '@mui/icons-material';
import { useDeleteData } from '../../hooks/api/useDeleteData';

interface DialogDeleteReferenceDataProps {
    route: string,
    queryKey: string,
    initialData: {
        id: number,
        name: string
    }
}

const DialogDeleteReferenceData = ({ queryKey, route, initialData }: DialogDeleteReferenceDataProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { mutate: handleDelete, isLoading } = useDeleteData(route, queryKey);

    const onDelete = () => {
        handleDelete(initialData.id, {
            onSuccess: () => setIsDialogOpen(false),
            onError: (error) => console.error('Error deleting reference data:', error),
        });
    };

    return (
        <>
            <Tooltip title="Delete">
                <IconButton size='small' onClick={() => setIsDialogOpen(true)}>
                    <Delete fontSize='small' />
                </IconButton>
            </Tooltip>
            {isDialogOpen && (
                <CustomDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title='Confirm Delete'
                    labelPositiveButton='Delete'
                    disabled={isLoading}
                    onConfirm={onDelete}
                >
                    Are you sure you want to delete '<strong>{initialData.name}</strong>'?
                </CustomDialog>
            )}
        </>
    );
};

export default DialogDeleteReferenceData;
