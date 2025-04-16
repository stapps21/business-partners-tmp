require('module-alias/register')
import { Company } from '@entities/Company';
import { AppDataSource } from "@config/data-source";
import { In, Like, Repository } from "typeorm";
import ResponseError from "@utils/ResponseError";
import { Location } from "@entities/shared/Location";
import { Industry } from "@entities/company/Industry";
import { CompanyContact } from '@/entities/company/CompanyContact';
import { BaseContact } from '@/entities/shared/BaseContact';
import { RequestCreateCompany } from '../../../business-partners-common/src/types/company'
import { QueryParams } from '../../../business-partners-common/src/types/common'
import { Log } from '@/entities/Log';
import { User } from '@/entities/User';


/*********************************************
 * CREATE
 *********************************************/

export const createCompanyService = async (userId: number, data: RequestCreateCompany): Promise<Company> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const companyRepository = queryRunner.manager.getRepository(Company);
        const locationRepository = queryRunner.manager.getRepository(Location);
        const industryRepository = queryRunner.manager.getRepository(Industry);
        const contactRepository = queryRunner.manager.getRepository(CompanyContact);

        // Retrieve and validate industries
        const industries = await industryRepository.find({
            where: { id: In(data.industryIDs) }
        });
        if (industries.length !== data.industryIDs.length) {
            throw new ResponseError(400, "Invalid industry ID(s) provided", "UNEXPECTED_ERROR", true);
        }

        // Create and save the company
        const company = companyRepository.create({ ...data, industries });
        const savedCompany = await companyRepository.save(company);

        // Create and save the location
        const location = locationRepository.create({ ...data.location, company: savedCompany });
        await locationRepository.save(location);

        // Handle company contacts
        for (const [contactType, value] of Object.entries(data.contact)) {
            const contact = contactRepository.create({
                type: contactType as BaseContact['type'],
                value: value,
                company: savedCompany
            });

            await contactRepository.save(contact);
        }

        // Create a log entry
        const userRepository = queryRunner.manager.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new ResponseError(404, "User not found", "UNEXPECTED_ERROR", true);
        }

        const afterState = await getCompanyForLog(savedCompany.id, companyRepository)
        const logRepository = queryRunner.manager.getRepository(Log);
        const logEntry = logRepository.create({
            entityName: 'Company',
            name: savedCompany.name,
            entityId: savedCompany.id,
            action: 'CREATE',
            previousState: null,
            afterState: JSON.stringify(afterState),
            user: user
        });
        await logRepository.save(logEntry);

        await queryRunner.commitTransaction();
        return savedCompany;

    } catch (error) {
        await queryRunner.rollbackTransaction();

        if (error.code === 'ER_DUP_ENTRY') {
            throw new ResponseError(400, "Operation failed - Company or Location already exists", "COMP_CREATE_400_DUPLICATE", true);
        }
        throw error;

    } finally {
        await queryRunner.release();
    }
}



/*********************************************
 * READ
 *********************************************/

export const getCompanyForLog = async (companyId: number, companyRepository: Repository<Company>): Promise<Company | null> => {
    const company = await companyRepository.findOne({
        where: { id: companyId },
        relations: ['locations', 'contacts', 'industries', 'attachments', 'locations.employees', 'locations.employees.contacts'],
    });

    if (!company) {
        return null;
    }

    return company;
};

export const getCompanyService = async (companyId: number, isAdmin: boolean): Promise<Company> => {
    const companyRepository = AppDataSource.getRepository(Company);

    const where = !isAdmin ? {
        id: companyId, active: true
    } : {
        id: companyId
    }

    return companyRepository.findOne({
        where,
        relations: ['locations', 'contacts', 'industries', 'attachments', 'locations.employees', 'locations.employees.contacts'],
    });
};

export const findAllCompaniesService = async (isAdmin: boolean): Promise<Company[]> => {
    const where = !isAdmin ? { active: true } : {}
    const companyRepository = AppDataSource.getRepository(Company);
    return companyRepository.find({ where });
}

