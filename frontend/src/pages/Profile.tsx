import { useCallback, useState } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useAuth } from "../context/auth/useAuth";
import PasswordField from "../components/form/PasswordField";
import type { PasswordValidationResult } from "../types/auth";
import {
  getPasswordErrors,
  validateEmail,
  validatePassword,
} from "../utils/auth";
import { useDebounceEffect } from "../utils/debounce";
import { updateUserEmail, updateUserPassword } from "../api/user";
import type { ApiError } from "../types/api";
import { useSnackbar } from "notistack";

// Profile page to update email and password
export default function Profile() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, refreshStatus } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<{
    email: string;
    currentPassword: PasswordValidationResult | null;
    newPassword: PasswordValidationResult | null;
  }>({
    email: "",
    currentPassword: null,
    newPassword: null,
  });

  // Debounce validate email
  const validateEmailDebounced = useCallback(() => {
    const emailError = validateEmail(email);
    setErrors((prev) => ({
      ...prev,
      email: emailError && email.length ? emailError : "",
    }));
  }, [email]);
  useDebounceEffect(email, validateEmailDebounced);

  // Debounce validate current password
  const validateCurrentPasswordDebounced = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      currentPassword: currentPassword.length
        ? validatePassword(currentPassword)
        : null,
    }));
  }, [currentPassword]);
  useDebounceEffect(currentPassword, validateCurrentPasswordDebounced);

  // Debounce validate new password
  const validateNewPasswordDebounced = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      newPassword: newPassword.length ? validatePassword(newPassword) : null,
    }));
  }, [newPassword]);
  useDebounceEffect(newPassword, validateNewPasswordDebounced);

  // Validate and update email
  const updateEmail = async (newEmail: string) => {
    // Validate email
    const emailError = validateEmail(newEmail);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    // Update email
    try {
      await updateUserEmail(email);
      await refreshStatus();
      enqueueSnackbar("Email updated successfully", { variant: "success" });
    } catch (err) {
      console.error("Email update error: ", err);
      const errorMsg = (err as ApiError).response?.data?.message || "Error";
      enqueueSnackbar(errorMsg, { variant: "error", autoHideDuration: 10000 });
    }
  };

  // Validate passwords and update password
  const updatePassword = async (current: string, next: string) => {
    // Validate passwords
    const currentPassValidation = validatePassword(current);
    if (getPasswordErrors(currentPassValidation).length > 0) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: currentPassValidation,
      }));
      return;
    }
    const nextPassValidation = validatePassword(next);
    if (getPasswordErrors(nextPassValidation).length > 0) {
      setErrors((prev) => ({ ...prev, newPassword: nextPassValidation }));
      return;
    }

    // Update password
    try {
      await updateUserPassword(next, current);
      setCurrentPassword("");
      setNewPassword("");
      enqueueSnackbar("Password updated successfully", { variant: "success" });
    } catch (err) {
      console.error("Password update error: ", err);
      const errorMsg = (err as ApiError).response?.data?.message || "Error";
      enqueueSnackbar(errorMsg, { variant: "error", autoHideDuration: 10000 });
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {/* Display user details */}
      <Box mb={3}>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email || "-"}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {user?.role || "-"}
        </Typography>
        <Typography variant="body1">
          <strong>Registered:</strong>{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "-"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Update email */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Update Email
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateEmail(email);
          }}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="email"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
          >
            Update Email
          </Button>
        </form>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Update password */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Update Password
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatePassword(currentPassword, newPassword);
          }}
        >
          {/* Hidden email for accessibility/autofill */}
          <input
            type="email"
            name="username"
            value={user?.email || ""}
            readOnly
            hidden
            autoComplete="username"
          />

          <PasswordField
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={
              errors.currentPassword
                ? getPasswordErrors(errors.currentPassword).length > 0
                : false
            }
            helperText={
              errors.currentPassword
                ? getPasswordErrors(errors.currentPassword).join(", ")
                : ""
            }
            label="Current Password"
          />
          <PasswordField
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={
              errors.newPassword
                ? getPasswordErrors(errors.newPassword).length > 0
                : false
            }
            helperText={
              errors.newPassword
                ? getPasswordErrors(errors.newPassword).join(", ")
                : ""
            }
            label="New Password"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
          >
            Update Password
          </Button>
        </form>
      </Box>
    </Box>
  );
}
