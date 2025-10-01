import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

// 404 Not Found component
export default function NotFound() {
  return (
    <Container sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, the page you are looking for doesn’t exist.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Go Home
      </Button>
    </Container>
  );
}
