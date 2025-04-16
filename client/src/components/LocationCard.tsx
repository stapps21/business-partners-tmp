import React, { useState } from 'react';
import { Box, Card, CardActionArea, CardContent, DialogContent, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import CustomDialog from './CustomDialog';
import CustomSingleDialogTextField from './dialogs/CustomSingleDialogTextField';
import { yupResolver } from '@hookform/resolvers/yup';
import useDialogState from '../hooks/useDialogState';
import { Control, useForm } from 'react-hook-form';
import { useDeleteData } from '../hooks/api/useDeleteData';
import { useUpdateData } from '../hooks/api/useUpdateData';
import { Location } from '../../../server/src/entities/shared/Location';
import { Company } from '../../../server/src/entities/Company';
import { RequestUpdateLocation, requestUpdateLocationSchema } from '../../../business-partners-common/src/types/location.ts';


interface LocationCardProps {
    company: Company,
    location: Location;
    isSelected: boolean;
    onSelect: () => void;
}

interface LocationDetailsProps {
    control: Control<RequestUpdateLocation>
}

const LocationCard: React.FC<LocationCardProps> = ({
    company,
    location,
    isSelected,
    onSelect,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const { isDialogOpen: isOpenEditDialog, handleCloseDialog: closeEditDialog, handleOpenDialog: openEditDialog } = useDialogState()
    const { isDialogOpen: isOpenDeleteDialog, handleCloseDialog: closeDeleteDialog, handleOpenDialog: openDeleteDialog } = useDialogState()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RequestUpdateLocation>({
        mode: "onBlur",
        resolver: yupResolver(requestUpdateLocationSchema),
        defaultValues: {
            name: location.name,
            street: location.street,
            houseNumber: location.houseNumber,
            postalCode: location.postalCode,
            city: location.city,
        }
    });

    const onMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onCloseMenu = () => {
        setAnchorEl(null);
    };

    const { mutate: handleUpdateLocation } = useUpdateData<RequestUpdateLocation>(`/locations/${location.id}`, `company-${company.id}`);
    const { mutate: handleDelete } = useDeleteData(`/locations`, `company-${company.id}`);

    const onSubmit = (data: RequestUpdateLocation) => {
        handleUpdateLocation(data, {
            onSuccess: () => closeEditDialog(),
            onError: (error) => console.error('Error update location:', error),
        });
    };

    const onDelete = () => {
        handleDelete(location.id, {
            onSuccess: () => closeEditDialog(),
            onError: (error) => console.error('Error deleting location:', error),
        });
    };

    const handleOpenEdit = () => {
        openEditDialog()
        onCloseMenu()
    }

    const handleOpenDelete = () => {
        openDeleteDialog()
        onCloseMenu()
    }

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    position: 'relative',
                    bgcolor: isSelected ? 'primary.light' : 'background.paper',
                    borderColor: isSelected ? 'primary.main' : 'divider'
                }}
            >
                <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}
                    aria-label="more"
                    id="long-button"
                    aria-controls={menuOpen ? 'long-menu' : undefined}
                    aria-expanded={menuOpen ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={onMenuClick}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={onCloseMenu}
                >
                    <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleOpenDelete}>Delete</MenuItem>
                    <MenuItem onClick={onCloseMenu}>Copy Address</MenuItem>
                </Menu>
                <CardActionArea onClick={onSelect} disabled={company.locations.length === 1}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">{location.name || 'Hauptstandort'}</Typography>
                        </Box>
                        <Typography variant="body2" component="div">
                            <Box fontWeight="fontWeightMedium">{location.street} {location.houseNumber}</Box>
                            <Box>{location.postalCode} {location.city}</Box>
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card >

            <CustomDialog open={isOpenEditDialog} onClose={closeEditDialog} title={`Edit location`} labelPositiveButton='Update location' disabled={isSubmitting} onConfirm={handleSubmit(onSubmit)}>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <LocationDetails control={control} />
                    </form>
                </DialogContent>
            </CustomDialog>

            <CustomDialog variant='error' open={isOpenDeleteDialog} onClose={closeDeleteDialog} title={`Delete location`} labelPositiveButton='Delete location' disabled={isSubmitting} onConfirm={onDelete}>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        Delete Location TODO
                        Also all employees of this location getting deleted
                    </form>
                </DialogContent>
            </CustomDialog>
        </>
    );
};

// LocationDetails component
const LocationDetails = ({ control }: LocationDetailsProps) => (
    <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomSingleDialogTextField name="name" label="Location Name" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="street" label="Street" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="houseNumber" label="House Number" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="postalCode" label="Postal Code" control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomSingleDialogTextField name="city" label="City" control={control} />
            </Grid>
        </Grid>
    </Box>
);

export default LocationCard;
