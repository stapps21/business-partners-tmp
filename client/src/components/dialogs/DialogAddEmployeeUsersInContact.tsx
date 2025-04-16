import { Box, Button, DialogContent, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import { Employee } from '../../../../server/src/entities/Employee.ts';
import { RequestAddEmployeeUsersInContact, requestAddEmployeeUsersInContactSchema } from '../../../../business-partners-common/src/types/employee.ts'
import { User } from '../../../../server/src/entities/User.ts';
import { useFetchData } from '../../hooks/api/useFetchData.ts';
import { useCreateData } from '../../hooks/api/useCreateData.ts';

interface EmployeeDetailsProps {
    control: Control<RequestAddEmployeeUsersInContact>;
    selectableUsers: User[]
}

const EmployeeDetails = ({ control, selectableUsers }: EmployeeDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Controller
                    name="userInContactId"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Users in contact</InputLabel>
                            <Select
                                {...field}
                                input={<OutlinedInput label="Users in contact" />}
                            >
                                {selectableUsers.map((selectableUser) => (
                                    <MenuItem key={selectableUser.id} value={selectableUser.id}>
                                        <ListItemText primary={selectableUser.firstName + ' ' + selectableUser.lastName} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />
            </Grid>
        </Grid>
    </Box>
);

const DialogAddEmployeeUsersInContact = ({ employee }: { employee: Employee }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting }, reset } = useForm<RequestAddEmployeeUsersInContact>({
        mode: "onBlur",
        resolver: yupResolver(requestAddEmployeeUsersInContactSchema),
        defaultValues: {
            userInContactId: undefined,
        }
    });
    const { data: users } = useFetchData<User[]>('/users', 'users')
    const { handleSubmit: handleCreate } = useCreateData<RequestAddEmployeeUsersInContact>(`/employees/${employee.id}/user-in-contact`, `employee-${employee.id}`);

    const onSubmit = (data: RequestAddEmployeeUsersInContact) => {
        handleCreate(data, {
            onSuccess: () => {
                reset()
                handleCloseDialog()
            },
            onError: (error: Error) => console.error('Error adding user in contact:', error),
        });
    };

    const selectableUsers = users?.filter(obj => !new Set(employee.usersInContact.map(item => item.id)).has(obj.id));

    return (<>
        <Button variant="outlined" color='primary' size='small' onClick={handleOpenDialog}>
            Add user
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Add user in contact' labelPositiveButton='Add user' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EmployeeDetails control={control} selectableUsers={selectableUsers ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};

export default DialogAddEmployeeUsersInContact;
