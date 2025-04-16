import * as yup from 'yup';

///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestCreateReferenceDataSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});

export type RequestReferenceData = yup.InferType<typeof requestCreateReferenceDataSchema>
