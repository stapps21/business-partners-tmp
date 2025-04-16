import { Box, Button, DialogContent, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import { Control, Controller, UseFormWatch, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../../hooks/useDialogState.ts';
import CustomSingleDialogTextField from './CustomSingleDialogTextField.tsx';
import { useCreateData } from '../../hooks/api/useCreateData.ts';
import { Fax, Mail, Phone, Smartphone } from '@mui/icons-material';
import { RequestAddContact, requestAddContactSchema } from '../../../../business-partners-common/src/types/contact.ts'
import { ContactType } from '../../utils/companyUtils.tsx';


interface ContactDetailsProps {
    control: Control<RequestAddContact>;
    watch: UseFormWatch<RequestAddContact>
}

const ContactDetails = ({ control, watch }: ContactDetailsProps) => {
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
                        placeholder={placeholders[selectedContactMethod as ContactType]}
                        control={control}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};


const DialogAddContact = ({ entityType, id }: { entityType: string, id: number }) => {
    const { isDialogOpen, handleCloseDialog, handleOpenDialog } = useDialogState()
    const { control, watch, handleSubmit, formState: { isSubmitting } } = useForm<RequestAddContact>({
        mode: "onBlur",
        resolver: yupResolver(requestAddContactSchema),
        defaultValues: {
            entityId: id,
            contactType: 'mail',
            contactValue: ''
        }
    });

    const { handleSubmit: handleCreate } = useCreateData<RequestAddContact>(`/contacts/${entityType}`, `${entityType}-${id}`);

    const onSubmit = (data: RequestAddContact) => {
        handleCreate(data, {
            onSuccess: () => handleCloseDialog(),
            onError: (error: Error) => console.error('Error creating contact:', error),
        });
    };

    return (<>
        <Button size='small' variant="outlined" color="primary" onClick={handleOpenDialog}>
            Add Contact
        </Button>
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title={`Add contact`} labelPositiveButton='Add contact' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ContactDetails control={control} watch={watch} />
                </form>
            </DialogContent>
        </CustomDialog>
    </>
    );
};


export default DialogAddContact;
