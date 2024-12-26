import React, { useState, useEffect } from "react";

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
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const GetProduct = ({ contract }) => {
  const [productId, setProductId] = useState(1);
  const [product, setProduct] = useState(null);
  const [courierAddress, setCourierAddress] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to fetch product details and the courier assigned
  const getProduct = async () => {
    setLoading(true);

    try {
      // Fetch product details
      const productDetails = await contract.methods.getProduct(productId).call();
      setProduct(productDetails);

      // Fetch courier address for the product
      const courier = await contract.methods.getCourierForProduct(productId).call();
      const cleanedCourier = courier.trim();
      setCourierAddress(cleanedCourier);
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
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

            <Divider style={{ margin: "15px 0" }} />
            {courierAddress && courierAddress !== "" ? (
              <Typography>
                <strong>Courier Address:</strong> {courierAddress}
              </Typography>
            ) : (
              <Typography>No courier assigned yet.</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map Integration */}
      {product && product[5] && product[6] && (
        <Box style={{ height: "400px", marginTop: "20px" }}>
          <MapContainer
            center={[parseFloat(product[6]), parseFloat(product[5])]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[parseFloat(product[6]), parseFloat(product[5])]}
              icon={markerIcon}
            >
              <Popup>
                {product[1]} - {product[7]}
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      )}
    </Container>
  );
};

export default GetProduct;
