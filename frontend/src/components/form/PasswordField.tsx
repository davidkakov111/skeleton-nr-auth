import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Custom password field component
export default function PasswordField({
  value,
  onChange,
  error,
  helperText,
  label = "Password",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      label={label}
      type={showPassword ? "text" : "password"}
      margin="normal"
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      autoComplete="current-password"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
