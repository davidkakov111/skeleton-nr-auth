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

// Registration component
export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
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
        if (password !== confPassword) return;

        try {
            await register(email, password);
            // Redirect to homepage
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Registration error: ", err);
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
            <Typography variant="h5" mb={2}>Register</Typography>
            
            {/* Email & password register */}
            {errors.other && <Alert severity="error" sx={{ mb: 2 }}>{errors.other}</Alert>}

            <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} 
                error={!!errors.email} helperText={errors.email}/>
            <PasswordField value={password} onChange={e => setPassword(e.target.value)} error={!!errors.password} helperText={
                errors.password ? getPasswordErrors(errors.password).join(", ") : ""
            }/>
            <PasswordField value={confPassword} onChange={e => setConfPassword(e.target.value)} 
                error={confPassword !== password} helperText={confPassword === password ? "" : "Passwords do not match"}/>

            <Button type="submit" variant="contained" fullWidth sx={{ my: 2 }}>Register</Button>

            {/* Social auth register */}
            <SocaialAuthButtons isLogin={false} />
        </Box>
    );
}
