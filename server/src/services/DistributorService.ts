require('module-alias/register')
import { AppDataSource } from "@/config/data-source";
import { Distributor } from "@/entities/Distributor";
import { Employee } from "@/entities/Employee";
import ResponseError from "@/utils/ResponseError";
import { QueryParams } from "../../../business-partners-common/src/types/common";
import { Like } from "typeorm";


/*********************************************
 * CREATE
 *********************************************/

export const createDistributorService = async (distributorData: Partial<Distributor>): Promise<Distributor> => {
    try {
        const distributorRepository = AppDataSource.getRepository(Distributor);
        const distributor = distributorRepository.create(distributorData);
        return await distributorRepository.save(distributor);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ResponseError(400, "Operation failed - Distributor already exists", "COMP_CREATE_400_DUPLICATE", true);
        }
        throw error;
    }
};


/*********************************************
 * READ
 *********************************************/

export const findDistributorsPaginatedService = async (
    {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'name',
        sortOrder = 'ASC'
    }: QueryParams): Promise<[Distributor[], number]> => {

    const distributorRepository = AppDataSource.getRepository(Distributor);

    const normalizedSearch = search.toLowerCase(); // for case-insensitive search
    const searchPattern = `%${normalizedSearch}%`; // for partial match

    const whereCondition = search ? { name: Like(searchPattern), description: Like(searchPattern) } : {};

    const [distributors, total] = await distributorRepository.findAndCount({
        where: whereCondition,
        //relations: ['employees'],
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [distributors, total];
};

export const findDistributorEmployeesPaginatedService = async (
    distributorId: number,
    {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'name',
        sortOrder = 'ASC'
    }: QueryParams): Promise<[Employee[], number]> => {

    const employeeRepository = AppDataSource.getRepository(Employee);

    const normalizedSearch = search.toLowerCase(); // for case-insensitive search
    const searchPattern = `%${normalizedSearch}%`; // for partial match

    // Define where condition to include distributor ID and optional search
    const whereCondition: any = {
        distributors: { id: distributorId } // Assumes a relation 'distributor' in Employee entity
    };

    // Add search conditions if search term is provided
    if (search) {
        whereCondition.firstName = Like(searchPattern);
        // You can add more fields to search within, if necessary
    }

    const [employees, total] = await employeeRepository.findAndCount({
        where: whereCondition,
        relations: ['distributors'], // Include this if you want to fetch distributor details with employees
        order: {
            [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return [employees, total];
};

export const findDistributorEmployeesService = async (distributorId: number): Promise<Employee[]> => {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employees = await employeeRepository.find({
        where: { distributors: { id: distributorId } },
        relations: ['distributors', 'location', 'location.company', 'contacts'],
    });

    return employees;
};


export const getDistributorByIdService = async (id: number): Promise<Distributor | undefined> => {
    const distributorRepository = AppDataSource.getRepository(Distributor);
    return await distributorRepository.findOne({ where: { id } });
};




/*********************************************
 * UPDATE
 *********************************************/


/*********************************************
 * DELETE
 *********************************************/
