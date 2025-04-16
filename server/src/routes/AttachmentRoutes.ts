require('module-alias/register')
import { Router } from 'express';
import { attachmentController, attachmentDownloadController } from "@controllers/AttachmentController";
import { upload } from "@config/multer-config";

const attachmentRouter = Router();

attachmentRouter.post('/upload/:folderName/:id', upload.array('files'), attachmentController)
attachmentRouter.get('/download/:folderName/:id/:filename', attachmentDownloadController)

export default attachmentRouter