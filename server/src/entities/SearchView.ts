import { ViewColumn, ViewEntity } from "typeorm";

function createUnionSelect(
    type: string,
    idColumn: string,
    tableName: string,
    columnNames: string[],
    joinClause = '',
    nameJoinInfo?: { nameTable: string, nameColumn: string, joinOn: string }
) {
    const nameSelectPart = nameJoinInfo
        ? `, ${nameJoinInfo.nameTable}.${nameJoinInfo.nameColumn} AS name`
        : ', NULL AS name'; // Default to NULL if no name info is provided

    return columnNames.map(columnName => {
        const isFunction = columnName.includes('(') && columnName.includes(')');
        const columnExpr = isFunction ? columnName : `${tableName}.${columnName}`;

        return `SELECT '${type}' AS type, ${idColumn} AS id, ${columnExpr} AS text${nameSelectPart} FROM ${tableName} ${joinClause} ${nameJoinInfo ? `LEFT JOIN ${nameJoinInfo.nameTable} ON ${nameJoinInfo.joinOn}` : ''
            } WHERE ${columnExpr} IS NOT NULL AND TRIM(${columnExpr}) <> ''`;
    }).join(' UNION ALL ');
}

@ViewEntity({
    expression: `
        ${createUnionSelect('company', 'id', 'company', ['name', 'website', 'notes'])}
        UNION ALL
        ${createUnionSelect('company', 'companyId', 'company_contact', ['value', 'normalizedValue'], '', { nameTable: 'company', nameColumn: 'name', joinOn: 'company.id = company_contact.companyId' })}
        UNION ALL
        ${createUnionSelect('company', 'companyId', 'company_attachment', ['originalFilename'], '', { nameTable: 'company', nameColumn: 'name', joinOn: 'company.id = company_attachment.companyId' })}
        UNION ALL
        ${createUnionSelect('company', 'ci.companyId', 'industry', ['name'], 'INNER JOIN company_industries_industry ci ON ci.industryId = industry.id', { nameTable: 'company', nameColumn: 'name', joinOn: 'company.id = ci.companyId' })}
        UNION ALL
        ${createUnionSelect('company', 'companyId', 'location', ['name', "CONCAT(street, ' ', houseNumber)", "CONCAT(postalCode, ' ', city)"], '', { nameTable: 'company', nameColumn: 'name', joinOn: 'company.id = location.companyId' })}
        UNION ALL
        ${createUnionSelect('employee', 'id', 'employee', ["CONCAT(firstName, ' ', lastName)", 'notes'])}
        UNION ALL
        ${createUnionSelect('employee', 'employeeId', 'employee_contact', ['value', 'normalizedValue'], '', { nameTable: 'employee', nameColumn: "firstName", joinOn: 'employee.id = employee_contact.employeeId' })}
        UNION ALL
        ${createUnionSelect('employee', 'employeeId', 'employee_attachment', ['originalFilename'], '', { nameTable: 'employee', nameColumn: 'firstName', joinOn: 'employee.id = employee_attachment.employeeId' })}
        UNION ALL
        ${createUnionSelect('employee', 'ci.employeeId', 'subject', ['name'], 'INNER JOIN employee_subjects_subject ci ON ci.subjectId = subject.id', { nameTable: 'employee', nameColumn: "firstName", joinOn: 'employee.id = ci.employeeId' })}
        UNION ALL
        ${createUnionSelect('employee', 'ci.employeeId', 'job_title', ['name'], 'INNER JOIN employee_job_titles_job_title ci ON ci.jobTitleId = job_title.id', { nameTable: 'employee', nameColumn: "firstName", joinOn: 'employee.id = ci.employeeId' })}
        UNION ALL
        ${createUnionSelect('employee', 'ci.employeeId', 'distributor', ['name', 'description'], 'INNER JOIN employee_distributors_distributor ci ON ci.distributorId = distributor.id', { nameTable: 'employee', nameColumn: "firstName", joinOn: 'employee.id = ci.employeeId' })}
        UNION ALL
        ${createUnionSelect('employee', 'uic.employeeId', 'user', ["CONCAT(user.firstName, ' ', user.lastName)"], 'INNER JOIN employee_users_in_contact_user uic ON uic.userId = user.id', { nameTable: 'employee', nameColumn: "firstName", joinOn: 'employee.id = uic.employeeId' })}
        UNION ALL
        ${createUnionSelect('user', 'id', 'user', ["CONCAT(firstName, ' ', lastName)"])}
    `
})
export class SearchView {
    @ViewColumn()
    type: string;

    @ViewColumn()
    id: number;

    @ViewColumn()
    text: string;

    @ViewColumn()
    name: string;
}
