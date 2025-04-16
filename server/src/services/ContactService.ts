require('module-alias/register')
import { Company } from '@entities/Company';
import { AppDataSource } from "@config/data-source";
import ResponseError from "@utils/ResponseError";
import { CompanyContact } from '@/entities/company/CompanyContact';
import { Employee } from '@/entities/Employee';
import { EmployeeContact } from '@/entities/employee/EmployeeContact';
import { BaseContact } from '@/entities/shared/BaseContact';


/*********************************************
 * CREATE
 *********************************************/

export const createContactService = async (entityType: string, data: any): Promise<BaseContact> => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        let entityRepository;
        let contactRepository;
        let entity;

        switch (entityType) {
            case 'company':
                entityRepository = queryRunner.manager.getRepository(Company);
                contactRepository = queryRunner.manager.getRepository(CompanyContact);
                break;
            case 'employee':
                entityRepository = queryRunner.manager.getRepository(Employee);
                contactRepository = queryRunner.manager.getRepository(EmployeeContact);
                break;
            default:
                throw new ResponseError(400, "Invalid entity type", "UNEXPECTED_ERROR", true);
        }

        // Find the entity by ID
        entity = await entityRepository.findOneBy({ id: data.entityId });
        if (!entity) {
            throw new ResponseError(404, `${entityType} not found`, "UNEXPECTED_ERROR", true);
        }

        // Create and save the contact
        const contact = contactRepository.create({
            type: data.contactType,
            value: data.contactValue,
            [entityType.toLowerCase()]: entity // Link the contact to the found entity
        });
        const savedContact = await contactRepository.save(contact);

        await queryRunner.commitTransaction();
        return savedContact;

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

export const findContactById = async (id: number, contactType: string): Promise<BaseContact | undefined> => {
    const contactRepository = getContactRepository(contactType);
    return await contactRepository.findOne({ where: { id } });
};


/*********************************************
 * UPDATE
 *********************************************/

export const updateContactService = async (id: number, contactType: string, contactData: Partial<BaseContact>): Promise<BaseContact> => {
    const contactRepository = getContactRepository(contactType);
    await contactRepository.update(id, contactData);
    return findContactById(id, contactType);
};

function getContactRepository(contactType: string) {
    switch (contactType) {
        case 'company':
            return AppDataSource.getRepository(CompanyContact);
        case 'employee':
            return AppDataSource.getRepository(EmployeeContact);
        default:
            throw new Error("Invalid contact type");
    }
}


/*********************************************
 * DELETE
 *********************************************/
export const deleteContactService = async (entityType: string, id: number): Promise<void> => {
    const contactRepository = getContactRepository(entityType);
    await contactRepository.delete(id);
};
