import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
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
import { useEffect, useState } from 'react';
import { useFetchSearchData } from '../../hooks/api/useFetchSearchData.ts';
import useDebounce from '../../hooks/useDebounce.ts';
import { FormattedMessage } from 'react-intl';
import { RequestCreateEmployee, requestCreateEmployeeSchema } from '../../../../business-partners-common/src/types/employee.ts'

export interface IJobTitle {
    id: number;
    name: string;
}

export interface ISubject {
    id: number;
    name: string;
}

interface UseFormProps {
    control: Control<RequestCreateEmployee>;
}

interface OtherDetailsProps {
    control: Control<RequestCreateEmployee>;
    jobTitles: IJobTitle[];
    subjects: ISubject[];
}

const salutationOptions = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Ms.', label: 'Ms.' },
    { value: 'Mrs.', label: 'Mrs.' },
    // Add more options as needed
];

interface LocationsRespose {
    companyName: string,
    locationName: string,
    locationId: number
}

const CompanyDetails = ({ control }: UseFormProps) => {
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const {
        data,
        isLoading,
        isRefetching,
        setSearchTerm,
    } = useFetchSearchData<LocationsRespose>(
        '/companies/locations',
        'locations',
        () => { setIsSearching(false) }
    );

    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(localSearchTerm, 250);
    const [selectedOption, setSelectedOption] = useState<LocationsRespose | null>(null);

    useEffect(() => {
        setSearchTerm(debouncedSearchTerm ?? '');
    }, [debouncedSearchTerm, setSearchTerm]);

    const options = () => {
        if (localSearchTerm.length === 0) {
            return []
        }
        return data ?? []
    }

    return (
        <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Company</Typography>
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <Controller
                        name="locationId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Autocomplete
                                {...field}
                                id="asynchronous-search"
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                filterOptions={(x) => x}
                                getOptionLabel={(option: LocationsRespose) => option.companyName}
                                options={options()}
                                loading={(isLoading || isRefetching || isSearching) && open}
                                value={selectedOption}
                                onChange={(_, option) => {
                                    setSelectedOption(option);
                                    setLocalSearchTerm('')
                                    field.onChange(option ? option.locationId : null);
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Company & Location"
                                        variant="outlined"
                                        onChange={(e) => { setLocalSearchTerm(e.target.value); setIsSearching(true) }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message && <FormattedMessage id={fieldState.error?.message} defaultMessage={fieldState.error?.message} />}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {(isLoading || isRefetching || isSearching) && open ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <ListItem
                                            alignItems="flex-start"
                                            style={{ padding: '4px 16px' }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="body2"
                                                        color="textPrimary"
                                                        noWrap
                                                    >
                                                        {option.companyName}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        noWrap
                                                    >
                                                        {option.locationName}
                                                    </Typography>
                                                }
                                                style={{ margin: 0 }}
                                            />
                                        </ListItem>
                                    </li>
                                )}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    )
};

const EmployeeDetails = ({ control }: UseFormProps) => (
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
const ContactDetails = ({ control }: UseFormProps) => (
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

const DialogCreateEmployee = () => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestCreateEmployee>({
        mode: "onBlur",
        resolver: yupResolver(requestCreateEmployeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            salutation: '',
            title: '',
            locationId: undefined,
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

    const { data: subjects } = useFetchData<ISubject[]>('/subjects', 'subjects')
    const { data: jobTitles } = useFetchData<IJobTitle[]>('/job-titles', 'jobTitles')
    const { handleSubmit: handleCreate } = useCreateData<RequestCreateEmployee>('/employees', 'employees');

    const onSubmit = (data: RequestCreateEmployee) => {
        handleCreate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error: Error) => console.error('Error creating company:', error),
        });
    };

    return (<>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Create employee
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title='Create employee' labelPositiveButton='Create employee' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CompanyDetails control={control} />
                    <EmployeeDetails control={control} />
                    <ContactDetails control={control} />
                    <OtherDetails control={control} subjects={subjects ?? []} jobTitles={jobTitles ?? []} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogCreateEmployee;
