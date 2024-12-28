import React, { useState, useRef, useEffect } from "react";
import Web3 from "web3";
import { QRCodeCanvas } from "qrcode.react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { contractAddress, contractABI } from "../config/contractConfig";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AddProduct = () => {
  const [productId, setProductId] = useState(1);
  const [productName, setProductName] = useState("Laptop");
  const [productPrice, setProductPrice] = useState(500);
  const [manufacturerName, setManufacturerName] = useState("ABC Corp");
  const [manufacturerDetails, setManufacturerDetails] = useState(
    "Leading Electronics Manufacturer"
  );
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [productCategory, setProductCategory] = useState("Electronics");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const qrCodeRef = useRef(null);

  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLatitude("Unavailable");
          setLongitude("Unavailable");
        }
      );
    } else {
      setLatitude("Unsupported");
      setLongitude("Unsupported");
    }
  }, []);

  useEffect(() => {
    const autoConnectMetaMask = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setIsConnected(true);

          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(contractInstance);

          // Fetch the user's wallet address from Firestore
          const user = auth.currentUser;
          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setWalletAddress(userDoc.data().walletAddress);
            } else {
              console.error("User document not found in Firestore.");
            }
          } else {
            console.error("No authenticated user found.");
          }
        } catch (err) {
          console.error("MetaMask connection failed:", err);
        }
      } else {
        console.log("MetaMask is not installed.");
      }
    };

    autoConnectMetaMask();
  }, []);

  const addProduct = async () => {
    if (!web3 || !contract || !walletAddress) {
      console.error("Web3, contract, or walletAddress is not available.");
      return;
    }

    try {
      await contract.methods
        .addProduct(
          productId,
          productName,
          productPrice,
          manufacturerName,
          manufacturerDetails,
          longitude,
          latitude,
          productCategory
        )
        .send({ from: walletAddress });

      setError(false);
      setMessage(`Product with ID ${productId} added successfully.`);
      setQrCodeVisible(true);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(true);
      setMessage("Product ID already exists. Please use a different ID.");
    }
  };

  const printQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const qrImage = canvas.toDataURL();
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code</title>
            </head>
            <body style="display: flex; justify-content: center; align-items: center; height: 100vh;">
              <img src="${qrImage}" alt="QR Code" style="max-width: 100%; height: auto;" />
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add a Product
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product ID"
                type="number"
                fullWidth
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Product Price"
                type="number"
                fullWidth
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Manufacturer Name"
                fullWidth
                value={manufacturerName}
                onChange={(e) => setManufacturerName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Manufacturer Details"
                fullWidth
                value={manufacturerDetails}
                onChange={(e) => setManufacturerDetails(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Longitude"
                fullWidth
                value={longitude || "Fetching..."}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                fullWidth
                value={latitude || "Fetching..."}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Product Category"
                fullWidth
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={addProduct}
              fullWidth
              disabled={!longitude || !latitude || !isConnected}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {message && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle1"
              color={error ? "error" : "primary"}
              align="center"
            >
              {message}
            </Typography>
          </Box>
        )}

        {qrCodeVisible && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              QR Code for Product ID: {productId}
            </Typography>
            <div
              ref={qrCodeRef}
              style={{ display: "inline-block", marginBottom: "20px" }}
            >
              <QRCodeCanvas value={`${productId}`} size={200} />
            </div>
            <Button
              variant="outlined"
              color="secondary"
              onClick={printQRCode}
              sx={{ mt: 2 }}
            >
              Print QR Code
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AddProduct;