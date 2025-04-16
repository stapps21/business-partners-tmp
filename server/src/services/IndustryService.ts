require('module-alias/register')
import { AppDataSource } from "@config/data-source";
import ResponseError from "@utils/ResponseError";
import { Industry } from "@entities/company/Industry";

export const createIndustryService = async (industryData: Partial<Industry>): Promise<Industry> => {
    try {
        const industryRepository = AppDataSource.getRepository(Industry);
        const industry = industryRepository.create(industryData);
        return await industryRepository.save(industry);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // Adjust error code based on your DBMS
            throw new ResponseError(400, "Operation failed - Industry already exists", "COMP_CREATE_400_DUPLICATE", true);
        }
        throw error;
    }
};


export const findIndustryById = async (id: number): Promise<Industry | undefined> => {
    const industryRepository = AppDataSource.getRepository(Industry);
    return await industryRepository.findOne({ where: { id } });
};

export const getAllIndustriesService = async (): Promise<Industry[]> => {
    const industryRepository = AppDataSource.getRepository(Industry);
    return await industryRepository.find();
};



export const updateIndustryService = async (id: number, industryData: Partial<Industry>): Promise<Industry> => {
    const industryRepository = AppDataSource.getRepository(Industry);
    await industryRepository.update(id, industryData);
    return findIndustryById(id);
};


export const deleteIndustryService = async (id: number): Promise<void> => {
    const industryRepository = AppDataSource.getRepository(Industry);
    await industryRepository.delete(id);
};
