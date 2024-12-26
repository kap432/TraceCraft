import React from "react";
import { useNavigate } from "react-router-dom";

const CertificateAuthorityDashboard = () => {
  const navigate = useNavigate();

  // Function to handle redirection to CertificateAuthority.js
  const handleRedirect = () => {
    navigate("/certificate-authority"); // Update to the correct path
  };

  return (
    <div>
      <h1>Certificate Authority Dashboard</h1>
      <p>Welcome to the Certificate Authority Dashboard!</p>

      {/* Add a button or any trigger to redirect */}
      <button onClick={handleRedirect}>
        Go to Certificate Authority Details
      </button>
    </div>
  );
};

export default CertificateAuthorityDashboard;
