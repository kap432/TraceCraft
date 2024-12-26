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

const CourierDashboard = () => {
  const navigate = useNavigate();

  const handleAssignCourier = () => {
    navigate("/assign-courier");
  };

  const handleAllProducts = () => {
    navigate("/all-products");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome, Courier!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          You are logged in as a Courier. Manage your assignments and view product details below.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ textAlign: "center", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Assign Courier
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Assign yourself to transport and deliver specific products.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={handleAssignCourier}
                variant="contained"
                color="primary"
                fullWidth
              >
                Go to Assign Courier
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
                Browse all products and monitor delivery details.
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

export default CourierDashboard;
