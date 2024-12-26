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

  // State for MetaMask connection
  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState(null); // Web3 instance
  const [contract, setContract] = useState(null); // Contract instance
  const [isConnected, setIsConnected] = useState(false);

  // Automatically fetch user's location
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
      console.error("Geolocation is not supported by this browser.");
      setLatitude("Unsupported");
      setLongitude("Unsupported");
    }
  }, []);

  // Initialize Web3 and connect to MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);

        // Initialize Web3 and contract
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Replace with your contract's address and ABI
        const contractAddress = "0xBd3A728f5D49A9Bb1b9651f52e370056DE3b9c55"; // Replace with actual contract address
        const contractABI = [
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
        ]; // Replace with actual contract ABI
        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(contractInstance);
      } catch (err) {
        console.error("MetaMask connection failed:", err);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  };

  // Add product to the blockchain
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

      console.log("Product added successfully");
      setQrCodeVisible(true); // Show the QR code
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Print the QR code
  const printQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const qrImage = canvas.toDataURL(); // Convert canvas to image
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
          {/* MetaMask connection button */}
          <Button
            variant="contained"
            color="primary"
            onClick={connectToMetaMask}
          >
            {isConnected ? "MetaMask Connected" : "Connect MetaMask"}
          </Button>

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
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                fullWidth
                value={latitude || "Fetching..."}
                InputProps={{
                  readOnly: true,
                }}
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
