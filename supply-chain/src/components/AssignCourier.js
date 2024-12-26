import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { contractAddress, contractABI } from "../config/contractConfig"; // Adjust the import path as needed

const AssignCourier = () => {
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const scannerRef = useRef(null);
  const [scannerInstance, setScannerInstance] = useState(null);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  // Fetch user account
  const [account, setAccount] = useState("");

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]); // Using the first account
    };
    loadAccount();
  }, []);

  const handleProductIdChange = (e) => {
    setProductId(e.target.value);
  };

  const handleAssignCourier = async () => {
    if (!productId) {
      setError(true);
      setMessage("Please enter a valid product ID.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      await contract.methods.assignCourier(productId).send({ from: account });
      setError(false);
      setMessage(`Product ${productId} has been assigned to you as the courier.`);
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage("Error assigning courier. Please try again.");
    }

    setLoading(false);
    setSnackbarOpen(true);
  };

  const handleMarkAsDelivered = async () => {
    if (!productId || !deliveryStatus) {
      setError(true);
      setMessage("Please enter a valid product ID and delivery status.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      await contract.methods
        .markAsDelivered(productId, deliveryStatus)
        .send({ from: account });

      setError(false);
      setMessage(
        `Product ${productId} has been marked as delivered with status: ${deliveryStatus}.`
      );
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage("Error marking product as delivered. Please try again.");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const startScanner = () => {
    if (scannerInstance) {
      console.warn("Scanner already running!");
      return;
    }

    if (!scannerRef.current) {
      console.error("Scanner element not found in DOM!");
      return;
    }

    const newScannerInstance = new Html5QrcodeScanner(scannerRef.current, {
      fps: 10,
      qrbox: 250,
    });

    newScannerInstance.render(
      (decodedText) => {
        setProductId(decodedText);
        newScannerInstance.clear();
        setScannerInstance(null);
        setIsScanning(false);
      },
      (error) => {
        console.error("QR Scan Error: ", error);
      }
    );
    setScannerInstance(newScannerInstance);
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scannerInstance) {
      scannerInstance.clear();
      setScannerInstance(null);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerInstance) {
        scannerInstance.clear();
        setScannerInstance(null);
      }
    };
  }, [scannerInstance]);

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Assign Product to Courier
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="body1" gutterBottom>
          <strong>Logistics Partner Address:</strong> {account}
        </Typography>

        <TextField
          label="Enter Product ID"
          variant="outlined"
          type="text"
          value={productId}
          onChange={handleProductIdChange}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignCourier}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Assign as Courier"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={isScanning ? stopScanner : startScanner}
          fullWidth
        >
          {isScanning ? "Stop Scanner" : "Scan QR Code"}
        </Button>

        <TextField
          label="Enter Delivery Status"
          variant="outlined"
          type="text"
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
          fullWidth
          style={{ marginTop: "20px" }}
        />

        <Button
          variant="contained"
          color="secondary"
          onClick={handleMarkAsDelivered}
          fullWidth
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Mark as Delivered"}
        </Button>
      </Box>

      {isScanning && (
        <div
          ref={scannerRef}
          style={{ marginTop: "20px", width: "100%", height: "auto" }}
        ></div>
      )}

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

export default AssignCourier;
