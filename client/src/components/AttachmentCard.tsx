import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FileDownload } from '@mui/icons-material';
import { BaseAttachment } from '../../../server/src/entities/shared/BaseAttachment';

const AttachmentCard = ({ attachment, onClick }: { attachment: BaseAttachment, onClick: (attachment: BaseAttachment) => void }) => {
    const getFileSize = () => {
        const fileSize = attachment.fileSize; // Assuming this is in bytes

        if (fileSize < 1024) return `${fileSize} B`;

        const i = Math.floor(Math.log(fileSize) / Math.log(1024));
        const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];

        return `${(fileSize / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    const getFileLogo = () => {
        return <FileDownload />
    }

    return (
        <Card sx={{ maxWidth: 350, minWidth: 200, backgroundColor: '#585858' }}>
            <CardActionArea onClick={() => onClick(attachment)} sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>{getFileLogo()}</div>
                    <Typography gutterBottom variant="h6" component="div">
                        {attachment.originalFilename}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {getFileSize()}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default AttachmentCard;
