import GoogleIcon from "@mui/icons-material/Google";
import { BACKEND_API_URL } from "../../api/axios";
import { Button, Box, Typography } from "@mui/material";

// Social auth buttons section in auth forms
export default function SocaialAuthButtons({ isLogin }: { isLogin: boolean }) {
  return (
    <>
      {/* Divider before social auth buttons */}
      <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1, height: 2, bgcolor: "grey.300" }} />
        <Typography sx={{ mx: 2, color: "text.secondary" }}>or</Typography>
        <Box sx={{ flex: 1, height: 2, bgcolor: "grey.300" }} />
      </Box>

      {/* Social auth buttons */}
      <Button
        variant="contained"
        color="inherit"
        startIcon={<GoogleIcon />}
        onClick={() => {
          window.location.href = `${BACKEND_API_URL}/auth/google`;
        }}
        sx={{ my: 2, width: "100%" }}
      >
        {isLogin ? "Login" : "Register"} with Google
      </Button>
    </>
  );
}
