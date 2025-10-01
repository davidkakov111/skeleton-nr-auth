import { useCallback, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import type { ApiError } from "../types/api";
import { useAuth } from "../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { getPasswordErrors, validateEmail, validatePassword } from "../utils/auth";
import { useDebounceEffect } from "../utils/debounce";
import type { PasswordValidationResult } from "../types/auth";
import PasswordField from "../components/form/PasswordField";
import SocaialAuthButtons from "../components/form/SocialAuthButtons";

// Login component
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{
        other: string; 
        email: string;
        password: PasswordValidationResult | null; 
    }>({
        other: "",
        email: "",
        password: null,
    });

    // Debounce validate email
    const validateEmailDebounced = useCallback(() => {
        const emailError = validateEmail(email);
        setErrors(prev => ({ ...prev, email: emailError && email.length ? emailError : '' }));
    }, [email]);
    useDebounceEffect(email, validateEmailDebounced);

    // Debounce validate password
    const validatePasswordDebounced = useCallback(() => {
        setErrors(prev => ({...prev, password: password.length ? validatePassword(password) : null}));
    }, [password]);
    useDebounceEffect(password, validatePasswordDebounced);

    // Handle form submission
    const handleSubmit = async () => {
        setErrors(prev => ({...prev, other: ''}));  // reset other error

        // Validate email
        const emailError = validateEmail(email);
        if (emailError) {setErrors(prev => ({...prev, email: emailError})); return;}
        
        // Validate passwords
        const passValidation = validatePassword(password);
        if (!passValidation.digit
            || !passValidation.lowercase
            || !passValidation.minLength
            || !passValidation.specialChar
            || !passValidation.uppercase    
        ) {setErrors(prev => ({...prev, password: passValidation})); return;};    
        
        try {
            await login(email, password);
            // Redirect to homepage
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Login error: ", err);
            const errorMsg = (err as ApiError).response?.data?.message || "Error";
            setErrors(prev => ({...prev, other: errorMsg}));
        }
    };

    return (
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            sx={{ maxWidth: 400, mx: "auto", mt: 10, backgroundColor: 'background.paper', padding: 3, borderRadius: 3, boxShadow: 4 }}
        >
            <Typography variant="h5" mb={2}>Login</Typography>

            {/* Email & password login */}
            {errors.other && <Alert severity="error" sx={{ mb: 2 }}>{errors.other}</Alert>}

            <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)}
                error={!!errors.email} helperText={errors.email} autoComplete="email"/>
            <PasswordField value={password} onChange={e => setPassword(e.target.value)} error={!!errors.password} helperText={
                errors.password ? getPasswordErrors(errors.password).join(", ") : ""
            }/>
            
            <Button type="submit" variant="contained" fullWidth sx={{ my: 2 }}>Login</Button>

            {/* Social auth login */}
            <SocaialAuthButtons isLogin={true} />
        </Box>
    );
}
