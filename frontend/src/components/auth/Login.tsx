import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import type { ApiError } from "../../types/api";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

// Login component
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError(""); // reset error

        try {
            await login(email, password);
            // Redirect to homepage
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Login error: ", err);
            const errorMsg = (err as ApiError).response?.data?.message || "Error";
            setError(errorMsg);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
            <Typography variant="h5" mb={2}>Login</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
            
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Login</Button>
        </Box>
    );
}
