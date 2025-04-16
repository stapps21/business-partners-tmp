import * as yup from 'yup';

///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestAddLocationSchema = yup.object().shape({
    companyId: yup.number().required('Company required'),
    name: yup.string().nullable(),
    street: yup.string().required('Street is required'),
    houseNumber: yup.string().required('House number is required'),
    postalCode: yup.string().required('Postal code is required'),
    city: yup.string().required('City is required'),
});

export type RequestAddLocation = yup.InferType<typeof requestAddLocationSchema>


///////////////////////////////////////
// UPDATE REQUEST
///////////////////////////////////////

export const requestUpdateLocationSchema = yup.object().shape({
    name: yup.string().nullable(),
    street: yup.string().required('Street is required'),
    houseNumber: yup.string().required('House number is required'),
    postalCode: yup.string().required('Postal code is required'),
    city: yup.string().required('City is required'),
});

export type RequestUpdateLocation = yup.InferType<typeof requestUpdateLocationSchema>
