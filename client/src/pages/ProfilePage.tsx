import { Box, Typography, Avatar, Button, TextField, Grid, Paper, CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';
import { User } from '../../../server/src/entities/User';
import { useFetchData } from '../hooks/api/useFetchData';
import { USER_ROLES } from '../../../server/src/enum/UserRoles';

const ProfilePage = () => {
    const { data: user, isLoading } = useFetchData<Omit<User, 'lastPasswordChange'> & { lastPasswordChange: string }>('/users/me', 'user-me')
    const initials = `${user?.firstName?.charAt(0)}${user?.lastName.charAt(0)}`;

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
    }

    if (!user) {
        return <Typography variant="h6" align="center">No user found</Typography>;
    }

    return (
        <Paper elevation={3} style={{ margin: '30px', padding: '20px' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} display="flex" alignItems="top" justifyContent="space-between" mb={2} mt={2}>
                    <Box display="flex" alignItems="center">
                        <Box>
                            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>{initials}</Avatar>
                        </Box>
                        <Box>
                            <Typography variant="h5">
                                {`${user.firstName} ${user.lastName}`}
                            </Typography>
                            <Typography color="textSecondary">{user.roles.map(x => parseInt(x as unknown as string)).includes(USER_ROLES.ADMIN) ? 'Admin' : 'User'}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 2, textAlign: 'right' }} lineHeight={1.2} fontSize={12} color={grey}>Last Password Change<br />{user.lastPasswordChange ?? 'never'}</Typography>
                        <Button variant="outlined" color="primary" >
                            Change Password
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField helperText="Only an admin can change the users mail address" label="Email" disabled fullWidth variant="outlined" defaultValue={user.mail} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Mobile" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Phone" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Fax" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} >
                    <Button disabled variant="contained" color="primary" style={{ float: 'right' }} >
                        Save contact changes
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProfilePage;
