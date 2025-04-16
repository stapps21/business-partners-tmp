import { Button, DialogContent } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import useDialogState from '../../hooks/useDialogState.ts';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { Employee } from '../../../../server/src/entities/Employee.ts';


const DialogDeactivateEmployee = ({ employee }: { employee: Employee }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { mutate: handleUpdate } = useUpdateData<{ active: boolean }>(`/employees/${employee.id}`, `employee-${employee.id}`);

    const onSubmit = () => {
        handleUpdate({ active: false }, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error deactivate employee:', error),
        });
    };

    return (<>
        <Button variant="outlined" color='error' onClick={handleOpenDialog}>Delete employee</Button>
        <CustomDialog variant="error" open={isDialogOpen} onClose={handleCloseDialog} title='Confirm Employee Deactivation' labelPositiveButton='I know what I am doing - deactivate' onConfirm={onSubmit}>
            <DialogContent>
                <p>This action will initiate the deletion process for the selected employee. Please ensure that this company is no longer required by any users.</p>
                <p>Upon confirmation, an administrator will be notified to review the deletion request. The company will be deactivated and hidden from users, but still accessible to administrators, until the deletion is approved.</p>
                <p><em>Note: Deactivation means the company will not be visible to regular users, but remains accessible for administrative review.</em></p>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogDeactivateEmployee;
