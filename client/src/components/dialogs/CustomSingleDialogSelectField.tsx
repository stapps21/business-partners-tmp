import { Control, Controller } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface CustomSelectDialogProps {
    name: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>; // Replace 'any' with your form data type for more specific typing
    options: Array<{
        value: string | number; // Adjust the type based on your value types
        label: string;
    }>;
}

const CustomSingleDialogSelectField = ({ name, label, control, options }: CustomSelectDialogProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error} variant="outlined">
                    <InputLabel>{label}</InputLabel>
                    <Select
                        {...field}
                        label={label}
                    >
                        {options.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                                {option.label}
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
    );
};

export default CustomSingleDialogSelectField;
