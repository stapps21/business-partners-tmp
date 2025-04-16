import * as yup from 'yup';

///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestCreateDistributorSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string().nullable(),
});

export type RequestCreateDistributor = yup.InferType<typeof requestCreateDistributorSchema>

