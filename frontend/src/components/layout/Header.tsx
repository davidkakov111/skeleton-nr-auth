import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slide,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useColorScheme } from "@mui/material/styles";

const sections: {
  label: string;
  to: string;
  onlyAuthenticated: boolean;
  roles?: string[];
}[] = [
  { label: "Dashboard", to: "/dashboard", onlyAuthenticated: true },
  { label: "Admin", to: "/admin", onlyAuthenticated: true, roles: ["admin"] },
];

// Header component with navigation links
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prevScroll = useRef(0);
  const largeWidth = useMediaQuery("(min-width:600px)");

  // Handle scroll to show/hide navbar
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll < prevScroll.current || currentScroll < 100) {
      // scrolling up or near top
      setVisible(true);
    } else {
      // scrolling down
      setVisible(false);
    }
    prevScroll.current = currentScroll;
  };

  // Attach scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Unexpected error occurred during logout: ", error);
    }
  };

  // Unprotected sections for this user
  const displaySections = sections.filter((s) => {
    // if not authenticated-only, show
    if (!s.onlyAuthenticated) return true;

    // if user is logged in
    if (s.onlyAuthenticated && user) {
      // if no role restriction, show
      if (!s?.roles) return true;

      // check if user role is allowed
      return s.roles.includes(user.role);
    }

    return false; // otherwise hide
  });

  // Color scheme for theme toggle
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;

  return (
    <Slide in={visible} direction="down">
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="xl" disableGutters sx={{ p: "5px" }}>
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* Left section */}
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              {/* On small screens, show menu icon */}
              {!largeWidth && displaySections.length > 0 && (
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}

              {/* Logo */}
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Avatar
                  src="/react.svg"
                  alt="Logo"
                  sx={{ width: 45, height: 40, mx: 1, borderRadius: 0 }}
                />
                {largeWidth && (
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    SkeletonApp
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Right section */}
            <Box>
              {/* On large screens, show buttons directly */}
              {largeWidth &&
                displaySections.map((s) => (
                  <Button
                    key={s.label}
                    component={RouterLink}
                    to={s.to}
                    color="inherit"
                    sx={{ mr: 2 }}
                  >
                    {s.label}
                  </Button>
                ))}

              {/* Auth buttons */}
              {user ? (
                <Button
                  onClick={handleLogout}
                  color="inherit"
                  startIcon={largeWidth ? <LogoutIcon /> : <></>}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    startIcon={largeWidth ? <LoginIcon /> : <></>}
                    sx={{ mr: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    color="inherit"
                    startIcon={largeWidth ? <PersonAddIcon /> : <></>}
                  >
                    Register
                  </Button>
                </>
              )}

              {/* Theme toggle */}
              <IconButton
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
              >
                {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Drawer for mobile */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: 250,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {/* Close button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Nav items */}
            <List sx={{ width: 200 }}>
              {displaySections.map((s) => (
                <ListItem key={s.label} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={s.to}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary={s.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </Slide>
  );
}
