import { requestCreateCompanySchema, requestUpdateCompanyWebsiteSchema, requestUpdateCompanySchema } from "./types/company";
import { requestCreateEmployeeSchema, requestUpdateEmployeeSchema, requestUpdateEmployeeDistributorsSchema, requestUpdateEmployeeNotesSchema, requestAddEmployeeUsersInContactSchema } from "./types/employee";
import { requestCreateDistributorSchema } from "./types/distributor";
import { requestAddLocationSchema, requestUpdateLocationSchema } from "./types/location";
import { requestAddContactSchema, requestUpdateContactSchema } from "./types/contact";
import { requestCreateReferenceDataSchema } from "./types/referenceData";
import type { RequestCreateCompany, RequestUpdateCompanyWebsite, RequestUpdateCompany } from "./types/company";
import type { RequestCreateEmployee, RequestUpdateEmployee, RequestAddEmployeeUsersInContact, RequestUpdateEmployeeDistributors, RequestUpdateEmployeeNotes } from "./types/employee";
import type { RequestCreateDistributor } from "./types/distributor";
import type { RequestAddContact, RequestUpdateContact } from "./types/contact";
import type { RequestAddLocation, RequestUpdateLocation } from "./types/location";
import type { RequestReferenceData } from "./types/referenceData";
import type { QueryParams } from "./types/common";

export {
    requestCreateCompanySchema,
    requestUpdateCompanyWebsiteSchema,
    requestCreateEmployeeSchema,
    requestUpdateEmployeeSchema,
    requestCreateDistributorSchema,
    requestAddLocationSchema,
    requestUpdateLocationSchema,
    requestAddContactSchema,
    requestUpdateContactSchema,
    requestCreateReferenceDataSchema,

    requestUpdateEmployeeDistributorsSchema,
    requestUpdateEmployeeNotesSchema,
    requestAddEmployeeUsersInContactSchema,
    requestUpdateCompanySchema,


    RequestCreateCompany,
    RequestUpdateCompanyWebsite,
    RequestCreateEmployee,
    RequestUpdateEmployee,
    RequestUpdateContact,
    RequestCreateDistributor,
    RequestAddLocation,
    RequestUpdateLocation,
    RequestAddContact,
    RequestReferenceData,
    QueryParams,

    RequestAddEmployeeUsersInContact,
    RequestUpdateEmployeeDistributors,
    RequestUpdateEmployeeNotes,
    RequestUpdateCompany
}