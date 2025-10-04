import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // <-- IMPORT THE useTheme HOOK
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import AssessmentIcon from '@mui/icons-material/Assessment';

// --- MOCK DATA (Same as before) ---
const employeeSummary = { pending: 325.00, approved: 1850.00, rejected: 1 };
const recentEmployeeExpenses = [
  { id: 1, date: 'Oct 03, 2025', desc: 'Lunch Mtg', amount: 120.00, status: 'Pending' },
  { id: 2, date: 'Oct 01, 2025', desc: 'Software Sub', amount: 450.00, status: 'Pending' },
  { id: 3, date: 'Sep 28, 2025', desc: 'Client Dinner', amount: 120.00, status: 'Approved' },
];
const managerApprovalQueue = [
    { id: 1, employee: 'John Doe', amount: 120.00, desc: 'Lunch Mtg' },
    { id: 2, employee: 'Jane Smith', amount: 450.00, desc: 'Software Sub' },
    { id: 3, employee: 'David Lee', amount: 75.50, desc: 'Taxi Fare' },
    { id: 4, employee: 'Sarah Chen', amount: 99.99, desc: 'Office Supplies' },
];
const recentTeamActivity = [
    { id: 1, employee: 'John Doe', desc: 'Lunch Mtg', amount: 120.00, status: 'Pending' },
    { id: 2, employee: 'Jane Smith', desc: 'Software Sub', amount: 450.00, status: 'Pending' },
    { id: 3, employee: 'Mike Johnson', desc: 'Client Dinner', amount: 120.00, status: 'Approved' },
];
const spendingCategories = [ { name: 'Travel', value: 40 }, { name: 'Food', value: 20 }, { name: 'Other', value: 10 }];
const PIE_CHART_COLORS = ['#0A2540', '#00A86B', '#FFBB28'];
const companySpendingData = [
    { month: 'Jul', spent: 25000 }, { month: 'Aug', spent: 32000 },
    { month: 'Sep', spent: 35000 }, { month: 'Oct', spent: 42000 },
    { month: 'Nov', spent: 48000 }, { month: 'Dec', spent: 51000 },
];
const recentSystemActivity = [
    "User 'John Doe' created.", "Approval rule 'Finance' updated.",
    "Company currency changed to USD.", "Sarah Chen escalated an expense.",
];

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, icon }) => (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
            <Typography variant="body1" color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
    </Paper>
);

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Approved': return 'success';
    case 'Pending': return 'warning';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

// --- ROLE-SPECIFIC VIEWS ---

const EmployeeView = () => (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">Welcome back, Ankit!</Typography>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} size="large" sx={{ px: 3, py: 1.5, borderRadius: 2 }}>
                Submit New Expense
            </Button>
        </Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}><StatCard title="Pending Expenses" value={`$${employeeSummary.pending.toFixed(2)}`} icon={<PendingActionsIcon color="warning" sx={{ fontSize: 40 }} />} /></Grid>
            <Grid item xs={12} md={4}><StatCard title="Approved This Month" value={`$${employeeSummary.approved.toFixed(2)}`} icon={<CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />} /></Grid>
            <Grid item xs={12} md={4}><StatCard title="Rejected Expenses" value={employeeSummary.rejected} icon={<HighlightOffIcon color="error" sx={{ fontSize: 40 }} />} /></Grid>
        </Grid>
        <Paper>
            <Box sx={{ p: 2 }}><Typography variant="h6">Recent Expenses</Typography></Box>
            <TableContainer>
                <Table><TableHead><TableRow><TableCell>Date</TableCell><TableCell>Description</TableCell><TableCell align="right">Amount</TableCell><TableCell align="center">Status</TableCell></TableRow></TableHead>
                <TableBody>
                    {recentEmployeeExpenses.map((expense) => (
                        <TableRow key={expense.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}><TableCell>{expense.date}</TableCell><TableCell>{expense.desc}</TableCell><TableCell align="right">${expense.amount.toFixed(2)}</TableCell><TableCell align="center"><Chip label={expense.status} color={getStatusChipColor(expense.status)} /></TableCell></TableRow>
                    ))}
                </TableBody></Table>
            </TableContainer>
            <Box sx={{ p: 2, textAlign: 'center' }}><Link href="#" variant="body2" sx={{ fontWeight: 'bold' }}>View All My Expenses <ArrowForwardIosIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }} /></Link></Box>
        </Paper>
    </Box>
);

