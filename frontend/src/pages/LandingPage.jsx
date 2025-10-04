import React, { useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  Divider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Icons
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";

const COLORS = {
  primary: "#333333",
  secondary: "#6c757d",
  lightGray: "#f4f6f8",
  background: "#ffffff",
};

const LandingPage = () => {
  const navigate = useNavigate();
  const aboutUsRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const features = [
    {
      icon: <BarChartIcon sx={{ color: COLORS.primary }} />,
      title: "Effortless Expense Tracking",
      description:
        "Capture and manage expenses in real time. Attach receipts and get AI-based categorization instantly.",
    },
    {
      icon: <DescriptionIcon sx={{ color: COLORS.primary }} />,
      title: "Automated Reports",
      description:
        "Generate insightful analytics and detailed PDF reports with one click.",
    },
    {
      icon: <PublicIcon sx={{ color: COLORS.primary }} />,
      title: "Global Currency Support",
      description:
        "Travel with ease — expenses auto-convert using the latest forex rates.",
    },
    {
      icon: <PhoneAndroidIcon sx={{ color: COLORS.primary }} />,
      title: "Mobile Friendly",
      description:
        "Fully optimized for mobile and tablets with smooth navigation.",
    },
    {
      icon: <SecurityIcon sx={{ color: COLORS.primary }} />,
      title: "Secure & Private",
      description:
        "We use 256-bit encryption and secure JWT authentication for your data.",
    },
    {
      icon: <GroupIcon sx={{ color: COLORS.primary }} />,
      title: "Team Collaboration",
      description:
        "Work together with approvals, roles, and transparent workflows.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Finance Manager",
      text: "Expense Tracker completely transformed how we handle financial workflows — intuitive, fast, and reliable.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Sales Executive",
      text: "Multi-currency support is a blessing for our global team. I can report expenses from anywhere.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Emily Johnson",
      role: "Startup Founder",
      text: "The design is clean, modern, and incredibly user-friendly. I recommend it to every entrepreneur.",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: COLORS.background,
        color: COLORS.primary,
        fontFamily: "Helvetica, sans-serif",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ReceiptLongIcon sx={{ color: COLORS.primary }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Expense Tracker
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {[
                { label: "About", ref: aboutUsRef },
                { label: "Features", ref: featuresRef },
                { label: "Testimonials", ref: testimonialsRef },
                { label: "Contact", ref: contactRef },
              ].map((item, i) => (
                <Button
                  key={i}
                  onClick={() => scrollToSection(item.ref)}
                  sx={{
                    color: COLORS.secondary,
                    textTransform: "none",
                    "&:hover": { color: COLORS.primary },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="text"
                sx={{ color: COLORS.primary, fontWeight: 600 }}
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: COLORS.primary,
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#000000" },
                }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: 1 }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}
            >
              Simplify. Organize.{" "}
              <Typography component="span" sx={{ color: COLORS.primary }}>
                Expense Smarter.
              </Typography>
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: COLORS.secondary, mb: 4, maxWidth: 500 }}
            >
              Track, analyze, and optimize your spending with our smart expense
              platform. Built for teams, travelers, and creators.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: COLORS.primary,
                  "&:hover": { bgcolor: "#000000" },
                  textTransform: "none",
                }}
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  textTransform: "none",
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            style={{ flex: 1 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Expenses
              </Typography>
              {[
                {
                  text: "Client Dinner",
                  subtext: "Today • 7:30 PM",
                  amount: "$86.40",
                  icon: <RestaurantIcon sx={{ color: COLORS.primary }} />,
                },
                {
                  text: "Uber Ride",
                  subtext: "Yesterday • 9:15 PM",
                  amount: "$12.25",
                  icon: <TimeToLeaveIcon sx={{ color: COLORS.secondary }} />,
                },
                {
                  text: "Office Supplies",
                  subtext: "Jan 20 • 2:00 PM",
                  amount: "$59.99",
                  icon: <StorefrontIcon sx={{ color: COLORS.primary }} />,
                },
              ].map((e, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    borderBottom: i < 2 ? "1px solid #eee" : "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#f5f5f5" }}>{e.icon}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>{e.text}</Typography>
                      <Typography variant="body2" color={COLORS.secondary}>
                        {e.subtext}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 700 }}>{e.amount}</Typography>
                </Box>
              ))}
            </Paper>
          </motion.div>
        </Box>
      </Container>

      {/* ABOUT SECTION - creative hero-like */}
      <Box ref={aboutUsRef} sx={{ bgcolor: COLORS.lightGray, py: 12 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "row" },
              alignItems: "center",
              gap: 8,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ flex: 1 }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                About{" "}
                <span style={{ color: COLORS.primary }}>Expense Tracker</span>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: COLORS.secondary,
                  lineHeight: 1.8,
                  mb: 3,
                  maxWidth: 500,
                }}
              >
                We’re on a mission to make financial management simple and
                transparent. Expense Tracker combines automation, design, and
                analytics to empower individuals and businesses to spend
                smarter.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: COLORS.primary,
                  "&:hover": { bgcolor: "#000000" },
                  textTransform: "none",
                }}
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ flex: 1 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, #fff, #f7f7f7)`,
                }}
              >
                <img
                  src="https://cdn.dribbble.com/userupload/7661804/file/original-22708b8c57935dbdc1457baf04dc46e9.png?resize=1200x900"
                  alt="About Illustration"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
              </Paper>
            </motion.div>
          </Box>
        </Container>
      </Box>
      <Box ref={featuresRef} sx={{ bgcolor: COLORS.lightGray, py: 12 }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Powerful Features Designed For You
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: COLORS.secondary, mb: 8, maxWidth: 600, mx: "auto" }}
          >
            Everything you need to simplify expense management and improve
            efficiency.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 4,
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "left",
                    height: "100%",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#fff",
                      border: `1px solid ${COLORS.primary}`,
                      mb: 2,
                      width: 54,
                      height: 54,
                    }}
                  >
                    {f.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.secondary }}>
                    {f.description}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>
      {/* TESTIMONIALS */}
      <Box ref={testimonialsRef} sx={{ bgcolor: "#fff", py: 12 }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 6 }}>
            What Our Users Say
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 4,
            }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.05)",
                    minHeight: 260,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={t.avatar}
                    sx={{
                      width: 70,
                      height: 70,
                      mb: 3,
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                  <Typography
                    sx={{
                      mb: 3,
                      fontStyle: "italic",
                      color: COLORS.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    “{t.text}”
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t.name}
                  </Typography>
                  <Typography variant="body2" color={COLORS.secondary}>
                    {t.role}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CONTACT SECTION */}
      <Box ref={contactRef} sx={{ bgcolor: COLORS.lightGray, py: 12 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Get in Touch
          </Typography>
          <Divider
            sx={{
              width: 80,
              height: 3,
              bgcolor: COLORS.primary,
              mx: "auto",
              mb: 6,
              borderRadius: 2,
            }}
          />
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField label="Name" variant="outlined" fullWidth required />
            <TextField label="Email" variant="outlined" fullWidth required />
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: COLORS.primary,
                "&:hover": { bgcolor: "#000000" },
                textTransform: "none",
              }}
            >
              Send Message
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          textAlign: "center",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
          color: "#fff",
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Ready to Take Control of Your Expenses?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: COLORS.primary,
              textTransform: "none",
              fontWeight: 600,
              px: 5,
              py: 1.5,
              "&:hover": { bgcolor: "#f2f2f2" },
            }}
            onClick={() => navigate("/signup")}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
