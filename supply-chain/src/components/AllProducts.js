import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { contractAddress, contractABI } from "../config/contractConfig";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const getAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productIds = await contract.methods.getAllProductIds().call();
      const productsList = [];

      for (const id of productIds) {
        const productDetails = await contract.methods.getProduct(id).call();
        productsList.push({
          id: productDetails.id,
          name: productDetails.name,
          price: productDetails.price,
          manufacturer: productDetails.manufacturer,
          category: productDetails.category,
          certificateHash: productDetails.certificateDocHash,
          courier: productDetails.logisticsPartner,
          status: productDetails.deliveryStatus,
        });
      }

      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        All Products
      </Typography>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {error}
        </Alert>
      ) : products.length === 0 ? (
        <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
          No products found.
        </Typography>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product ID</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Manufacturer</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Certificate Hash</strong></TableCell>
                <TableCell><strong>Courier Address</strong></TableCell>
                <TableCell><strong>Delivery Status</strong></TableCell>
                <TableCell><strong>View</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.manufacturer}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.certificateHash || "No certificate available"}
                  </TableCell>
                  <TableCell>
                    {product.courier !== "0x0000000000000000000000000000000000000000"
                      ? product.courier
                      : "No courier assigned"}
                  </TableCell>
                  <TableCell>
                    {product.status || "No status available"}
                  </TableCell>
                  <TableCell>
                    {product.certificateHash ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${product.certificateHash}`, "_blank")}
                      >
                        View
                      </Button>
                    ) : (
                      "No certificate available"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AllProducts;
