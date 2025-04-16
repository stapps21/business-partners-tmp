import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, MyCustomThemeOptions } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ArrowBack, ArrowDropDown } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useRouteMeta } from "../hooks/useRouteMeta";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import GlobalOverlaySearch from "./GlobalOverlaySearch";

const Topbar = () => {
    const meta = useRouteMeta();
    const navigate = useNavigate()
    const theme = useTheme<MyCustomThemeOptions>();
    const colorMode = useContext(ColorModeContext);
    const { user } = useAuth();
    const logout = useLogout()

    // State for the dropdown menu
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen: boolean = Boolean(anchorEl);

    // Handlers for dropdown menu
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose()
        logout()
    }

    const goToProfile = () => {
        handleClose()
        navigate('/profile')
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor={theme.palette.topbar.bgColor} p={2} height={75} borderBottom="1px solid grey">

            <Box display="flex">
                {/* Sidebar Toggle */}
                {/* <IconButton onClick={() => setIsSidebarCollapsed(prev => !prev)}>
                    <MenuOutlined />
                </IconButton> */}
                {meta.showBackArrow &&
                    <IconButton onClick={goBack}>
                        <ArrowBack />
                    </IconButton>
                }
                <Box display="flex" alignItems="center">
                    <Typography
                        variant="h4"
                        fontWeight="bold">
                        {meta.title}
                    </Typography>
                </Box>
            </Box>

            <Box>
                <GlobalOverlaySearch />
            </Box>

            {/* Right */}
            <Box display="flex">
                {/* Icons */}
                <Box display="flex" alignItems="center" mr={2}>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                    </IconButton>
                    {/* <IconButton>
                        <NotificationsOutlinedIcon />
                    </IconButton> */}

                    {/* User Information */}
                </Box>

                {user && (
                    <>
                        <Box display="flex" mr={2}>
                            <Divider orientation="vertical" flexItem />
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center" p={2} mx={{ cursor: 'pointer' }} sx={{ ":hover": { backgroundColor: theme.palette.grey ? theme.palette.grey[900] : '#a2a2a2' }, borderRadius: 2 }} onClick={handleMenu} >
                            <Avatar sx={{ height: 32, width: 32, fontSize: 16 }}>{user.firstName[0]}{user.lastName[0]}</Avatar>
                            <Box display="flex" flexDirection="column" alignItems="flex-start" ml={2} mr={1}>
                                <Typography fontSize={16} lineHeight={1} color="text.primary">
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography fontSize={16} lineHeight={1} color="text.secondary">
                                    {user.mail}
                                </Typography>
                            </Box>
                            <ArrowDropDown />
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            open={isOpen}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem sx={{ minWidth: '120px' }} onClick={goToProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>

                    </>
                )}
            </Box>
        </Box>
    );
};

export default Topbar;
