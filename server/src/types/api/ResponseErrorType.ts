export type MessageCodeType = (
    // Company
    "AUTH_WRONG_UOP" |
    "AUTH_TOO_MANY_TRIES" |
    // Company
    "COMP_CREATE_500" |
    "COMP_CREATE_400_DUPLICATE" |
    "COMP_SOMETHING" |
    "INVALID_COMPANY_ID" |
    // Employee
    "EMP_CREATE_400_NO_LOCATION" |
    "EMP_CREATE_404_LOCATION_NOT_FOUND" |
    // Industry
    "IND_404_NOT_FOUND" |
    // JobTitle
    "JOBTIT_CREATE_400_DUPLICATE" |
    // Subjects
    "SUBJ_CREATE_400_DUPLICATE" |
    // Auth
    "AUTH_400_INVALID_USER_ROLE" |
    "AUTH_401_INVALID_TOKEN" |
    "AUTH_403_NO_TOKEN" |
    "COOKIE_401_NO_REFRESH_TOKEN" |
    // OTHER
    "INTERNAL_SERVER_ERROR" |
    "UNEXPECTED_ERROR" |
    "INVALID_SORT_FIELD"
);

export interface ResponseErrorType {
    status: number,
    error: string,
    messageCode: MessageCodeType
    details?: Object,
    timestamp: string,
    notifyUser: boolean
}