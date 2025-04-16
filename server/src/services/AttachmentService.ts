require('module-alias/register')
import { AppDataSource } from "@config/data-source";
import { CompanyAttachment } from "@entities/company/CompanyAttachment";
import { Company } from "@entities/Company";
import { EmployeeAttachment } from "@entities/employee/EmployeeAttachment";
import { Employee } from "@entities/Employee";
import { AllowedFolders } from "@config/multer-config";
import fs from "fs/promises";


export const uploadFileService = async (files: Express.Multer.File[], id: number, folderName: string) => {
    // Validate input
    if (!Array.isArray(files) || typeof id !== 'number') {
        throw new Error("Invalid input parameters");
    }

    const attachmentRepository = AppDataSource.getRepository(
        folderName === AllowedFolders.Company ? CompanyAttachment : EmployeeAttachment
    );
    const attachments = [];

    for (const file of files) {
        const attachment = folderName === AllowedFolders.Company ? new CompanyAttachment() : new EmployeeAttachment();
        attachment.filename = file.filename;
        attachment.originalFilename = file.originalname;
        attachment.fileSize = file.size;
        attachment.fileExtension = file.mimetype;

        if (attachment instanceof EmployeeAttachment) {
            attachment.employee = { id } as Employee;
        } else if (attachment instanceof CompanyAttachment) {
            attachment.company = { id } as Company
        }

        attachments.push(attachment);
    }


    // Use transaction for bulk operation
    try {
        await AppDataSource.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(attachmentRepository.target, attachments);
        });
    } catch (error) {
        console.error("Error saving attachments: ", error);
        throw new Error("Failed to save file attachments");
    }
};

export const downloadFileService = async (filePath) => {
    try {
        await fs.access(filePath);
        return filePath;
    } catch (error) {
        console.error(`Error accessing file: ${error}`);
        return null;
    }
};