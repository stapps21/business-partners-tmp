import { ReactNode, useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar as ProSidebar } from 'react-pro-sidebar';
import { Badge, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { Business, Delete, Favorite, Group, Home, Mail, MenuBook, MenuOutlined, Storage, SupervisedUserCircle } from "@mui/icons-material";
import { MyCustomThemeOptions } from "../theme.ts";
import { useFetchPaginatedData } from "../hooks/api/useFetchPaginatedData.ts";
import { CompanyData } from "../pages/CompanyListPage.tsx";
import { useRouteMeta } from "../hooks/useRouteMeta.ts";

interface Props {
    title: string,
    to: string,
    icon: ReactNode,
    selected: boolean,
    badgeCount?: number,
    isCollapsed: boolean
}

const Item = ({ title, to, icon, selected, badgeCount = -1, isCollapsed }: Props) => {
    const theme = useTheme<MyCustomThemeOptions>();
    const navigate = useNavigate()

    return (
        <MenuItem
            active={selected}
            style={{
                color: theme.palette.sidenav.textColor,
            }}
            onClick={() => {
                navigate(to)
            }}
            icon={
                badgeCount === -1 || !isCollapsed ? icon :
                    <Badge
                        badgeContent={badgeCount}
                        color="secondary">
                        {icon}
                    </Badge>
            }
        >

            {!isCollapsed &&
                <Typography>{title}
                    {badgeCount !== -1 && !isCollapsed &&
                        <Badge
                            badgeContent={badgeCount}
                            color="secondary"
                            overlap="circular"
                            sx={{ ml: 2, mb: 1 }}
                        />
                    }
                </Typography>
            }

        </MenuItem>
    );
};

const Sidebar = () => {
    const meta = useRouteMeta();
    const theme = useTheme<MyCustomThemeOptions>();
    const [selected, setSelected] = useState(meta.selectedSidenavItem);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        setSelected(meta.selectedSidenavItem)
    }, [meta.selectedSidenavItem])

    const { data } = useFetchPaginatedData<CompanyData>(
        '/companies/inactive',
        'companies',
        { initialLimit: 0 }
    );

    return (
        <Box
            sx={{
                "& .ps-sidebar-root": {
                    borderColor: 'transparent !important',
                },
                "& .ps-sidebar-container": {
                    background: `${theme.palette.sidenav.bgColor}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                },
                /*"& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },*/
                "& .ps-menu-button": {
                    padding: `5px ${isSidebarCollapsed ? '0px' : '16px'} 5px 20px !important`,
                },
                "& .ps-menu-button:hover": {
                    backgroundColor: `${theme.palette.sidenav.bgColorHover} !important`,
                    color: `${theme.palette.sidenav.textColorHover} !important`,
                },
                "& .ps-menu-button.ps-active": {
                    color: `${theme.palette.sidenav.textColorActive} !important`,
                    backgroundColor: `${theme.palette.sidenav.bgColorActive} !important`,
                },
            }}
        >
            <ProSidebar width="300px" collapsed={isSidebarCollapsed} style={{ height: '100vh' }}>
                <Menu>
                    <Box style={{ margin: '15px 15px 15px 20px' }}>
                        {isSidebarCollapsed ?
                            (
                                <IconButton onClick={() => setIsSidebarCollapsed(prev => !prev)}>
                                    <MenuOutlined />
                                </IconButton>
                            ) :
                            (
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography sx={{ whiteSpace: 'nowrap', cursor: 'default' }} variant="h4" color={theme.palette.sidenav.textColorHeadlines}>Business Partners</Typography>
                                    <IconButton onClick={() => setIsSidebarCollapsed(prev => !prev)}>
                                        <MenuOutlined />
                                    </IconButton>
                                </Box>
                            )}
                    </Box>

                    <Box>
                        <Item
                            title="Home"
                            to="/"
                            icon={<Home />}
                            selected={selected === "Home"}
                            isCollapsed={isSidebarCollapsed}
                        />

                        <Typography
                            variant="h6"
                            color={theme.palette.sidenav.textColorHeadlines}
                            sx={{ m: isSidebarCollapsed ? "24px 0 -4px 20px" : "24px 0 5px 20px" }}
                            fontSize={isSidebarCollapsed ? 12 : 18}
                            lineHeight={isSidebarCollapsed ? .8 : 1.1}
                            whiteSpace={'nowrap'}
                            height={20}
                        >
                            Network
                        </Typography>
                        <Item
                            title="Companies"
                            to="/companies"
                            icon={<Business />}
                            selected={selected === "Companies"}
                            isCollapsed={isSidebarCollapsed}
                        />
                        <Item
                            title="Employees"
                            to="/employees"
                            icon={<Group />}
                            selected={selected === "Employees"}
                            isCollapsed={isSidebarCollapsed}
                        />
                        <Item
                            title="Distributors"
                            to="/distributors"
                            icon={<Mail />}
                            selected={selected === "Distributors"}
                            isCollapsed={isSidebarCollapsed}
                        />
                        {auth.isAdmin &&
                            <>
                                <Typography
                                    variant="h6"
                                    color={theme.palette.sidenav.textColorHeadlines}
                                    sx={{ m: isSidebarCollapsed ? "24px 0 -4px 20px" : "24px 0 5px 20px" }}
                                    fontSize={isSidebarCollapsed ? 12 : 18}
                                    lineHeight={isSidebarCollapsed ? .8 : 1.1}
                                    height={20}
                                >
                                    Admin
                                </Typography>
                                <Item
                                    title="Manage users"
                                    to="/users"
                                    icon={<SupervisedUserCircle />}
                                    selected={selected === "ManageUsers"}
                                    isCollapsed={isSidebarCollapsed}
                                />
                                <Item
                                    title="Reference data"
                                    to="/reference-data"
                                    icon={<Storage />}
                                    selected={selected === "ReferenceData"}
                                    isCollapsed={isSidebarCollapsed}
                                />
                                <Item
                                    title="Log"
                                    to="/log"
                                    icon={<MenuBook />}
                                    selected={selected === "Log"}
                                    isCollapsed={isSidebarCollapsed}
                                />
                                <Item
                                    title="Trash"
                                    to="/trash"
                                    icon={<Delete />}
                                    selected={selected === "Trash"}
                                    badgeCount={data?.total}
                                    isCollapsed={isSidebarCollapsed}
                                />
                            </>
                        }

                    </Box>
                </Menu>
                <Box color="grey" textAlign="center" mb={2}>
                    {!isSidebarCollapsed ?
                        <Typography fontWeight="bold" style={{ whiteSpace: 'nowrap' }}>
                            Made with <Favorite style={{ fontSize: 16, marginBottom: -2 }} />  by Stapps
                        </Typography>
                        :
                        <Favorite style={{ fontSize: 24 }} />
                    }
                </Box>
            </ProSidebar>
        </Box >
    );
};

export default Sidebar;