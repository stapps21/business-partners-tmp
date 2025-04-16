import { memo, useCallback } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Box, DialogContent, Grid, Switch, TextField, Typography } from '@mui/material';
import { createUserService } from "../../services/userService";
import { USER_ROLES } from "../../../../server/src/enum/UserRoles";
import usePrivateApi from "../../hooks/usePrivateApi";
import { useMutation, useQueryClient } from "react-query";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomDialog from '../CustomDialog';
import { useTheme } from '@emotion/react';
import { MailOutline } from '@mui/icons-material';

interface CustomTextFieldProps {
    name: string | any;
    label: string;
    control: Control<any>;
}

const CustomTextField = memo(({ name, label, control }: CustomTextFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={label}
                    fullWidth
                    type={name === 'password' ? 'password' : 'text'}
                    variant="outlined"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
});

const UserCreationDialog = ({ open, handleClose }) => {
    const theme = useTheme();
    const privateApi = usePrivateApi();
    const queryClient = useQueryClient();

    // Yup validation schema
    const UserSchema = Yup.object().shape({
        mail: Yup.string().email('Invalid email').required('Email is required'),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        isAdmin: Yup.boolean()
    });

    // React Hook Form setup
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(UserSchema),
        defaultValues: {
            isAdmin: false,
            mail: '',
            firstName: '',
            lastName: '',
        }
    });

    const createMutation = useMutation(createUserService, {
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries('users');
        },
    });

    const handleCreate = useCallback(async (data) => {
        const roles = data.isAdmin ? [USER_ROLES.USER, USER_ROLES.ADMIN] : [USER_ROLES.USER];
        await createMutation.mutate({ privateApi, newUser: { ...data, roles } });
    }, [createMutation, privateApi]);


    return (
        <CustomDialog open={open} onClose={handleClose} title='Create user' disabled={isSubmitting} labelPositiveButton='Send registration mail' onConfirm={handleSubmit(handleCreate)}>
            <DialogContent>
                <form onSubmit={handleSubmit(handleCreate)}>
                    <DialogContent>
                        {/* Informational Section */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 2,
                            backgroundColor: theme.palette.background.default,
                            padding: 2,
                        }}>
                            <MailOutline sx={{ marginRight: 1 }} />
                            <Typography variant="body1" gutterBottom>
                                New users will receive an email with a registration link valid for 24 hours. They can set their password and log in using their email.
                            </Typography>
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField name="firstName" label="First name" control={control} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField name="lastName" label="Last name" control={control} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomTextField name="mail" label="EMail" control={control} />
                                </Grid>
                            </Grid>
                        </Box>

                        <FormControlLabel
                            control={
                                <Controller
                                    name="isAdmin"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={field.value}
                                            color="primary"
                                        />
                                    )}
                                />
                            }
                            label="Admin"
                        />
                    </DialogContent>
                </form>
            </DialogContent>
        </CustomDialog>
    );
};

export default UserCreationDialog;
