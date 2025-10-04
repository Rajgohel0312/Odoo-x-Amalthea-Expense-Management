import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box, Badge, ListItemIcon  } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';

import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 260;

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || { name: 'User' };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {  
    dispatch(logout());
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0} 
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: 'background.paper', 
        color: 'text.primary',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)', 
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Dashboard
        </Typography>

        <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
                 <NotificationsIcon />
            </Badge>
        </IconButton>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {user.name.charAt(0)}
          </Avatar>
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem disabled>{user.name}</MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;