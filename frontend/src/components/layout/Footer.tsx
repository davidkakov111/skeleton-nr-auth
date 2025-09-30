import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";

// Footer component
export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                mt: "auto",
                textAlign: "center",
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            <Container maxWidth="xl" disableGutters sx={{ p: "5px" }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} SkeletonApp. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
