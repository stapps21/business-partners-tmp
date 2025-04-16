import React, { useRef } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';

interface AddFileCardProps {
    onFileSelected: (files: FileList | null) => void;
}

const Input = styled('input')({
    display: 'none',
});

const AddFileCard: React.FC<AddFileCardProps> = ({ onFileSelected }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: 'action.outline',
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover': {
                borderColor: 'action.hover',
            }
        }} onClick={triggerFileInput}>
            <CardActionArea sx={{
                height: 150,
                width: 150,
            }}>
                <Typography sx={{ color: 'primary.main', textAlign: 'center' }}>
                    <AddIcon fontSize="large" />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Drag & Drop or
                    <br />
                    Select File
                </Typography>
                <Input accept="file/*" ref={fileInputRef} type="file" multiple onChange={(e) => onFileSelected(e.target.files)} />
            </CardActionArea>
        </Card>
    );
};

export default AddFileCard;
