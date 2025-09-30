import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/router/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/router/scroller";

// Main application component with routing and layout
export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: 'background.default',
        color: 'text.primary',
      }}>
        <ScrollToTop />
        <Header />
        
        <Container maxWidth="xl" disableGutters sx={{ p: "5px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
