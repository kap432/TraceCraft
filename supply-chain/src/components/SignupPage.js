import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Box,
  Grid,
} from "@mui/material";

const SignupPage = ({ setStep }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: role,
      });

      setStep(2);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Please fill in the details to sign up for your account.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSignUp}
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
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>
            <MenuItem value="Manufacturer">Manufacturer</MenuItem>
            <MenuItem value="Courier">Courier</MenuItem>
            <MenuItem value="Certification Authority">Certification Authority</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem> {/* Added Customer role */}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Grid item>
          <Typography variant="body2">
            Already have an account?{" "}
            <Button color="secondary" onClick={goToLoginPage}>
              Log In
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
