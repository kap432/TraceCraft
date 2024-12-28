import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const LandingPage = () => {
  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Blockchain Product Storage
      </Typography>
      <Typography variant="body1" gutterBottom>
        Manage products securely and efficiently using blockchain technology.
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        mt={4}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/add-product"
          fullWidth
        >
          Add Product
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="large"
          component={Link}
          to="/get-product"
          fullWidth
        >
          Get Product
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/assign-courier"
          fullWidth
        >
          Assign as Courier
        </Button>

        {/* New Button for Viewing All Products */}
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          component={Link}
          to="/all-products"
          fullWidth
        >
          View All Products
        </Button>

        {/* New Button for Certificate Authority */}
        <Button
          variant="contained"
          color="success"
          size="large"
          component={Link}
          to="/certificate-authority"
          fullWidth
        >
          Certificate Authority
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
