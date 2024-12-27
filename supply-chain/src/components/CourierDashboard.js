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
  List,
  ListItem,
} from "@mui/material";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config/contractConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CourierDashboard = () => {
  const [checkpointDetails, setCheckpointDetails] = useState({
    productId: "",
    location: "",
    checkInTime: Date.now(),
    checkOutTime: Date.now(),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState("");
  const navigate = useNavigate();

  const GEOAPIFY_API_KEY = "e80037607d33427c84bb6d4007a1dabe"; // Replace with your Geoapify API key

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCheckpointDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (name === "location" && value) {
      fetchLocationSuggestions(value);
    }
  };

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${GEOAPIFY_API_KEY}`
      );
      setSuggestions(response.data.features || []);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleLocationSelect = (location) => {
    setCheckpointDetails((prevDetails) => ({
      ...prevDetails,
      location: location.properties.formatted,
    }));
    setSelectedLocation(location.properties.formatted);
    setSuggestions([]);
  };

  const convertToUnixTimestamp = (datetime) => {
    return Math.floor(new Date(datetime).getTime() / 1000);
  };

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
      setCheckpointDetails({
        productId: "",
        location: "",
        checkInTime: Date.now(),
        checkOutTime: Date.now(),
      });
      setSelectedLocation("");
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage("Error adding checkpoint. Please try again.");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      const initializeWeb3 = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
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

  const handleAssignCourier = () => {
    navigate("/assign-courier");
  };

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
              {suggestions.length > 0 && (
                <List>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      {suggestion.properties.formatted}
                    </ListItem>
                  ))}
                </List>
              )}
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
