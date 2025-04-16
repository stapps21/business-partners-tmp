require('module-alias/register')
import { Company } from '@entities/Company';
import { AppDataSource } from "@config/data-source";
import ResponseError from "@utils/ResponseError";
import { Location } from "@entities/shared/Location";


/*********************************************
 * CREATE
 *********************************************/
export interface IRequestCreateLocation {
    companyId: number;
    name: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
}

export const createLocationService = async (data: IRequestCreateLocation): Promise<Location> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const companyRepository = queryRunner.manager.getRepository(Company);
        const locationRepository = queryRunner.manager.getRepository(Location);

        // Find the company by ID
        const company = await companyRepository.findOneBy({ id: data.companyId });
        if (!company) {
            throw new ResponseError(404, "Company not found", "UNEXPECTED_ERROR", true);
        }

        // Create and save the location
        const location = locationRepository.create({
            ...data,
            company: company // Link the location to the found company
        });
        const savedLocation = await locationRepository.save(location);

        // Optionally, you might want to update the company's locations array
        // This depends on how you handle relations in your ORM
        // company.locations.push(savedLocation);
        // await companyRepository.save(company);

        await queryRunner.commitTransaction();
        return savedLocation;

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

export const findLocationById = async (id: number): Promise<Location | undefined> => {
    const industryRepository = AppDataSource.getRepository(Location);
    return await industryRepository.findOne({ where: { id } });
};

/*********************************************
 * UPDATE
 *********************************************/

export const updateLocationService = async (id: number, locationData: Partial<Location>): Promise<Location> => {
    const industryRepository = AppDataSource.getRepository(Location);
    await industryRepository.update(id, locationData);
    return findLocationById(id);
};

/*********************************************
 * DELETE
 *********************************************/

export const deleteLocationService = async (id: number): Promise<void> => {
    // TODO: Delete also emplyoees
    // Only bee able to deactivate locations
    const locationRepository = AppDataSource.getRepository(Location);
    await locationRepository.delete(id);
};
