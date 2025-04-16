import { Box, Button, DialogContent, Grid } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { Employee } from '../../../../server/src/entities/Employee.ts';
import { RequestUpdateEmployeeNotes, requestUpdateEmployeeNotesSchema } from '../../../../business-partners-common/src/types/employee.ts'

interface EmployeeDetailsProps {
    control: Control<RequestUpdateEmployeeNotes>;
}

const EmployeeDetails = ({ control }: EmployeeDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField minRows={3} multiline name="notes" label="Notes" control={control} />
            </Grid>
        </Grid>
    </Box>
);

const DialogEditEmployeeNotes = ({ employee }: { employee: Employee }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateEmployeeNotes>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateEmployeeNotesSchema),
        defaultValues: {
            notes: employee.notes,
        }
    });
    const { mutate: handleUpdate } = useUpdateData<RequestUpdateEmployeeNotes>(`/employees/${employee.id}`, `employee-${employee.id}`);

    const onSubmit = (data: RequestUpdateEmployeeNotes) => {
        handleUpdate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error updating employee:', error),
        });
    };

    return (<>
        <Button variant="outlined" color='primary' size='small' onClick={handleOpenDialog}>
            Edit
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Edit employee' labelPositiveButton='Update employee' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EmployeeDetails control={control} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};

export default DialogEditEmployeeNotes;
