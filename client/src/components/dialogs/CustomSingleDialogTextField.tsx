import { TextField, TextFieldProps } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface CustomSingleDialogTextFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
}

const CustomSingleDialogTextField = ({ name, label, control, placeholder, minRows, multiline, rows }: CustomSingleDialogTextFieldProps & TextFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={label ?? ''}
                    placeholder={placeholder ?? ''}
                    fullWidth
                    minRows={minRows}
                    multiline={multiline}
                    rows={rows}
                    type={'text'}
                    variant="outlined"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message && <FormattedMessage id={fieldState.error?.message} defaultMessage={fieldState.error?.message} />}
                />
            )}
        />
    );
};
export default CustomSingleDialogTextField