import React, { forwardRef, ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Grow, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';

interface CustomDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
    disabled?: boolean;
    labelPositiveButton?: string;
    labelNegativeButton?: string;
    variant?: 'default' | 'error'; // Added variant prop
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} />;
});

const CustomDialog: React.FC<CustomDialogProps> = ({
    open,
    onClose,
    onConfirm,
    children,
    title,
    disabled,
    labelPositiveButton = "Confirm",
    labelNegativeButton = "Cancel",
    variant = 'default', // Default variant
}) => {
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        onClose();
    }

    // Styles for error variant
    const errorStyles = variant === 'error' ? {
        borderColor: 'red', // Optional: if you want to change border color
        confirmButtonColor: 'error'
    } : {};

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            PaperProps={{
                style: {
                    maxWidth: '740px',
                    maxHeight: '80vh',
                }
            }}
            transitionDuration={250}
            TransitionComponent={Transition}>
            <DialogTitle sx={{ py: 2, pl: 4, fontWeight: 'bold' }}>
                <Box display="flex">
                    {variant === 'error' &&
                        < Warning sx={{ mr: 1 }} />
                    }
                    <Typography variant='h4'>{title}</Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 16, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ px: 1 }}>
                {children}
            </DialogContent>
            <DialogActions sx={{ pr: 4, pt: 1.5, pb: 1.5 }}>
                <Button variant='contained' color={errorStyles.confirmButtonColor} onClick={onConfirm} disabled={disabled}>{labelPositiveButton}</Button>
                <Button variant='outlined' onClick={onClose}>{labelNegativeButton}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialog;
