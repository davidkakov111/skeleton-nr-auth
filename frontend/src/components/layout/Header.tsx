import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import Container from "@mui/material/Container";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";

// Header component with navigation links
export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Handle logout action
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Unexpected error occurred during logout: ", error);
        }
    };

    return (
        <AppBar position="static" color="default">
            <Container maxWidth="xl" disableGutters sx={{ p: "5px" }}>
                <Toolbar>
                    {/* Left side logo / brand */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <HomeIcon />
                        SkeletonApp
                    </Typography>

                    {/* Right side navigation */}
                    <Box>
                        {user ? (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/dashboard"
                                    color="inherit"
                                    startIcon={<DashboardIcon />}
                                    sx={{ mr: 2 }}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    color="inherit"
                                    startIcon={<LogoutIcon />}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    color="inherit"
                                    startIcon={<LoginIcon />}
                                    sx={{ mr: 2 }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    color="inherit"
                                    startIcon={<PersonAddIcon />}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </ Container>
        </AppBar>
    );
}
