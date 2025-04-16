import * as yup from 'yup';

///////////////////////////////////////
// POST REQUEST
///////////////////////////////////////

export const requestCreateEmployeeSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    salutation: yup.string(),
    title: yup.string().nullable(),
    locationId: yup.number().required('Location ID is required'),
    active: yup.boolean(),
    DSGVOConsent: yup.boolean(),
    notes: yup.string(),
    contact: yup.object().shape({
        mail: yup.string(),
        phone: yup.string(),
        mobile: yup.string(),
        fax: yup.string()
    }).nullable(),
    jobTitleIds: yup.array().of(yup.number()),
    subjectIds: yup.array().of(yup.number())
});

export type RequestCreateEmployee = yup.InferType<typeof requestCreateEmployeeSchema>

///////////////////////////////////////
// UPDATE REQUEST
///////////////////////////////////////

export const requestUpdateEmployeeSchema = yup.object().shape({
    salutation: yup.string(),
    title: yup.string().nullable(),
    firstName: yup.string().required('firstName is required'),
    lastName: yup.string().required('lastName is required'),
    subjectIds: yup.array().of(yup.number()),
    jobTitleIds: yup.array().of(yup.number())
});

export type RequestUpdateEmployee = yup.InferType<typeof requestUpdateEmployeeSchema>

//
export const requestUpdateEmployeeNotesSchema = yup.object().shape({
    notes: yup.string(),
});

export type RequestUpdateEmployeeNotes = yup.InferType<typeof requestUpdateEmployeeNotesSchema>

//
export const requestAddEmployeeUsersInContactSchema = yup.object().shape({
    userInContactId: yup.number()
});

export type RequestAddEmployeeUsersInContact = yup.InferType<typeof requestAddEmployeeUsersInContactSchema>

//
export const requestUpdateEmployeeDistributorsSchema = yup.object().shape({
    distributorIds: yup.array().of(yup.number())
});

export type RequestUpdateEmployeeDistributors = yup.InferType<typeof requestUpdateEmployeeDistributorsSchema>