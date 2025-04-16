import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AttachmentCard from '../../AttachmentCard';
import useDragDrop from '../../../hooks/useDragDrop';
import useFileOperations from '../../../hooks/useFileOperations';
import { BaseAttachment } from '../../../../../server/src/entities/shared/BaseAttachment';
import AddFileCard from '../../AddFileCard';

type Folder = 'company' | 'employee'
type AttachmentsCardProps = {
    attachments: BaseAttachment[]
    folder: Folder
    id: number
};

const AttachmentsCard: React.FC<AttachmentsCardProps> = ({
    attachments, folder, id
}) => {
    const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, isDragging } = useDragDrop()
    const { uploadMultipleFiles, downloadFile } = useFileOperations()

    const handleFileUpload = (files: FileList) => {
        uploadMultipleFiles(files, `/attachments/upload/${folder}/${id}`)
    }

    return (
        <Card
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, handleFileUpload)}
            style={{
                backgroundColor: isDragging() ? '#eaeaea' : '',
                // Add other styles or classes as needed
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Attachments
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <AddFileCard onFileSelected={(files: FileList | null) => {
                        if (files === null) return;
                        handleFileUpload(files);
                    }} />
                    {attachments.map((attachment) => (
                        <AttachmentCard
                            key={attachment.id}
                            attachment={attachment}
                            onClick={() => downloadFile(`/attachments/download/${folder}/${id}/${attachment.filename}`, attachment.originalFilename)}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default AttachmentsCard;
