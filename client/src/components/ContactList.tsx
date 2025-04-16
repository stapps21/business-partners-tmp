import React from 'react';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import FaxIcon from '@mui/icons-material/Print';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogRemoveContact from './dialogs/DialogRemoveContact';
import DialogEditContact from './dialogs/DialogEditContact';
import { BaseContact } from '../../../server/src/entities/shared/BaseContact';

interface Props {
    id: number,
    contacts: BaseContact[];
    entityType: string;
}

const ContactListItem = styled(ListItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '& .contact-actions, & .contact-icon': {
        display: 'none',
    },
    '&:hover .contact-actions, &:hover .contact-icon': {
        display: 'flex',
    },
    '.mail-link': {
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

const ContactList: React.FC<Props> = ({ id, entityType, contacts }) => {
    const groupedContacts = contacts.reduce((acc, contact) => {
        (acc[contact.type] = acc[contact.type] || []).push(contact);
        return acc;
    }, {} as Record<BaseContact['type'], BaseContact[]>);

    const getIcon = (type: BaseContact['type']) => {
        switch (type) {
            case 'mail':
                return <EmailIcon />;
            case 'phone':
                return <PhoneIcon />;
            case 'mobile':
                return <SmartphoneIcon />;
            case 'fax':
                return <FaxIcon />;
            default:
                return null;
        }
    };

    const renderContactValue = (contact: BaseContact) => {
        if (contact.type === 'mail') {
            return (
                <a href={`mailto:${contact.value}`} className="mail-link">
                    <Typography variant="body2">{contact.value}</Typography>
                </a>
            );
        } else {
            return <Typography variant="body2">{contact.value}</Typography>;
        }
    };

    const contactTypes: BaseContact['type'][] = ['mail', 'phone', 'mobile', 'fax'];

    return (
        <List sx={{ pt: 0 }}>
            {contactTypes.map(type => (
                <React.Fragment key={type}>
                    {groupedContacts[type]?.map((contact) => (
                        <ContactListItem key={contact.id} >
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    {getIcon(contact.type)}
                                </Grid>
                                <Grid item xs>
                                    <Typography fontSize={12} color="secondary">{contact.type}</Typography>
                                    {renderContactValue(contact)}
                                </Grid>
                                <Grid item className="contact-actions">
                                    <DialogEditContact link={`/contacts/${entityType}/${contact.id}`} queryKey={`${entityType}-${id}`} contact={contact} />
                                    <DialogRemoveContact link={`/contacts/${entityType}`} queryKey={`${entityType}-${id}`} contact={contact} />
                                </Grid>
                            </Grid>
                        </ContactListItem>
                    ))}
                </React.Fragment>
            ))}
        </List>
    );
};

export default ContactList;
