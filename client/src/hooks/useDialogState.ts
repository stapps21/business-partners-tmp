import { useState } from 'react';

const useDialogState = (initialState = false) => {
    const [isDialogOpen, setOpen] = useState(initialState);

    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    return { isDialogOpen, handleOpenDialog, handleCloseDialog };
};

export default useDialogState