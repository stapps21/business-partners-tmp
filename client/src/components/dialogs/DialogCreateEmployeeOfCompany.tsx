import {
    Box,
    Button,
    Checkbox,
    Chip,
    DialogContent,
    FormControl,
    FormHelperText,
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
import { useCreateData } from '../../hooks/api/useCreateData.ts';
import CustomSingleDialogSelectField from './CustomSingleDialogSelectField.tsx';
import { Location } from '../../../../server/src/entities/shared/Location.ts';
import { Company } from '../../../../server/src/entities/Company.ts';
import { FormattedMessage } from 'react-intl';
import { RequestCreateEmployee, requestCreateEmployeeSchema } from '../../../../business-partners-common/src/types/employee.ts'
import { JobTitle } from '../../../../server/src/entities/employee/JobTitle.ts';
import { Subject } from '../../../../server/src/entities/employee/Subject.ts';

interface CompanyDetailsProps {
    control: Control<RequestCreateEmployee>;
    locations: Location[];
}

interface EmployeeDetailsProps {
    control: Control<RequestCreateEmployee>;
}

interface ContactDetailsProps {
    control: Control<RequestCreateEmployee>;
}

interface OtherDetailsProps {
    control: Control<RequestCreateEmployee>;
    jobTitles: JobTitle[];
    subjects: Subject[];
}

const salutationOptions = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Ms.', label: 'Ms.' },
    { value: 'Mrs.', label: 'Mrs.' },
    // Add more options as needed
];

const CompanyDetails = ({ control, locations }: CompanyDetailsProps) => {
    const defaultLocationId = locations.length > 0 ? locations[0].id : undefined;

    return (
        <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Location</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="locationId"
                        control={control}
                        defaultValue={defaultLocationId}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={!!fieldState.error} variant="outlined">
                                <Select {...field} readOnly={locations.length === 1}>
                                    {locations.map((location) => (
                                        <MenuItem key={location.id} value={location.id}>
                                            {location.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error?.message && (
                                    <FormHelperText>
                                        <FormattedMessage id={fieldState.error?.message} defaultMessage={fieldState.error?.message} />
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    )
};


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


// ContactDetails component
const ContactDetails = ({ control }: ContactDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Contact Details</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.mail" label="Email" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.mobile" label="Mobile" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.phone" label="Phone" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="contact.fax" label="Fax" control={control} />
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

            {/* Notes */}
            <Grid item xs={12}>
                <CustomSingleDialogTextField minRows={3} multiline name="notes" label="Notes" control={control} />
            </Grid>
        </Grid>
    </Box>
);

const DialogCreateEmployeeOfCompany = ({ company }: { company: Company }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestCreateEmployee>({
        mode: "onBlur",
        resolver: yupResolver(requestCreateEmployeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            salutation: '',
            title: '',
            locationId: company.locations.length === 1 ? company.locations[0].id : undefined,
            active: true,
            DSGVOConsent: false,
            notes: '',
            contact: {
                mail: '',
                phone: '',
                mobile: '',
                fax: '',
            },
            jobTitleIds: [],
            subjectIds: []
        }
    });

    const { data: subjects } = useFetchData<Subject[]>('/subjects', 'subjects')
    const { data: jobTitles } = useFetchData<JobTitle[]>('/job-titles', 'jobTitles')
    const { handleSubmit: handleCreate } = useCreateData<RequestCreateEmployee>('/employees', `company-${company.id}`);

    const onSubmit = (data: RequestCreateEmployee) => {
        handleCreate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error: Error) => console.error('Error creating company:', error),
        });
    };

    return (<>
        <Button size='small' variant="outlined" color="primary" onClick={handleOpenDialog}>
            Add Employee
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Create employee' labelPositiveButton='Create employee' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CompanyDetails control={control} locations={company.locations} />
                    <EmployeeDetails control={control} />
                    <ContactDetails control={control} />
                    <OtherDetails control={control} subjects={subjects ?? []} jobTitles={jobTitles ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogCreateEmployeeOfCompany;
