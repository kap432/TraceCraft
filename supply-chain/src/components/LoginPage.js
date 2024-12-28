import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
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

  // Connect to MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletAddresses(accounts);
          setError(""); // Clear any previous errors
        } else {
          setError("No wallet accounts found. Please try again.");
        }
      } catch (err) {
        console.error("MetaMask connection error:", err);
        setError("MetaMask connection failed. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to proceed.");
    }
  };

  // Get the next available wallet address
  const getNextAvailableWalletAddress = async () => {
    try {
      const usedWalletsSnapshot = await getDocs(collection(db, "usedWallets"));
      const usedWallets = usedWalletsSnapshot.docs.map((doc) => doc.data().walletAddress);

      // Find the first wallet address that hasn't been used
      return walletAddresses.find((address) => !usedWallets.includes(address));
    } catch (err) {
      console.error("Error fetching used wallet addresses:", err);
      setError("Failed to fetch available wallet addresses. Please try again.");
      return null;
    }
  };

  // Mark wallet address as used
  const markWalletAsUsed = async (walletAddress) => {
    try {
      await addDoc(collection(db, "usedWallets"), { walletAddress });
    } catch (err) {
      console.error("Error marking wallet as used:", err);
      setError("Failed to update wallet usage. Please try again.");
    }
  };

  // Merge user data in Firestore
  const mergeUserData = async (uid, email, walletAddress) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const existingData = userDoc.data();
        if (!existingData.walletAddress) {
          await updateDoc(userDocRef, { walletAddress });
          await markWalletAsUsed(walletAddress);
        }
      } else {
        await setDoc(userDocRef, {
          email,
          walletAddress,
          role: "Unknown",
        });
        await markWalletAsUsed(walletAddress);
      }
    } catch (err) {
      console.error("Error merging user data:", err);
      setError("Failed to update user data. Please try again.");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      let walletAddress = userDoc.exists() ? userDoc.data().walletAddress : null;

      if (!walletAddress) {
        walletAddress = await getNextAvailableWalletAddress();
        if (!walletAddress) {
          setError("No available wallet addresses. Please contact support.");
          setLoading(false);
          return;
        }
        await mergeUserData(user.uid, user.email, walletAddress);
      }

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (!userData.role || !["Manufacturer", "Courier", "Certification Authority", "Customer"].includes(userData.role)) {
          setError("Invalid or missing role. Please contact support.");
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        switch (userData.role) {
          case "Manufacturer":
            navigate("/manufacturer-dashboard");
            break;
          case "Courier":
            navigate("/courier-dashboard");
            break;
          case "Certification Authority":
            navigate("/certificate-authority");
            break;
          case "Customer":
            navigate("/get-Product");
            break;
          default:
            setError("Invalid role. Please contact support.");
        }
      } else {
        setError("User data not found. Please contact support.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Invalid credentials. Redirecting to signup...");
      setTimeout(() => navigate("/signup"), 2000);
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
