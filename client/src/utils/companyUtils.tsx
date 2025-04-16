import { Box, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

export type ContactType = 'mail' | 'phone' | 'mobile' | 'fax'
type Contact = {
    type: ContactType,
    value: string
}

export const getFirstContactOfType = (contacts: Contact[], type: ContactType) => {
    const filteredContacts = contacts.filter(contact => contact.type === type);

    if (filteredContacts.length > 0) {
        return (
            filteredContacts.length > 1
                ? (
                    <Box display="flex" flexDirection="column">
                        <Box><Typography lineHeight={.9}>{filteredContacts[0].value}</Typography></Box>
                        <Box>
                            <Tooltip title={filteredContacts.slice(1).map((contact, index) => (
                                <Typography fontSize={14} key={index} color="inherit">
                                    {contact.value}
                                </Typography>
                            ))}>
                                <Typography fontStyle="italic" fontSize={14} color={grey[400]}>+ {filteredContacts.length - 1} weitere</Typography>
                            </Tooltip>
                        </Box>
                    </Box>
                )
                : filteredContacts[0].value
        );
    }

    return '';
};
