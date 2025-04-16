require('module-alias/register')
import { AppDataSource } from "@config/data-source";
import ResponseError from "@utils/ResponseError";
import { Subject } from "@entities/employee/Subject";

export const createSubjectService = async (subjectData: Partial<Subject>): Promise<Subject> => {
    try {
        const subjectRepository = AppDataSource.getRepository(Subject);
        const subject = subjectRepository.create(subjectData);
        return await subjectRepository.save(subject);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // Adjust error code based on your DBMS
            throw new ResponseError(400, "Operation failed - Subject already exists", "SUBJ_CREATE_400_DUPLICATE", true);
        }
        throw error;
    }
};

export const findSubjectById = async (id: number): Promise<Subject | undefined> => {
    const subjectRepository = AppDataSource.getRepository(Subject);
    return await subjectRepository.findOne({ where: { id } });
};

export const getAllSubjectsService = async (): Promise<Subject[]> => {
    const subjectRepository = AppDataSource.getRepository(Subject);
    return await subjectRepository.find();
};

export const updateSubjectService = async (id: number, subjectData: Partial<Subject>): Promise<Subject> => {
    const subjectRepository = AppDataSource.getRepository(Subject);
    await subjectRepository.update(id, subjectData);
    return findSubjectById(id);
};

export const deleteSubjectService = async (id: number): Promise<void> => {
    const subjectRepository = AppDataSource.getRepository(Subject);
    await subjectRepository.delete(id);
};
