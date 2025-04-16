require('module-alias/register')
import { FindOptionsWhere, getMetadataArgsStorage, In, Like } from "typeorm";
import { Employee } from "@entities/Employee";
import { AppDataSource } from "@config/data-source";
import ResponseError from "@utils/ResponseError";
import { Location } from "@entities/shared/Location";
import { JobTitle } from "@entities/employee/JobTitle";
import { Subject } from "@entities/employee/Subject";
import { EmployeeContact } from "@entities/employee/EmployeeContact";
import { BaseContact } from "@/entities/shared/BaseContact";
import { RequestCreateEmployee, RequestUpdateEmployee, RequestUpdateEmployeeNotes, RequestUpdateEmployeeDistributors } from "../../../business-partners-common/src/types/employee";
import { QueryParams } from "../../../business-partners-common/src/types/common";
import { User } from "@/entities/User";
import { Distributor } from "@/entities/Distributor";

/*********************************************
 * CREATE
 *********************************************/

export const createEmployeeService = async (employeeData: RequestCreateEmployee): Promise<Employee> => {
    // Get the location ID from the employee data
    const locationId = employeeData.locationId;
    if (!locationId) {
        throw new ResponseError(400, "Location ID is required", "EMP_CREATE_400_NO_LOCATION", true);
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Repositories using queryRunner.manager
        const employeeRepository = queryRunner.manager.getRepository(Employee);
        const locationRepository = queryRunner.manager.getRepository(Location);
        const contactRepository = queryRunner.manager.getRepository(EmployeeContact);
        const jobTitleRepository = queryRunner.manager.getRepository(JobTitle);
        const subjectRepository = queryRunner.manager.getRepository(Subject);

        // Check if the location exists
        const location = await locationRepository.findOneBy({ id: locationId });
        if (!location) {
            throw new ResponseError(404, "Location not found", "EMP_CREATE_404_LOCATION_NOT_FOUND", true);
        }

        // Fetch JobTitles and Subjects
        const jobTitles = employeeData.jobTitleIds
            ? await jobTitleRepository.findBy({ id: In(employeeData.jobTitleIds) })
            : [];
        const subjects = employeeData.subjectIds
            ? await subjectRepository.findBy({ id: In(employeeData.subjectIds) })
            : [];

        // Validate JobTitles and Subjects
        if (employeeData.jobTitleIds && jobTitles.length !== employeeData.jobTitleIds.length) {
            throw new ResponseError(400, "Some Job Titles not found", "UNEXPECTED_ERROR", true);
        }
        if (employeeData.subjectIds && subjects.length !== employeeData.subjectIds.length) {
            throw new ResponseError(400, "Some Subjects not found", "UNEXPECTED_ERROR", true);
        }

        // Create and save the employee with JobTitles and Subjects
        const newEmployee = employeeRepository.create({ ...employeeData, location, jobTitles, subjects });
        const savedEmployee = await employeeRepository.save(newEmployee);

        // for (const [contactType, value] of Object.entries(employeeData.contact)) {
        //     const contact = contactRepository.create({
        //         type: contactType as BaseContact['type'],
        //         value: value,
        //         employee: savedEmployee
        //     });

        //     await contactRepository.save(contact);
        // }

        // Add contacts
        for (const [key, value] of Object.entries(employeeData.contact)) {
            const type = key as BaseContact['type']
            if (value && value !== "") {
                const contact = contactRepository.create({ type, value, employee: savedEmployee });
                await contactRepository.save(contact);

            }
        }

        // Commit the transaction after all operations
        await queryRunner.commitTransaction();

        return savedEmployee
        //return newEmployee;
    } catch (error) {
        // Rollback the transaction in case of an error
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        // Release the query runner which will close the connection
        await queryRunner.release();
    }
};

export const addUserInContactService = async (employeeId: number, userId: number): Promise<Employee> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const employeeRepository = queryRunner.manager.getRepository(Employee);
        const userRepository = queryRunner.manager.getRepository(User);

        const employee = await employeeRepository.findOne({
            where: { id: employeeId },
            relations: ['usersInContact']
        });
        if (!employee) {
            throw new Error('Employee not found');
        }

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        employee.usersInContact.push(user);
        await employeeRepository.save(employee);

        await queryRunner.commitTransaction();

        return employee;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}



/*********************************************
 * READ
 *********************************************/