export const findCompaniesPaginatedService = async (
    {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'name',
        sortOrder = 'ASC',
        isAdmin = false
    }: QueryParams & { isAdmin: boolean }): Promise<[Company[], number]> => {

    const companyRepository = AppDataSource.getRepository(Company);

    const normalizedSearch = search.toLowerCase(); // for case-insensitive search
    const searchPattern = `%${normalizedSearch}%`; // for partial match

    // Base condition for search
    let whereCondition = [];

    function normalizePhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/\D/g, '');
    }

    if (search) {
        let searchConditions = [
            { name: Like(searchPattern) },
            { industries: { name: Like(searchPattern) } },
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

    const [companies, total] = await companyRepository.findAndCount({
        where: whereCondition,
        relations: ['locations', 'contacts', 'industries', 'attachments', 'locations.employees'],
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [companies, total];
};

export const findCompaniesWithLocationsService = async (
    {
        search,
        limit = 25,
        isAdmin = false
    }: {
        search: string,
        limit?: number,
        isAdmin: boolean
    }): Promise<[{
        companyName: string,
        locationName: string,
        locationId: number
    }[], number]> => {

    const companyRepository = AppDataSource.getRepository(Company);

    const normalizedSearch = search.toLowerCase();
    const searchPattern = `%${normalizedSearch}%`;

    // Define search options
    const options = {
        relations: ['locations'],
        where: [
            { name: Like(searchPattern), active: true },
            { locations: { name: Like(searchPattern) } }
        ],
        take: limit
    };

    const alsoHideFromAdmin = true
    if (!isAdmin || alsoHideFromAdmin) {
        options.where.forEach(condition => {
            if (typeof condition === 'object') {
                condition.active = true; // Enforce 'active' condition
            }
        });
    }

    // Get results
    const [companies, total] = await companyRepository.findAndCount(options);

    // Transform results to desired format
    const formattedResults = companies.map(company => company.locations.map(location => ({
        companyName: company.name,
        locationName: location.name,
        locationId: location.id
    }))).flat();

    return [formattedResults, total];
};

export const findInactiveCompaniesPaginatedService = async (
    {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
    }: Partial<QueryParams>): Promise<[Company[], number]> => {

    const companyRepository = AppDataSource.getRepository(Company);

    const [companies, total] = await companyRepository.findAndCount({
        where: { active: false },
        relations: ['locations'],
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [companies, total];
};


/*********************************************
 * UPDATE
 *********************************************/
interface OptionalStuff {
    industryIDs?: number[],
    //contact: any
    //location?: number,
}
export const updateCompanyService = async (userId: number, companyId: number, data: Partial<Company> & OptionalStuff): Promise<Company> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const companyRepository = queryRunner.manager.getRepository(Company);
        const industryRepository = queryRunner.manager.getRepository(Industry);

        // Find the existing company
        const beforeUpdateCompany = await getCompanyForLog(companyId, companyRepository)
        if (!beforeUpdateCompany) {
            throw new ResponseError(404, "Company not found", "UNEXPECTED_ERROR", true);
        }

        const updatedCompany = { ...beforeUpdateCompany }

        // Update industries if provided
        if (data.industryIDs) {
            const industries = await industryRepository.find({
                where: { id: In(data.industryIDs) }
            });
            if (industries.length !== data.industryIDs.length) {
                throw new ResponseError(400, "Invalid industry ID(s) provided", "UNEXPECTED_ERROR", true);
            }
            updatedCompany.industries = industries;
        }

        // Update company details
        companyRepository.merge(updatedCompany, data);
        await companyRepository.save(updatedCompany);

        // Capture the after state
        //const afterState = await companyRepository.findOne({ where: { id: companyId } });
        const afterState = await getCompanyForLog(companyId, companyRepository)

        // Create a log entry
        const userRepository = queryRunner.manager.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new ResponseError(404, "User not found", "UNEXPECTED_ERROR", true);
        }

        const logRepository = queryRunner.manager.getRepository(Log);
        const logEntry = logRepository.create({
            entityName: 'Company',
            name: beforeUpdateCompany.name,
            entityId: companyId,
            action: 'UPDATE',
            previousState: JSON.stringify(beforeUpdateCompany),
            afterState: JSON.stringify(afterState),
            user: user
        });
        await logRepository.save(logEntry);

        await queryRunner.commitTransaction();
        return updatedCompany;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;

    } finally {
        await queryRunner.release();
    }
}

/*********************************************
 * DELETE
 *********************************************/

export const deleteCompanyService = async (companyId: number): Promise<boolean> => {
    const companyRepository = AppDataSource.getRepository(Company);

    const company = await companyRepository.findOne({ where: { id: companyId } });

    if (!company) {
        return false;
    }

    await companyRepository.remove(company);
    return true;
};