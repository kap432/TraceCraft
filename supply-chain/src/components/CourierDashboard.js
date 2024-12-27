import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config/contractConfig"; // Ensure the correct path
import { useNavigate } from "react-router-dom"; // React Router for navigation

const CourierDashboard = () => {
  const [checkpointDetails, setCheckpointDetails] = useState({
    productId: "",
    location: "",
    checkInTime: Date.now(), // Set default to current timestamp
    checkOutTime: Date.now(), // Set default to current timestamp
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState(""); // Declare account state
  const navigate = useNavigate(); // Initialize react-router's navigate function

  // Handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckpointDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Convert datetime string to UNIX timestamp (in seconds)
  const convertToUnixTimestamp = (datetime) => {
    return Math.floor(new Date(datetime).getTime() / 1000);
  };

  // Add a checkpoint
  const handleAddCheckpoint = async () => {
    if (!contractInstance || !account) {
      setError(true);
      setMessage("Contract or account not available.");
      setSnackbarOpen(true);
      return;
    }

    if (!checkpointDetails.productId || !checkpointDetails.location) {
      setError(true);
      setMessage("Please provide product ID and location.");
      setSnackbarOpen(true);
      return;
    }

    // Convert check-in and check-out time to UNIX timestamps
    const checkInTimestamp = convertToUnixTimestamp(checkpointDetails.checkInTime);
    const checkOutTimestamp = convertToUnixTimestamp(checkpointDetails.checkOutTime);

    setLoading(true);
    try {
      await contractInstance.methods
        .addCheckpoint(
          checkpointDetails.productId,
          checkpointDetails.location,
          checkInTimestamp,
          checkOutTimestamp
        )
        .send({ from: account });

      setError(false);
      setMessage("Checkpoint added successfully.");
      setCheckpointDetails({ productId: "", location: "", checkInTime: Date.now(), checkOutTime: Date.now() });
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage("Error adding checkpoint. Please try again.");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Initialize Web3 and Contract
  useEffect(() => {
    if (window.ethereum) {
      const initializeWeb3 = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]); // Set the account after fetching
        }

        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContractInstance(contractInstance);
      };

      initializeWeb3();
    } else {
      console.log("MetaMask is not installed");
      setError(true);
      setMessage("Please install MetaMask to proceed.");
      setSnackbarOpen(true);
    }
  }, []);

  // Navigate to the assign courier page
  const handleAssignCourier = () => {
    navigate("/assign-courier");
  };

  // Navigate to the all products page
  const handleViewAllProducts = () => {
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
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAssignCourier}
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
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleViewAllProducts}
              >
                Go to All Products
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ textAlign: "center", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Delivery Checkpoint
              </Typography>
              <TextField
                label="Product ID"
                variant="outlined"
                name="productId"
                value={checkpointDetails.productId}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Location"
                variant="outlined"
                name="location"
                value={checkpointDetails.location}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Check-in Time"
                variant="outlined"
                name="checkInTime"
                value={checkpointDetails.checkInTime}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Check-out Time"
                variant="outlined"
                name="checkOutTime"
                value={checkpointDetails.checkOutTime}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCheckpoint}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Add Checkpoint"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourierDashboard;
