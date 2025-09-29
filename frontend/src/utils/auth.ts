import type { PasswordValidationResult } from "../types/auth";

// Validate email format
export const validateEmail = (email: string): string | null => {
    if (email.length === 0) return "Email cannot be empty";
    
    // There is some text before the @ (no spaces, no @)
    // There is some text after the @ (the domain)
    // There is at least one . in the domain part
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase()) ? null : "Email is not valid";
};

// Validate password strength
export const validatePassword = (password: string): PasswordValidationResult => {
    return {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /\d/.test(password),
        specialChar: /[@$!%*?&]/.test(password),
    };
};

// Get list of password errors from validation result
export function getPasswordErrors(validation: PasswordValidationResult): string[] {
    const errors: string[] = [];
    if (!validation.minLength) errors.push("At least 8 characters");
    if (!validation.uppercase) errors.push("One uppercase letter");
    if (!validation.lowercase) errors.push("One lowercase letter");
    if (!validation.digit) errors.push("One digit");
    if (!validation.specialChar) errors.push("One special character");
    return errors;
}
