import React, { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { NavLink } from 'react-router-dom';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

// --- MOCK DATA ---
const initialUsers = [
  { id: 1, name: 'Ankit Sharma', email: 'admin@amalthea.com', role: 'ADMIN', manager: null, avatar: 'AS' },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', role: 'MANAGER', manager: 'Ankit Sharma', avatar: 'PP' },
  { id: 3, name: 'John Doe', email: 'john.doe@example.com', role: 'EMPLOYEE', manager: 'Priya Patel', avatar: 'JD' },
  { id: 4, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'EMPLOYEE', manager: 'Priya Patel', avatar: 'JS' },
  { id: 5, name: 'Ravi Kumar', email: 'ravi.kumar@example.com', role: 'MANAGER', manager: 'Ankit Sharma', avatar: 'RK' },
];

const getRoleChipColor = (role) => {
  if (role === 'ADMIN') return 'primary';
  if (role === 'MANAGER') return 'secondary';
  return 'default';
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const managers = users.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN').map(m => m.name);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentUser({ name: '', email: '', role: 'EMPLOYEE', manager: '' });
    setOpen(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (isEditing) {
        // Update existing user
        setUsers(users.map(u => (u.id === currentUser.id ? currentUser : u)));
        console.log("Updated user:", currentUser);
      } else {
        // Create new user
        const newUser = { ...currentUser, id: users.length + 1, avatar: currentUser.name.split(' ').map(n=>n[0]).join('') };
        setUsers([...users, newUser]);
        console.log("Created user:", newUser);
      }
      setLoading(false);
      handleClose();
    }, 1500);
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NavLink} underline="hover" color="inherit" to="/">Dashboard</Link>
        <Typography color="text.primary">Manage Users</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">User Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create User
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{user.avatar}</Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Chip label={user.role} color={getRoleChipColor(user.role)} size="small" /></TableCell>
                  <TableCell>{user.manager || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenEdit(user)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error"><BlockIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddAlt1Icon />
          {isEditing ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Full Name" type="text" fullWidth variant="outlined" value={currentUser?.name} onChange={handleChange} sx={{ mt: 1 }} />
          <TextField margin="dense" name="email" label="Email Address" type="email" fullWidth variant="outlined" value={currentUser?.email} onChange={handleChange} />
          <TextField select margin="dense" name="role" label="Role" fullWidth variant="outlined" value={currentUser?.role} onChange={handleChange}>
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>
          {currentUser?.role === 'EMPLOYEE' && (
             <TextField select margin="dense" name="manager" label="Assign Manager" fullWidth variant="outlined" value={currentUser?.manager} onChange={handleChange}>
                {managers.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
             </TextField>
          )}
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}>
            {loading ? 'Saving...' : 'Save User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsersPage;