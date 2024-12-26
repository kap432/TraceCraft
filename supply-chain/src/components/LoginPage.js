import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

const LoginPage = ({ setIsAuthenticated, setStep }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddresses(accounts);
      } catch (err) {
        setError("MetaMask connection failed. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to proceed.");
    }
  };

  const updateWalletAddressInFirestore = async (user, newWalletAddress) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        walletAddress: newWalletAddress,
      });
    } catch (error) {
      console.error("Error updating wallet address in Firestore:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Automatically set wallet address based on role
        let roleWalletMap = {
          "Manufacturer": walletAddresses[0],
          "Courier": walletAddresses[1],
          "Certification Authority": walletAddresses[2],
        };
        const assignedWallet = roleWalletMap[userData.role];

        if (assignedWallet && assignedWallet !== userData.walletAddress) {
          await updateWalletAddressInFirestore(user, assignedWallet);
        }

        // Navigate based on user role
        if (userData.role === "Manufacturer") {
          setIsAuthenticated(true);
          navigate("/manufacturer-dashboard");
        } else if (userData.role === "Courier") {
          setIsAuthenticated(true);
          navigate("/courier-dashboard");
        } else if (userData.role === "Certification Authority") {
          setIsAuthenticated(true);
          navigate("/certificate-authority");
        } else {
          setError("Invalid role. Please contact support.");
        }
      } else {
        setError("User data not found. Please contact support.");
      }
    } catch (err) {
      setError("Invalid credentials. Redirecting to signup...");
      setTimeout(() => {
        navigate("/signup");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Access your account by logging in below.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={connectToMetaMask}
          fullWidth
        >
          {walletAddresses.length > 0 ? "MetaMask Connected" : "Connect MetaMask"}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || walletAddresses.length === 0}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Button color="secondary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