const ManagerView = () => (
    <Box>
         <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
                <Paper sx={{ p: 2.5, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>Awaiting Your Approval</Typography>
                        <Badge badgeContent={managerApprovalQueue.length} color="error" />
                    </Box>
                    <List disablePadding>
                        {managerApprovalQueue.map((item) => (
                           <ListItem key={item.id} secondaryAction={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>${item.amount.toFixed(2)}</Typography>} disablePadding sx={{ py: 1 }} button><ListItemText primary={item.employee} secondary={item.desc} /></ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={7}>
                <Grid container spacing={3}>
                    <Grid item xs={6}><StatCard title="Team Pending" value="$1,250.75" icon={<PendingActionsIcon color="warning" sx={{ fontSize: 40 }} />} /></Grid>
                    <Grid item xs={6}><StatCard title="Team Approved (Month)" value="$8,500.00" icon={<CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />} /></Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" component="h2" gutterBottom>Top Spending Categories</Typography>
                            <Box sx={{ height: 180 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart><Tooltip formatter={(value, name) => [`$${value}`, `${name} (${value}%)`]} /><Pie data={spendingCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">{spendingCategories.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}</Pie></PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                 <Paper>
                    <Box sx={{ p: 2 }}><Typography variant="h6">Recent Team Activity</Typography></Box>
                    <TableContainer><Table><TableHead><TableRow><TableCell>Employee</TableCell><TableCell>Description</TableCell><TableCell align="right">Amount</TableCell><TableCell align="center">Status</TableCell></TableRow></TableHead>
                    <TableBody>
                        {recentTeamActivity.map((expense) => (<TableRow key={expense.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}><TableCell>{expense.employee}</TableCell><TableCell>{expense.desc}</TableCell><TableCell align="right">${expense.amount.toFixed(2)}</TableCell><TableCell align="center"><Chip label={expense.status} color={getStatusChipColor(expense.status)} /></TableCell></TableRow>))}
                    </TableBody></Table></TableContainer>
                    <Box sx={{ p: 2, textAlign: 'center' }}><Link href="#" variant="body2" sx={{ fontWeight: 'bold' }}>View All Team Expenses <ArrowForwardIosIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }} /></Link></Box>
                </Paper>
            </Grid>
         </Grid>
    </Box>
);

const AdminView = () => {
  const theme = useTheme(); // <-- GET THE THEME OBJECT HERE

  return (
    <Box>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}><StatCard title="Total Pending Approval" value="$125,800.50" icon={<PendingActionsIcon color="warning" sx={{ fontSize: 40 }} />} /></Grid>
            <Grid item xs={12} md={4}><StatCard title="Total Approved (Month)" value="$85,000.00" icon={<CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />} /></Grid>
            <Grid item xs={12} md={4}><StatCard title="Avg. Approval Time" value="2.5 Days" icon={<PendingActionsIcon color="primary" sx={{ fontSize: 40 }} />} /></Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 3, height: 350 }}>
                    <Typography variant="h6" component="h2" gutterBottom>Company Spending Overview (Last 6 Months)</Typography>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={companySpendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            {/* USE THE THEME OBJECT TO ACCESS THE COLOR */}
                            <Line type="monotone" dataKey="spent" strokeWidth={3} stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
             <Grid item xs={12} md={6}>
                 <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" component="h2" gutterBottom>Admin Tools</Typography>
                     <List>
                        <ListItem button><ListItemIcon><PeopleAltIcon /></ListItemIcon><ListItemText primary="Manage Users" /></ListItem>
                        <ListItem button><ListItemIcon><RuleFolderIcon /></ListItemIcon><ListItemText primary="Configure Approval Rules" /></ListItem>
                        <ListItem button><ListItemIcon><AssessmentIcon /></ListItemIcon><ListItemText primary="View All Expenses Report" /></ListItem>
                     </List>
                 </Paper>
             </Grid>
             <Grid item xs={12} md={6}>
                 <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" component="h2" gutterBottom>Recent System Activity</Typography>
                     <List>
                        {recentSystemActivity.map((activity, index) => (<ListItem key={index} dense><ListItemText primary={`• ${activity}`} /></ListItem>))}
                     </List>
                 </Paper>
             </Grid>
        </Grid>
    </Box>
  );
};

// This is the main component that decides which view to render.
const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  const renderDashboardByRole = () => {
    if (!user) {
      return <Typography>Loading Dashboard...</Typography>;
    }
    
    switch (user.role) {
      case 'ADMIN':
        return <AdminView />;
      case 'MANAGER':
        return <ManagerView />;
      case 'EMPLOYEE':
      default:
        return <EmployeeView />;
    }
  };

  return (
    <Box>
      {renderDashboardByRole()}
    </Box>
  );
};

export default DashboardPage;