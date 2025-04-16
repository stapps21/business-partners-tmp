import { DialogContent, IconButton, Tooltip } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import useDialogState from '../../hooks/useDialogState.ts';
import { useDeleteData } from '../../hooks/api/useDeleteData.ts';
import { Delete } from '@mui/icons-material';
import { BaseContact } from '../../../../server/src/entities/shared/BaseContact.ts';

const DialogRemoveContact = ({ link, queryKey, contact }: { link: string, queryKey: string, contact: BaseContact }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { mutate: handleCreate } = useDeleteData<any>(link, queryKey);

    const onSubmit = () => {
        handleCreate(contact.id, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error deleting contact:', error),
        });
    };

    return (<>
        <Tooltip title="Remove" onClick={handleOpenDialog}>
            <IconButton size="small">
                <Delete />
            </IconButton>
        </Tooltip>
        <CustomDialog variant='error' open={isDialogOpen} onClose={handleCloseDialog} title={`Delete contact`} labelPositiveButton='Delete contact' onConfirm={onSubmit}>
            <DialogContent>
                Delete the contact
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogRemoveContact;
