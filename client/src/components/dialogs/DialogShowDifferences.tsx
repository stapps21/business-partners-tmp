import { Box, Button, CircularProgress, DialogContent, Grid, MenuItem, Select, Typography, Switch } from '@mui/material';
import CustomDialog from '../CustomDialog.tsx';
import useDialogState from '../../hooks/useDialogState.ts';
import { useFetchData } from '../../hooks/api/useFetchData.ts';
import { Log } from '../../../../server/src/entities/Log.ts';
import { useState } from 'react';
import JsonDiffView from '../JsonDiffView.tsx';

const DialogShowDifferences = ({ id, isDialogOpen, handleCloseDialog }: { id: number, isDialogOpen: boolean, handleCloseDialog: () => void }) => {
    const { data, isLoading } = useFetchData<Log>(`/log/${id}`, `log-${id}`)
    const [compareSideBySide, setCompareSideBySide] = useState(true); // State for toggling view

    const handleToggleView = () => {
        setCompareSideBySide(!compareSideBySide);
    };

    return (
        <CustomDialog open={isDialogOpen} onClose={handleCloseDialog} title={`Differences`} onConfirm={handleCloseDialog} >
            <DialogContent>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <JsonDiffView
                                    previousJson={data?.previousState ? JSON.parse(data.previousState) : null}
                                    afterJson={data?.afterState ? JSON.parse(data.afterState) : null}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>
        </CustomDialog>
    );
};

export default DialogShowDifferences;