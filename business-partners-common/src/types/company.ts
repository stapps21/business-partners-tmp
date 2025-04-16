import * as yup from 'yup';

///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestCreateCompanySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    website: yup.string().url('Enter a valid URL'),
    contact: yup.object().shape({
        mail: yup.string().email('Enter a valid email'),
        mobile: yup.string(),
        phone: yup.string(),
        fax: yup.string(),
    }),
    location: yup.object().shape({
        name: yup.string().nullable(),
        street: yup.string().required('Street is required'),
        houseNumber: yup.string().required('House number is required'),
        postalCode: yup.string().required('Postal code is required'),
        city: yup.string().required('City is required'),
    }),
    industryIDs: yup.array().of(yup.number()),
    notes: yup.string().nullable(),
});

export type RequestCreateCompany = yup.InferType<typeof requestCreateCompanySchema>


///////////////////////////////////////
// UPDATE REQUEST
///////////////////////////////////////

export const requestUpdateCompanySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    industryIDs: yup.array().of(yup.number()),
    notes: yup.string().nullable(),
});

export type RequestUpdateCompany = yup.InferType<typeof requestUpdateCompanySchema>

export const requestUpdateCompanyWebsiteSchema = yup.object().shape({
    website: yup.string().url(),
});

export type RequestUpdateCompanyWebsite = yup.InferType<typeof requestUpdateCompanyWebsiteSchema>