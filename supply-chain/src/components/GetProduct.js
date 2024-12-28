import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { contractABI, contractAddress } from "../config/contractConfig";

const GetProduct = () => {
  const [productId, setProductId] = useState(1);
  const [product, setProduct] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]); // Checkpoints with coordinates
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);

  // Initialize Web3 and contract
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    initializeWeb3();
  }, []);

  // Fetch product details and checkpoints
  const getProduct = async () => {
    if (!contract) {
      console.error("Contract not initialized.");
      return;
    }

    setLoading(true);

    try {
      // Fetch product details
      const productDetails = await contract.methods.getProduct(productId).call();
      setProduct(productDetails);

      // Extract and format checkpoints
      const productCheckpoints = productDetails.checkpoints || [];
      const formattedCheckpoints = productCheckpoints.map((checkpoint) => ({
        location: checkpoint.location,
        latitude: parseFloat(checkpoint.latitude),
        longitude: parseFloat(checkpoint.longitude),
      }));
      setCheckpoints(formattedCheckpoints);
    } catch (error) {
      console.error("Error retrieving product:", error);
    }

    setLoading(false);
  };

  // Start QR code scanner
  const startScan = () => {
    const readerElement = document.getElementById("reader");
    if (!readerElement) {
      console.error("Scanner element not found in DOM!");
      return;
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        setProductId(decodedText); // Set product ID from the QR code
        getProduct(); // Fetch product details
        html5QrcodeScanner.clear(); // Stop scanner after successful scan
        setIsScanning(false);
      },
      (error) => {
        console.error("QR Scan Error: ", error);
      }
    );

    setIsScanning(true);
  };

  // Set marker icon for Leaflet
  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Get Product Details
      </Typography>

      {/* Input and Button Controls */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <TextField
          label="Enter Product ID"
          variant="outlined"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={getProduct}
          disabled={loading}
        >
          Get Product
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={startScan}
          style={{ marginLeft: "10px" }}
        >
          {isScanning ? "Stop Scanner" : "Scan QR Code"}
        </Button>
      </Box>

      {/* QR Code Scanner */}
      {isScanning && <div id="reader" style={{ marginTop: "20px" }}></div>}
      {!isScanning && <div id="reader" style={{ display: "none" }}></div>}

      {/* Loading Indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {/* Display Product Details */}
      {product && (
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Product Details:
            </Typography>
            <Divider style={{ marginBottom: "15px" }} />
            <Typography>Product ID: {product[0]}</Typography>
            <Typography>Product Name: {product[1]}</Typography>
            <Typography>Product Price: {product[2]}</Typography>
            <Typography>Manufacturer Name: {product[3]}</Typography>
            <Typography>Manufacturer Details: {product[4]}</Typography>
            <Typography>Longitude: {product[5]}</Typography>
            <Typography>Latitude: {product[6]}</Typography>
            <Typography>Category: {product[7]}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Display Checkpoints */}
      {checkpoints.length > 0 && (
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Checkpoints:
            </Typography>
            <Table>
              <TableBody>
                {checkpoints.map((checkpoint, index) => (
                  <TableRow key={index}>
                    <TableCell>{checkpoint.location}</TableCell>
                    <TableCell>
                      Latitude: {checkpoint.longitude}, Longitude: {checkpoint.latitude}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Map Integration */}
      <Box style={{ height: "400px", marginTop: "20px" }}>
        <MapContainer
          center={[parseFloat(product?.latitude || 0), parseFloat(product?.longitude || 0)]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Product marker */}
          {product && product[5] && product[6] && (
            <Marker
              position={[parseFloat(product[6]), parseFloat(product[5])]}
              icon={markerIcon}
            >
              <Popup>
                <Typography variant="subtitle1" gutterBottom>
                  Product Origin
                </Typography>
                <Typography variant="body2">Name: {product[1]}</Typography>
                <Typography variant="body2">Latitude: {product[6]}</Typography>
                <Typography variant="body2">Longitude: {product[5]}</Typography>
              </Popup>
            </Marker>
          )}
          {/* Checkpoint markers */}
{checkpoints.map((checkpoint, index) => {
  console.log(`Checkpoint ${index}:`, checkpoint); // Debugging: Log checkpoint data
  return (
    <Marker
      key={index}
      position={[checkpoint.longitude, checkpoint.latitude]}
      icon={markerIcon}
    >
      <Popup>
        <Typography variant="subtitle1" gutterBottom>
          Checkpoint {index + 1}
        </Typography>
        <Typography variant="body2">Location: {checkpoint.location}</Typography>
        <Typography variant="body2">Latitude: {checkpoint.latitude}</Typography>
        <Typography variant="body2">Longitude: {checkpoint.longitude}</Typography>
      </Popup>
    </Marker>
  );
})}

        </MapContainer>
      </Box>
    </Container>
  );
};

export default GetProduct;
