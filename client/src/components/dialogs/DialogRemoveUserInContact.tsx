import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CustomDialog from '../CustomDialog';
import { PersonRemove } from '@mui/icons-material';
import { useDeleteData } from '../../hooks/api/useDeleteData';
import { Employee } from '../../../../server/src/entities/Employee';
import { User } from '../../../../server/src/entities/User';

interface DialogRemoveReferenceDataProps {
    employee: Employee,
    userInContact: User
}

const DialogRemoveUserInContact = ({ employee, userInContact }: DialogRemoveReferenceDataProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { mutate: handleDelete, isLoading } = useDeleteData(`/employees/${employee.id}/user-in-contact`, `employee-${employee.id}`);

    const onDelete = () => {
        handleDelete(userInContact.id, {
            onSuccess: () => setIsDialogOpen(false),
            onError: (error) => console.error('Error remove user in contact:', error),
        });
    };

    return (
        <>
            <Tooltip title="Remove user">
                <IconButton size='small' onClick={() => setIsDialogOpen(true)}>
                    <PersonRemove fontSize='small' />
                </IconButton>
            </Tooltip>
            {isDialogOpen && (
                <CustomDialog
                    variant='error'
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title='Remove user in contact'
                    labelPositiveButton='Remove user'
                    disabled={isLoading}
                    onConfirm={onDelete}
                >
                    Are you sure you want to remove '<strong>{userInContact.firstName} {userInContact.lastName}</strong>'?
                </CustomDialog>
            )}
        </>
    );
};

export default DialogRemoveUserInContact;
