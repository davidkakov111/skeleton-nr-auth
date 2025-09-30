import { Box, CircularProgress } from "@mui/material";

// Full-page loading spinner
export function FullPageSpinner({ size = 60 }: { size?: number }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <CircularProgress size={size} />
        </Box>
    );
}
