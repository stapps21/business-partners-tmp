import * as yup from 'yup';

///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestAddContactSchema = yup.object().shape({
    entityId: yup.number().required('Entity ID required'),
    contactType: yup.string().required('Contact type is required'),
    contactValue: yup.string().when('contactType', (contactType, schema) => {
        return contactType[0] === 'mail'
            ? schema.email('Please enter a valid email address').required('Value is required')
            : schema.required('Value is required');
    }),
});

export type RequestAddContact = yup.InferType<typeof requestAddContactSchema>



///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestUpdateContactSchema = yup.object().shape({
    contactType: yup.string().required('Contact type is required'),
    contactValue: yup.string().when('contactType', (contactType, schema) => {
        return contactType[0] === 'mail'
            ? schema.email('Please enter a valid email address').required('Value is required')
            : schema.required('Value is required');
    }),
});

export type RequestUpdateContact = yup.InferType<typeof requestUpdateContactSchema>
