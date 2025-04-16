require('module-alias/register')
import { AppDataSource } from "@config/data-source";
import { JobTitle } from "@entities/employee/JobTitle";
import ResponseError from "../utils/ResponseError";


export const createJobTitleService = async (jobTitleListData: Partial<JobTitle>): Promise<JobTitle> => {
    try {
        const jobTitleListRepository = AppDataSource.getRepository(JobTitle);
        const jobTitleList = jobTitleListRepository.create(jobTitleListData);
        return await jobTitleListRepository.save(jobTitleList);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // Adjust error code based on your DBMS
            throw new ResponseError(400, "Operation failed - JobTitle already exists", "JOBTIT_CREATE_400_DUPLICATE", true);
        }
        throw error;
    }
};

export const findJobTitleById = async (id: number): Promise<JobTitle | undefined> => {
    const jobTitleListRepository = AppDataSource.getRepository(JobTitle);
    return await jobTitleListRepository.findOne({ where: { id } });
};

/*export const findJobTitleListByEmployeeId = async (id: number): Promise<JobTitleList | undefined> => {
    const jobTitleListRepository = AppDataSource.getRepository(JobTitleList);
    return await jobTitleListRepository.findOne({ where: { id } });
};*/

export const getAllJobTitlesService = async (): Promise<JobTitle[]> => {
    const jobTitleListRepository = AppDataSource.getRepository(JobTitle);
    return await jobTitleListRepository.find();
};

export const updateJobTitleService = async (id: number, jobTitleListData: Partial<JobTitle>): Promise<JobTitle> => {
    const jobTitleListRepository = AppDataSource.getRepository(JobTitle);
    await jobTitleListRepository.update(id, jobTitleListData);
    return findJobTitleById(id);
};

export const deleteJobTitleService = async (id: number): Promise<void> => {
    const jobTitleListRepository = AppDataSource.getRepository(JobTitle);
    await jobTitleListRepository.delete(id);
};
