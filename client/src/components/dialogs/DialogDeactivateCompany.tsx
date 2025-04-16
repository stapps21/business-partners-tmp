import { Button, DialogContent } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import useDialogState from '../../hooks/useDialogState.ts';
import { Company } from '../../../../server/src/entities/Company.ts';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';


const DialogDeactivateCompany = ({ company }: { company: Company }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { mutate: handleUpdate } = useUpdateData<{ active: boolean }>(`/companies/${company.id}`, `company-${company.id}`);

    const onSubmit = () => {
        handleUpdate({ active: false }, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error updating company:', error),
        });
    };

    return (<>
        <Button variant="outlined" color='error' onClick={handleOpenDialog}>Delete company</Button>
        <CustomDialog variant="error" open={isDialogOpen} onClose={handleCloseDialog} title='Confirm Company Deletion' labelPositiveButton='I know what I am doing - delete' onConfirm={onSubmit}>
            <DialogContent>
                <p>This action will initiate the deletion process for the selected company. Please ensure that this company is no longer required by any users.</p>
                <p>Upon confirmation, an administrator will be notified to review the deletion request. The company will be deactivated and hidden from users, but still accessible to administrators, until the deletion is approved.</p>
                <p><em>Note: Deactivation means the company will not be visible to regular users, but remains accessible for administrative review.</em></p>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogDeactivateCompany;
