require('module-alias/register')
import { NextFunction, Request, Response } from 'express';
import { downloadFileService, uploadFileService } from "@services/AttachmentService";
import { AllowedFolders, BASE_ATTACHMENT_PATH } from "@config/multer-config";
import path from "path";

export const attachmentController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        const id = parseInt(req.params.id);
        const folderName = req.params.folderName as AllowedFolders;

        if (!Object.values(AllowedFolders).includes(folderName)) {
            res.status(400).send(`Invalid folder name: ${folderName}`);
            return;
        }

        const files = req.files as Express.Multer.File[];
        await uploadFileService(files, id, folderName);

        res.send('Files have been uploaded and metadata saved.');
    } catch (error) {
        res.status(500).send(`Server error: ${error}`);
    }
};

export const attachmentDownloadController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folderName, id, filename } = req.params;
        const filePath = path.join(BASE_ATTACHMENT_PATH, folderName, id, filename);

        const file = await downloadFileService(filePath);
        if (!file) {
            return res.status(404).send('File not found.');
        }

        res.download(filePath, filename);
    } catch (error) {
        console.error(`Download error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};