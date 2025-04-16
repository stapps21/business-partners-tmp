import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises'; // Use the promise-based version of fs

export enum AllowedFolders {
    Employee = "employee",
    Company = "company"
}

export const BASE_ATTACHMENT_PATH = 'uploads';

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const folderName = req.params.folderName as AllowedFolders;
        const companyId = req.params.id;

        // Check if the folder name is valid
        if (!Object.values(AllowedFolders).includes(folderName)) {
            return cb(new Error("Invalid folder name"), null);
        }

        // Construct the path
        const destPath = path.join(BASE_ATTACHMENT_PATH, folderName, companyId);

        // Ensure the directory exists
        try {
            await fs.mkdir(destPath, { recursive: true });
            cb(null, destPath);
        } catch (err) {
            cb(new Error("Failed to create directory"), null);
        }
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        cb(null, uuidv4() + fileExt); // UUID as filename with original extension
    }
});

const fileFilter = (req, file, cb) => {
    // You can add file type or size validations here
    cb(null, true);
};

export const upload = multer({ storage, fileFilter });
