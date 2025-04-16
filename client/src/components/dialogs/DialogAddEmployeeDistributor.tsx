import { Box, Button, Checkbox, Chip, DialogContent, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { Employee } from '../../../../server/src/entities/Employee.ts';
import { RequestUpdateEmployeeDistributors, requestUpdateEmployeeDistributorsSchema } from '../../../../business-partners-common/src/types/employee.ts'
import { Distributor } from '../../../../server/src/entities/Distributor.ts';
import { useFetchPaginatedData } from '../../hooks/api/useFetchPaginatedData.ts';

interface EmployeeDetailsProps {
    control: Control<RequestUpdateEmployeeDistributors>;
    distributors: Distributor[]
}

const EmployeeDetails = ({ control, distributors }: EmployeeDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            {/* Subjects */}
            <Grid item xs={12}>
                <Controller
                    name="distributorIds"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Distributors</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Distributors" />}
                                renderValue={(selected) => (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {selected.map((value) => {
                                            const distributor = distributors.find((distributor) => distributor.id === value)
                                            return (<Chip key={value} label={distributor?.name} />)
                                        })}
                                    </Stack>
                                )}
                            >
                                {distributors.map((distributor) => (
                                    <MenuItem key={distributor.id} value={distributor.id}>
                                        <Checkbox checked={field.value?.includes(distributor.id)} />
                                        <ListItemText primary={distributor.name} />
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

const DialogAddEmployeeDistributor = ({ employee }: { employee: Employee }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateEmployeeDistributors>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateEmployeeDistributorsSchema),
        defaultValues: {
            distributorIds: employee.distributors.map(user => user.id),
        }
    });
    const { data: distributors } = useFetchPaginatedData<Distributor>('/distributors', 'distributors')
    const { mutate: handleUpdate } = useUpdateData<RequestUpdateEmployeeDistributors>(`/employees/${employee.id}`, `employee-${employee.id}`);

    const onSubmit = (data: RequestUpdateEmployeeDistributors) => {
        handleUpdate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error updating employee:', error),
        });
    };

    return (<>
        <Button variant="outlined" color='primary' size='small' onClick={handleOpenDialog}>
            Add Distributor
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Add Distributor' labelPositiveButton='Add Distributor' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EmployeeDetails control={control} distributors={distributors?.data ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};

export default DialogAddEmployeeDistributor;
