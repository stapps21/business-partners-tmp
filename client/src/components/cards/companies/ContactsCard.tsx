import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import DialogAddContact from '../../dialogs/DialogAddContact';
import ContactList from '../../ContactList';
import { BaseContact } from '../../../../../server/src/entities/shared/BaseContact';

type ContactsCardProps = {
    entityType: string,
    id: number;
    contacts: BaseContact[]
};

const ContactsCard: React.FC<ContactsCardProps> = ({ entityType, id, contacts }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                    <Typography variant="h5">Contacts</Typography>
                    <DialogAddContact entityType={entityType} id={id} />
                </Box>
                {contacts && contacts.length > 0 ? (
                    <ContactList entityType={entityType} id={id} contacts={contacts} />
                ) : (
                    <Typography variant="body1" style={{ textAlign: 'center' }}>
                        No contacts available. Click 'Add Contact' to create a new contact.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default ContactsCard;
