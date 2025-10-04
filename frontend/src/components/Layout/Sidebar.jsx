import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Avatar, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const drawerWidth = 260;

const navConfig = {
    EMPLOYEE: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Submit Expense', icon: <AddCardIcon />, path: '/expenses/new' },
        { text: 'My Expenses', icon: <ReceiptLongIcon />, path: '/expenses/my' },
    ],
    MANAGER: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Submit Expense', icon: <AddCardIcon />, path: '/expenses/new' },
        { text: 'My Expenses', icon: <ReceiptLongIcon />, path: '/expenses/my' },
        { text: 'Team Approvals', icon: <PeopleIcon />, path: '/approvals/team' },
    ],
    ADMIN: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'All Expenses', icon: <ReceiptLongIcon />, path: '/expenses/all' },
        { text: 'Approval Rules', icon: <AdminPanelSettingsIcon />, path: '/admin/rules' },
        { text: 'Manage Users', icon: <PeopleIcon />, path: '/admin/users' },
    ],
};

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user) || { role: 'EMPLOYEE', name: 'Ankit Sharma' }; 
    const navItems = navConfig[user.role] || [];

    const navLinkStyles = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px 16px',
        color: isActive ? '#ffffff' : '#a9b3c6',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
        borderRadius: '8px',
        textDecoration: 'none',
        marginBottom: '4px',
        transition: 'background-color 0.2s, color 0.2s',
    });

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: 'primary.main', 
                    color: '#fff',
                    borderRight: 'none',
                },
            }}
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, gap: 1 }}>
                <BusinessCenterIcon sx={{ fontSize: 30 }}/>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                    Amalthea
                </Typography>
            </Toolbar>
            <Box sx={{ overflow: 'auto', p: 2 }}>
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                             <NavLink to={item.path} style={navLinkStyles}>
                                <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </NavLink>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ p: 2, mt: 'auto' }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>{user.name.charAt(0)}</Avatar>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#a9b3c6' }}>{user.role}</Typography>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;