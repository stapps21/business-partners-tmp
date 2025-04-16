import { Box, DialogContent, FormControl, Grid, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, UseFormWatch, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { Edit, Fax, Mail, Phone, Smartphone } from '@mui/icons-material';
import { useUpdateData } from '../../hooks/api/useUpdateData.ts';
import { BaseContact } from '../../../../server/src/entities/shared/BaseContact.ts';
import { RequestUpdateContact, requestUpdateContactSchema } from '../../../../business-partners-common/src/types/contact.ts'


interface LocationDetailsProps {
    control: Control<RequestUpdateContact>;
    watch: UseFormWatch<RequestUpdateContact>
}

const ContactDetails = ({ control, watch }: LocationDetailsProps) => {
    const selectedContactMethod = watch("contactType");

    // Define placeholders based on the selected contact method
    const placeholders: { mail: string, phone: string, mobile: string, fax: string } = {
        mail: "Enter email address",
        phone: "Enter phone number",
        mobile: "Enter mobile number",
        fax: "Enter fax number"
    };

    return (
        <Box sx={{ marginBottom: 2 }}>
            <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="contactType"
                        control={control}
                        defaultValue="mail"
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <Select
                                    style={{ maxHeight: 60 }}
                                    {...field}
                                    id="contact-method-select"
                                >
                                    <MenuItem value="mail">
                                        <Box display="flex" alignItems="center">
                                            <Mail /> <Typography sx={{ ml: 1 }}>Mail</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="phone">
                                        <Box display="flex" alignItems="center">
                                            <Phone /> <Typography sx={{ ml: 1 }}>Phone</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="mobile">
                                        <Box display="flex" alignItems="center">
                                            <Smartphone /> <Typography sx={{ ml: 1 }}>Mobile</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="fax">
                                        <Box display="flex" alignItems="center">
                                            <Fax /> <Typography sx={{ ml: 1 }}>Fax</Typography>
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <CustomSingleDialogTextField
                        name="contactValue"
                        placeholder={placeholders[selectedContactMethod as BaseContact['type']]}
                        control={control}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};


const DialogEditContact = ({ link, queryKey, contact }: { link: string, queryKey: string, contact: BaseContact }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()

    const defaultValues = {
        contactType: contact.type,
        contactValue: contact.value
    }

    const { control, watch, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateContact>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateContactSchema),
        defaultValues
    });

    const { mutate: handleUpdate } = useUpdateData<RequestUpdateContact>(link, queryKey);

    const onSubmit = (data: RequestUpdateContact) => {
        handleUpdate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error) => console.error('Error creating contact:', error),
        });
    };

    return (<>
        <Tooltip title="Edit" onClick={handleOpenDialog}>
            <IconButton size="small">
                <Edit />
            </IconButton>
        </Tooltip>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title={`Edit contact`} labelPositiveButton='Update contact' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ContactDetails control={control} watch={watch} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogEditContact;
