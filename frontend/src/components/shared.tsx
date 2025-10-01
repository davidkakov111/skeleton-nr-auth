import { Box, CircularProgress } from "@mui/material";

// Full-page loading spinner
export function FullPageSpinner({ size = 60, vhHeight = 100 }: { size?: number, vhHeight?: number }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: `${vhHeight}vh`,
            }}
        >
            <CircularProgress size={size} />
        </Box>
    );
}
