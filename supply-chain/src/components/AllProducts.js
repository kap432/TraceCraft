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

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ABI and contract address
  const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "manufacturerName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "manufacturerDetails",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "longitude",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "latitude",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        }
      ],
      "name": "ProductAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "logisticsPartner",
          "type": "address"
        }
      ],
      "name": "ProductAssignedToCourier",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "customer",
          "type": "address"
        }
      ],
      "name": "ProductAssignedToCustomer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateAuthority",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateDocHash",
          "type": "string"
        }
      ],
      "name": "ProductCertified",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "deliveryStatus",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "logisticsPartner",
          "type": "address"
        }
      ],
      "name": "ProductDelivered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_manufacturerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_manufacturerDetails",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_longitude",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_latitude",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_certificateAuthority",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_digitalSignature",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_certificateDocHash",
          "type": "string"
        }
      ],
      "name": "certifyProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        }
      ],
      "name": "assignCourier",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_deliveryStatus",
          "type": "string"
        }
      ],
      "name": "markAsDelivered",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_customer",
          "type": "address"
        }
      ],
      "name": "assignToCustomer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "manufacturerName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "manufacturerDetails",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "longitude",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "latitude",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "manufacturer",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "logisticsPartner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "customer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "deliveryStatus",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "certificateAuthority",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "digitalSignature",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "certificateDocHash",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isCertified",
              "type": "bool"
            }
          ],
          "internalType": "struct ProductNewTrack.Product",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllProductIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
  const CONTRACT_ADDRESS = "0xBd3A728f5D49A9Bb1b9651f52e370056DE3b9c55";

  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

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
