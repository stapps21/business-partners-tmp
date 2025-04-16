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
    Stack,
    Typography
} from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import { useFetchData } from '../../hooks/api/useFetchData.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { Subject } from '../../../../server/src/entities/employee/Subject.ts';
import { JobTitle } from '../../../../server/src/entities/employee/JobTitle.ts';
import { Employee } from '../../../../server/src/entities/Employee.ts';
import CustomSingleDialogSelectField from './CustomSingleDialogSelectField.tsx';
import { RequestUpdateEmployee, requestUpdateEmployeeSchema } from '../../../../business-partners-common/src/types/employee.ts'

interface OtherDetailsProps {
    control: Control<RequestUpdateEmployee>;
    subjects: Subject[];
    jobTitles: JobTitle[];
}

interface EmployeeDetailsProps {
    control: Control<RequestUpdateEmployee>;
}

const salutationOptions = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Ms.', label: 'Ms.' },
    { value: 'Mrs.', label: 'Mrs.' },
    // Add more options as needed
];

const EmployeeDetails = ({ control }: EmployeeDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Anrede</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogSelectField
                    name="salutation"
                    label="Salutation"
                    control={control}
                    options={salutationOptions}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="title" label="Title" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="firstName" label="First Name" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="lastName" label="Last Name" control={control} />
            </Grid>
        </Grid>
    </Box>
);

// OtherDetails component
const OtherDetails = ({ control, jobTitles, subjects }: OtherDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Other Details</Typography>
        <Grid container spacing={2}>

            {/* Job Titles */}
            <Grid item xs={12}>
                <Controller
                    name="jobTitleIds"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Job titles</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Job titles" />}
                                renderValue={(selected) => (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={jobTitles.find((jobTitle) => jobTitle.id === value)?.name || ''}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            >
                                {jobTitles.map((jobTitle) => (
                                    <MenuItem key={jobTitle.id} value={jobTitle.id}>
                                        <Checkbox checked={field.value?.includes(jobTitle.id)} />
                                        <ListItemText primary={jobTitle.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />
            </Grid>

            {/* Subjects */}
            <Grid item xs={12}>
                <Controller
                    name="subjectIds"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Subjects</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Subjects" />}
                                renderValue={(selected) => (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={subjects.find((subject) => subject.id === value)?.name || ''}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            >
                                {subjects.map((subject) => (
                                    <MenuItem key={subject.id} value={subject.id}>
                                        <Checkbox checked={field.value?.includes(subject.id)} />
                                        <ListItemText primary={subject.name} />
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

const DialogEditEmployee = ({ employee }: { employee: Employee }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateEmployee>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateEmployeeSchema),
        defaultValues: {
            salutation: employee.salutation,
            title: employee.title,
            firstName: employee.firstName,
            lastName: employee.lastName,
            subjectIds: employee.subjects.map(subject => subject.id),
            jobTitleIds: employee.jobTitles.map(jobTitle => jobTitle.id)
        }
    });

    const { data: jobTitles } = useFetchData<JobTitle[]>('/job-titles', 'jobTitles')
    const { data: subjects } = useFetchData<Subject[]>('/subjects', 'subjects')
    const { mutate: handleUpdate } = useUpdateData<RequestUpdateEmployee>(`/employees/${employee.id}`, `employee-${employee.id}`);

    const onSubmit = (data: RequestUpdateEmployee) => {
        handleUpdate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error updating employee:', error),
        });
    };

    return (<>
        <Button variant="outlined" color='primary' onClick={handleOpenDialog}>
            Edit employee
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Edit employee' labelPositiveButton='Update employee' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EmployeeDetails control={control} />
                    <OtherDetails control={control} subjects={subjects ?? []} jobTitles={jobTitles ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogEditEmployee;
