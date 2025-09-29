import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import type { ApiError } from "../types/api";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

// Registration component
export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState({first: "", second: ""});
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError(""); // reset error

        try {
            if (password.first !== password.second) {
                setError("Passwords do not match");
                return;
            }

            await register(email, password.first);
            // Redirect to homepage
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Registration error: ", err);
            const errorMsg = (err as ApiError).response?.data?.message || "Error";
            setError(errorMsg);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, backgroundColor: 'background.paper', padding: 3, borderRadius: 3, boxShadow: 4 }}>
            <Typography variant="h5" mb={2}>Register</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password.first} onChange={e => setPassword({first: e.target.value, second: password.second})} />
            <TextField fullWidth label="Password again" type="password" margin="normal" value={password.second} onChange={e => setPassword({first: password.first, second: e.target.value})} />
            
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Register</Button>
        </Box>
    );
}
