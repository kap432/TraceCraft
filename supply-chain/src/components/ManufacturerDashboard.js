import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const ManufacturerDashboard = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleAllProducts = () => {
    navigate("/all-products");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome, Manufacturer!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          You are logged in as a Manufacturer. Manage your products and view all entries below.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ textAlign: "center", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Product
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create and add a new product to the blockchain-enabled supply chain.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={handleAddProduct}
                variant="contained"
                color="primary"
                fullWidth
              >
                Go to Add Product
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ textAlign: "center", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                View All Products
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Browse all the products you have added to the system.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={handleAllProducts}
                variant="contained"
                color="secondary"
                fullWidth
              >
                Go to All Products
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManufacturerDashboard;