interface EmployeeQueryParams {
    companyId: number;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const findEmployeesByCompanyService = async (
    {
        companyId,
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'lastName',
        sortOrder = 'ASC'
    }: EmployeeQueryParams): Promise<[Employee[], number]> => {

    const employeeColumns = getMetadataArgsStorage().filterColumns(Employee).map(column => column.propertyName);

    if (!employeeColumns.includes(sortBy)) {
        throw new ResponseError(400, "Invalid sort field", "INVALID_SORT_FIELD", true);
    }

    const locationRepository = AppDataSource.getRepository(Location);
    const employeeRepository = AppDataSource.getRepository(Employee);

    // Find all locations associated with the company
    const locations = await locationRepository.findBy({ company: { id: companyId } });

    // Extract location IDs for the where condition
    const locationIds = locations.map(location => location.id);

    // Adjusting the where condition to include locations
    let whereCondition: FindOptionsWhere<Employee> | FindOptionsWhere<Employee>[];
    if (search) {
        const searchTerms = search.split(' '); // Splitting the search term into individual words

        whereCondition = searchTerms.map(term => {
            // Creating a query condition for each term across multiple columns
            return [
                { location: { id: In(locationIds) }, firstName: Like(`%${term}%`) },
                { location: { id: In(locationIds) }, lastName: Like(`%${term}%`) },
                // ... you can add more fields if needed
            ];
        }).reduce((acc, curr) => acc.length ? [...acc, ...curr] : curr, []);

        if (searchTerms.length > 1) {
            // If there are multiple search terms, use a more complex condition to ensure all terms match
            whereCondition = {
                location: { id: In(locationIds) },
                firstName: Like(`%${searchTerms[0]}%`),
                lastName: Like(`%${searchTerms[1]}%`),
                // You can extend this to more fields if necessary
            };
        }
    } else {
        whereCondition = { location: { id: In(locationIds) } };
    }


    const [employees, total] = await employeeRepository.findAndCount({
        where: whereCondition,
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit,
        relations: ["location", "location.company"] // Update relations to include location and company
    });

    return [employees, total];
};

export const findEmployeesPaginatedService = async (
    {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'lastName', // Changed default sorting to 'lastName'
        sortOrder = 'ASC',
        isAdmin = false
    }: QueryParams & { isAdmin: boolean }): Promise<[Employee[], number]> => {

    const employeeRepository = AppDataSource.getRepository(Employee);

    const normalizedSearch = search.toLowerCase(); // for case-insensitive search
    const searchPattern = `%${normalizedSearch}%`; // for partial match

    // Base condition for search
    let whereCondition = [];

    function normalizePhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/\D/g, '');
    }

    if (search) {
        let searchConditions = [
            { firstName: Like(searchPattern) },
            { lastName: Like(searchPattern) },
            { title: Like(searchPattern) },
            { salutation: Like(searchPattern) },
            { subjects: { name: Like(searchPattern) } },
            { jobTitles: { name: Like(searchPattern) } },
            { contacts: { type: In(['mail', 'fax', 'phone', 'mobile']), value: Like(searchPattern) } }
        ];

        whereCondition = searchConditions.map(condition => {
            return isAdmin ? condition : { ...condition, active: true };
        });

        // Adding the phone number search only if needed
        if (normalizePhoneNumber(normalizedSearch).length !== 0) {
            const phoneCondition = {
                contacts: {
                    type: In(['fax', 'phone', 'mobile']),
                    normalizedValue: Like(`%${normalizePhoneNumber(normalizedSearch)}%`)
                },
                ...(isAdmin ? {} : { active: true })
            };
            whereCondition.push(phoneCondition);
        }
    } else if (!isAdmin) {
        whereCondition = [{ active: true }];
    }

    // Query to find employees with related tables
    const [employees, total] = await employeeRepository.findAndCount({
        where: whereCondition,
        relations: ['location', 'location.company', 'jobTitles', 'usersInContact', 'contacts', 'subjects', 'attachments', 'distributors'],
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [employees, total];
};

export const findEmployeesMeInContactPaginatedService = async (
    {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'lastName', // Changed default sorting to 'lastName'
        sortOrder = 'ASC',
        myId = null
    }: QueryParams & { myId: number }): Promise<[Employee[], number]> => {

    const employeeRepository = AppDataSource.getRepository(Employee);

    // Adjusted search conditions to match employee fields
    const whereCondition = { usersInContact: { id: myId }, active: true }

    // Query to find employees with related tables
    const [employees, total] = await employeeRepository.findAndCount({
        where: whereCondition,
        relations: ['location', 'location.company', 'jobTitles', 'usersInContact', 'contacts', 'subjects', 'attachments', 'distributors'],
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [employees, total];
};

export const getEmployeeService = async (employeeId: number): Promise<Employee | null> => {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
        where: { id: employeeId },
        relations: ['location', 'location.company', 'jobTitles', 'usersInContact', 'contacts', 'subjects', 'attachments', 'distributors'],
    });

    if (!employee) {
        return null;
    }

    return employee;
};

export const findInactiveEmployeesPaginatedService = async (
    {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
    }: Partial<QueryParams>): Promise<[Employee[], number]> => {

    const employeeRepository = AppDataSource.getRepository(Employee);

    const [employees, total] = await employeeRepository.findAndCount({
        where: { active: false },
        relations: ['location', 'location.company'],
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [employees, total];
};


/*********************************************
 * UPDATE
 *********************************************/

export const updateEmployeeService = async (employeeId: number, updateData: RequestUpdateEmployee & RequestUpdateEmployeeNotes & RequestUpdateEmployeeDistributors): Promise<Employee> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Repositories using queryRunner.manager
        const employeeRepository = queryRunner.manager.getRepository(Employee);
        //const locationRepository = queryRunner.manager.getRepository(Location);
        //const contactRepository = queryRunner.manager.getRepository(EmployeeContact);
        const jobTitleRepository = queryRunner.manager.getRepository(JobTitle);
        const subjectRepository = queryRunner.manager.getRepository(Subject);
        const userRepository = queryRunner.manager.getRepository(User);
        const distributorRepository = queryRunner.manager.getRepository(Distributor);

        // Check if the employee exists
        const employee = await employeeRepository.findOneBy({ id: employeeId });
        if (!employee) {
            throw new ResponseError(404, "Employee not found", "UNEXPECTED_ERROR", true);
        }

        // Update location if provided
        // if (updateData.locationId) {
        //     const location = await locationRepository.findOneBy({ id: updateData.locationId });
        //     if (!location) {
        //         throw new ResponseError(404, "Location not found", "UNEXPECTED_ERROR", true);
        //     }
        //     employee.location = location;
        // }

        // Update JobTitles and Subjects if provided
        if (updateData.jobTitleIds) {
            const jobTitles = await jobTitleRepository.findBy({ id: In(updateData.jobTitleIds) });
            if (jobTitles.length !== updateData.jobTitleIds.length) {
                throw new ResponseError(400, "Some Job Titles not found", "UNEXPECTED_ERROR", true);
            }
            employee.jobTitles = jobTitles;
        }

        if (updateData.subjectIds) {
            const subjects = await subjectRepository.findBy({ id: In(updateData.subjectIds) });
            if (subjects.length !== updateData.subjectIds.length) {
                throw new ResponseError(400, "Some Subjects not found", "UNEXPECTED_ERROR", true);
            }
            employee.subjects = subjects;
        }

        // if (updateData.usersInContactIds) {
        //     const usersInContact = await userRepository.findBy({ id: In(updateData.usersInContactIds) });
        //     if (usersInContact.length !== updateData.usersInContactIds.length) {
        //         throw new ResponseError(400, "Some users in contact not found", "UNEXPECTED_ERROR", true);
        //     }
        //     employee.usersInContact = usersInContact;
        // }

        if (updateData.distributorIds) {
            const distributor = await distributorRepository.findBy({ id: In(updateData.distributorIds) });
            if (distributor.length !== updateData.distributorIds.length) {
                throw new ResponseError(400, "Some distributors not found", "UNEXPECTED_ERROR", true);
            }
            employee.distributors = distributor;
        }

        // Update other fields
        employeeRepository.merge(employee, updateData);

        // Update contacts if provided
        // if (updateData.contact) {
        //     for (const [key, value] of Object.entries(updateData.contact)) {
        //         const type = key as BaseContact['type'];
        //         // Update or create new contact
        //         let contact = await contactRepository.findOneBy({ type: type, employee: employee });
        //         if (contact) {
        //             contact.value = value;
        //             await contactRepository.save(contact);
        //         } else {
        //             const newContact = contactRepository.create({ type, value, employee });
        //             await contactRepository.save(newContact);
        //         }
        //     }
        // }

        // Save the updated employee
        const updatedEmployee = await employeeRepository.save(employee);

        // Commit the transaction
        await queryRunner.commitTransaction();

        return updatedEmployee;
    } catch (error) {
        // Rollback the transaction in case of an error
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        // Release the query runner which will close the connection
        await queryRunner.release();
    }
};


/*********************************************
 * DELETE
 *********************************************/

export const removeUserFromContactService = async (employeeId: number, userId: number): Promise<Employee> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const employeeRepository = queryRunner.manager.getRepository(Employee);
        const userRepository = queryRunner.manager.getRepository(User);

        const employee = await employeeRepository.findOne({
            where: { id: employeeId },
            relations: ['usersInContact']
        });
        if (!employee) {
            throw new Error('Employee not found');
        }

        const userIndex = employee.usersInContact.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            throw new Error('User not found in employee contacts');
        }

        employee.usersInContact.splice(userIndex, 1);
        await employeeRepository.save(employee);

        await queryRunner.commitTransaction();

        return employee;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}
