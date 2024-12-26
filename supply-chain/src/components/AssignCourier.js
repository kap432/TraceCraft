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

const AssignCourier = () => {
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(""); // State to hold delivery status
  const scannerRef = useRef(null);
  const [scannerInstance, setScannerInstance] = useState(null);

  // Initialize Web3, ABI, and Contract Address
  const ABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "manufacturerName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "manufacturerDetails",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "longitude",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "latitude",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "category",
          type: "string",
        },
      ],
      name: "ProductAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "logisticsPartner",
          type: "address",
        },
      ],
      name: "ProductAssignedToCourier",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "customer",
          type: "address",
        },
      ],
      name: "ProductAssignedToCustomer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "certificateAuthority",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "certificateDocHash",
          type: "string",
        },
      ],
      name: "ProductCertified",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "productId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "deliveryStatus",
          type: "string",
        },
        {
          indexed: false,
          internalType: "address",
          name: "logisticsPartner",
          type: "address",
        },
      ],
      name: "ProductDelivered",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_price",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_manufacturerName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_manufacturerDetails",
          type: "string",
        },
        {
          internalType: "string",
          name: "_longitude",
          type: "string",
        },
        {
          internalType: "string",
          name: "_latitude",
          type: "string",
        },
        {
          internalType: "string",
          name: "_category",
          type: "string",
        },
      ],
      name: "addProduct",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_productId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_certificateAuthority",
          type: "string",
        },
        {
          internalType: "string",
          name: "_digitalSignature",
          type: "string",
        },
        {
          internalType: "string",
          name: "_certificateDocHash",
          type: "string",
        },
      ],
      name: "certifyProduct",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_productId",
          type: "uint256",
        },
      ],
      name: "assignCourier",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_productId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_deliveryStatus",
          type: "string",
        },
      ],
      name: "markAsDelivered",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_productId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_customer",
          type: "address",
        },
      ],
      name: "assignToCustomer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "getProduct",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "manufacturerName",
              type: "string",
            },
            {
              internalType: "string",
              name: "manufacturerDetails",
              type: "string",
            },
            {
              internalType: "string",
              name: "longitude",
              type: "string",
            },
            {
              internalType: "string",
              name: "latitude",
              type: "string",
            },
            {
              internalType: "string",
              name: "category",
              type: "string",
            },
            {
              internalType: "address",
              name: "manufacturer",
              type: "address",
            },
            {
              internalType: "address",
              name: "logisticsPartner",
              type: "address",
            },
            {
              internalType: "address",
              name: "customer",
              type: "address",
            },
            {
              internalType: "string",
              name: "deliveryStatus",
              type: "string",
            },
            {
              internalType: "string",
              name: "certificateAuthority",
              type: "string",
            },
            {
              internalType: "string",
              name: "digitalSignature",
              type: "string",
            },
            {
              internalType: "string",
              name: "certificateDocHash",
              type: "string",
            },
            {
              internalType: "bool",
              name: "isCertified",
              type: "bool",
            },
          ],
          internalType: "struct ProductNewTrack.Product",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [],
      name: "getAllProductIds",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
  ];
  const CONTRACT_ADDRESS = "0xBd3A728f5D49A9Bb1b9651f52e370056DE3b9c55"; // Replace with your deployed contract address
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  // Fetch user account
  const [account, setAccount] = useState("");

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[1]);
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
      // Call the contract method to assign the courier
      await contract.methods.assignCourier(productId).send({ from: account });
      setError(false);
      setMessage(
        `Product ${productId} has been assigned to you as the courier.`
      );
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
      console.log("Calling markAsDelivered with:", productId, deliveryStatus);
      await contract.methods
        .markAsDelivered(productId, deliveryStatus)
        .send({ from: account });

      setError(false);
      setMessage(
        `Product ${productId} has been marked as delivered with status: ${deliveryStatus}.`
      );
    } catch (err) {
      console.error("Error calling markAsDelivered:", err);
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
        console.log("QR Code scanned: ", decodedText);
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

        {/* Mark as Delivered Section */}
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
