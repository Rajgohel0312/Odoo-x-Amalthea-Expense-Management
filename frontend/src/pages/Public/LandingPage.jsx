import React from 'react';
import { Box, Container, Typography, Button, Paper, Avatar, Divider } from '@mui/material'; // Removed Grid, List, ListItem, ListItemText, ListItemAvatar
import { useNavigate } from 'react-router-dom';

// Icons for Header and Hero Section (still needed)
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Feature Icons from the new design (still needed)
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PublicIcon from '@mui/icons-material/Public';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';


const LandingPage = () => {
  const navigate = useNavigate();

  // Re-introducing the mock recent expenses as they were part of your Hero section
  const recentExpenses = [
    { id: 1, text: "Business Lunch", subtext: "Today, 12:30 PM", amount: "$42.50", icon: <RestaurantIcon color="primary" />, bgColor: '#e3f2fd' },
    { id: 2, text: "Taxi Fare", subtext: "Yesterday, 6:15 PM", amount: "$18.75", icon: <TimeToLeaveIcon sx={{ color: '#673ab7' }} />, bgColor: '#ede7f6' },
    { id: 3, text: "Office Supplies", subtext: "Dec 15, 2:45 PM", amount: "$127.99", icon: <StorefrontIcon sx={{ color: '#ff9800' }} />, bgColor: '#fff3e0' },
  ];

  // Data for feature cards
  const features = [
    {
      icon: <BarChartIcon sx={{ color: '#2962ff' }}/>,
      title: 'Effortless Expense Tracking',
      description: 'Capture expenses instantly with our intuitive interface. Upload receipts, categorize spending, and track everything in real-time.',
    },
    {
      icon: <DescriptionIcon sx={{ color: '#00a152' }} />,
      title: 'Automated Reporting',
      description: 'Generate comprehensive reports automatically. Export to PDF or Excel with detailed breakdowns and analytics.',
    },
    {
      icon: <PublicIcon sx={{ color: '#0091ea' }}/>,
      title: 'Multi-Currency Support',
      description: 'Handle expenses in any currency with automatic conversion rates. Perfect for international business and travel.',
    },
    {
      icon: <PhoneAndroidIcon sx={{ color: '#6200ea' }} />,
      title: 'Mobile Ready',
      description: 'Access your expenses anywhere with our responsive design. Optimized for all devices and screen sizes.',
    },
    {
      icon: <SecurityIcon sx={{ color: '#d32f2f' }} />,
      title: 'Secure & Private',
      description: 'Your financial data is protected with bank-level security. We never share your information with third parties.',
    },
    {
      icon: <GroupIcon sx={{ color: '#f9a825' }} />,
      title: 'Team Collaboration',
      description: 'Share expenses with team members, set approval workflows, and manage company-wide expense policies.',
    },
  ];

  return (
    <Box sx={{ backgroundColor: 'white', color: 'text.primary' }}>
      {/* --- Header --- */}
      <Container maxWidth="lg">
        <Box component="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Expense Tracker
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            <Button color="inherit">Features</Button>
            <Button color="inherit">Pricing</Button>
            <Button color="inherit">About Us</Button>
            <Button color="inherit">Contact</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="text" color="primary" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>

      {/* --- Hero Section --- */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Simplify Your Expenses.
              <br />
              <Typography variant="h2" component="span" color="primary" sx={{ fontWeight: 800 }}>
                Maximize Your Time.
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
              Take control of your financial management with our intuitive expense tracking platform. Automated reporting, multi-currency support, and seamless integration make expense management effortless.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" onClick={() => navigate('/signup')}>
                Get Started Free
              </Button>
              <Button variant="outlined" size="large">
                Watch Demo
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '500px' } }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4, position: 'relative' }}>
              <CheckCircleIcon color="success" sx={{ position: 'absolute', top: 16, right: 16 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Expenses
              </Typography>
              {/* Using a simple Box with flex for ListItems for consistency */}
              <Box>
                {recentExpenses.map((expense) => (
                  <Box key={expense.id} sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                    <Avatar sx={{ bgcolor: expense.bgColor, mr: 2 }}>{expense.icon}</Avatar>
                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                      <Typography primary={expense.text} sx={{ fontWeight: 'medium' }}>{expense.text}</Typography>
                      <Typography secondary={expense.subtext} color="text.secondary" variant="body2">{expense.subtext}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{expense.amount}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
      
      {/* --- UPDATED Key Features Section with Flexbox --- */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Powerful Features Designed For You</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
                Everything you need to manage expenses efficiently and stay on top of your finances.
            </Typography>
            {/* Flex container for the feature cards */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', // Center items on smaller screens if they don't fill a row
                gap: 4 // Space between cards
              }}
            >
                {features.map((feature, index) => (
                    <Paper 
                      key={index}
                      sx={{
                        p: 4, 
                        flex: '1 1 calc(33.33% - 32px)', // 3 cards per row (100%/3 - gap). Adjust gap based on desired spacing
                        maxWidth: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.33% - 32px)' }, // Responsive widths
                        minWidth: '280px', // Minimum width for cards before wrapping
                        textAlign: 'left', 
                        borderRadius: 3, 
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
                      }} 
                      elevation={1}
                    >
                        <Avatar sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', mb: 2 }}>{feature.icon}</Avatar>
                        <Typography variant="h6" sx={{fontWeight: 600, mb: 1}}>{feature.title}</Typography>
                        <Typography color="text.secondary">{feature.description}</Typography>
                    </Paper>
                ))}
            </Box>
        </Container>
      </Box>

      {/* --- What Our Users Say Section --- */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 6 }}>What Our Users Say</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
              <Paper sx={{p:4, borderRadius: 3, flex: '1 1 calc(50% - 32px)', maxWidth: { xs: '100%', md: 'calc(50% - 32px)' } }} variant="outlined">
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }} />
                  <Typography sx={{mb: 2}}>“Expense Tracker has completely transformed how we handle company expenses. The automation alone saves us hours every month, and the interface is incredibly intuitive.”</Typography>
                  <Typography variant="h6" sx={{fontWeight: 600}}>Sarah Chen</Typography>
                  <Typography color="text.secondary">Finance Manager</Typography>
              </Paper>
              <Paper sx={{p:4, borderRadius: 3, flex: '1 1 calc(50% - 32px)', maxWidth: { xs: '100%', md: 'calc(50% - 32px)' } }} variant="outlined">
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }} />
                  <Typography sx={{mb: 2}}>“As someone who travels frequently for business, the multi-currency support is a game-changer. I can file expenses from any country without worrying about conversions.”</Typography>
                  <Typography variant="h6" sx={{fontWeight: 600}}>Michael Rodriguez</Typography>
                  <Typography color="text.secondary">Sales Executive</Typography>
              </Paper>
          </Box>
      </Container>

      {/* --- Footer CTA & Footer --- */}
      <Box sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white', py: 8 }}>
          <Container maxWidth="md">
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Ready to Take Control of Your Expenses?</Typography>
              <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' }, px: 5, py: 1.5, mt: 2 }} onClick={() => navigate('/signup')}>
                  Get Started Free
              </Button>
          </Container>
      </Box>
      <Box component="footer" sx={{ bgcolor: '#0A2540', color: '#a9b3c6', py: 3 }}>
          <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">© 2025 Amalthea Expense Tracker. All Rights Reserved.</Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                      <Button color="inherit" size="small">Privacy Policy</Button>
                      <Button color="inherit" size="small">Terms of Service</Button>
                  </Box>
              </Box>
          </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;