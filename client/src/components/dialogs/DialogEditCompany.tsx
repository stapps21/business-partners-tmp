import {
    Box,
    Button,
    Checkbox,
    Chip,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack
} from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import { useFetchData } from '../../hooks/api/useFetchData.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { Company } from '../../../../server/src/entities/Company.ts';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { Industry } from '../../../../server/src/entities/company/Industry.ts';
import { RequestUpdateCompany, requestUpdateCompanySchema } from '../../../../business-partners-common/src/types/company.ts'

interface OtherDetailsProps {
    control: Control<RequestUpdateCompany>;
    industries: Industry[];
}

// OtherDetails component
const OtherDetails = ({ control, industries }: OtherDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="name" label="Name" control={control} />
            </Grid>

            <Grid item xs={12}>
                <CustomSingleDialogTextField name="notes" label="Notes" control={control} />
            </Grid>


            <Grid item xs={12}>
                <Controller
                    name="industryIDs"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Industry</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Industry" />}
                                renderValue={(selected) => (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={industries.find((industry) => industry.id === value)?.name || ''}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            >
                                {industries.map((industry) => (
                                    <MenuItem key={industry.id} value={industry.id}>
                                        <Checkbox checked={field.value?.includes(industry.id)} />
                                        <ListItemText primary={industry.name} />
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

const DialogEditCompany = ({ company }: { company: Company }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateCompany>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateCompanySchema),
        defaultValues: {
            name: company.name,
            notes: company.notes,
            industryIDs: company.industries.map(industry => industry.id)
        }
    });

    const { data: industries } = useFetchData<Industry[]>('/industries', 'industries')
    const { mutate: handleUpdate } = useUpdateData<RequestUpdateCompany>(`/companies/${company.id}`, `company-${company.id}`);

    const onSubmit = (data: RequestUpdateCompany) => {
        handleUpdate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error updating company:', error),
        });
    };

    return (<>
        <Button variant="outlined" color='primary' onClick={handleOpenDialog}>
            Edit company
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Edit company' labelPositiveButton='Update company' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <OtherDetails control={control} industries={industries ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogEditCompany;
