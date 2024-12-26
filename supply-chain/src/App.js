import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AddProduct from "./components/AddProduct";
import GetProduct from "./components/GetProduct";
import LandingPage from "./components/LandingPage";
import AssignCourier from "./components/AssignCourier";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import MetaMaskPage from "./components/MetaMaskPage";
import LogisticsPartner from "./components/LogisticsPartner";
import AllProducts from "./components/AllProducts";
import ManufacturerDashboard from "./components/ManufacturerDashboard";
import CourierDashboard from "./components/CourierDashboard";
import { auth, db } from "./firebase"; // Assuming firebase is configured
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import CertificateAuthority from "./components/CertificateAuthority";
import { contractABI,contractAddress } from "./config/contractConfig";


const App = () => {
const [manufacturerAccount, setManufacturerAccount] = useState(null);
const [courierAccount, setCourierAccount] = useState(null);
const [certificateAuthorityAccount, setCertificateAuthorityAccount] = useState(null);
const [contract, setContract] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userRole, setUserRole] = useState(null);
const [step, setStep] = useState(1); // Track the current step in the flow

  // const abi = [
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "productId",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "name",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "price",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "manufacturerName",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "manufacturerDetails",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "longitude",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "latitude",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "category",
  //         type: "string",
  //       },
  //     ],
  //     name: "ProductAdded",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "productId",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "logisticsPartner",
  //         type: "address",
  //       },
  //     ],
  //     name: "ProductAssignedToCourier",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "productId",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "customer",
  //         type: "address",
  //       },
  //     ],
  //     name: "ProductAssignedToCustomer",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "productId",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "certificateAuthority",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "certificateDocHash",
  //         type: "string",
  //       },
  //     ],
  //     name: "ProductCertified",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "productId",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "string",
  //         name: "deliveryStatus",
  //         type: "string",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "logisticsPartner",
  //         type: "address",
  //       },
  //     ],
  //     name: "ProductDelivered",
  //     type: "event",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "_id",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_name",
  //         type: "string",
  //       },
  //       {
  //         internalType: "uint256",
  //         name: "_price",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_manufacturerName",
  //         type: "string",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_manufacturerDetails",
  //         type: "string",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_longitude",
  //         type: "string",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_latitude",
  //         type: "string",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_category",
  //         type: "string",
  //       },
  //     ],
  //     name: "addProduct",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "_productId",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_certificateAuthority",
  //         type: "string",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_digitalSignature",
  //         type: "string",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_certificateDocHash",
  //         type: "string",
  //       },
  //     ],
  //     name: "certifyProduct",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "_productId",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "assignCourier",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "_productId",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "string",
  //         name: "_deliveryStatus",
  //         type: "string",
  //       },
  //     ],
  //     name: "markAsDelivered",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "_productId",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "address",
  //         name: "_customer",
  //         type: "address",
  //       },
  //     ],
  //     name: "assignToCustomer",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "_id",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "getProduct",
  //     outputs: [
  //       {
  //         components: [
  //           {
  //             internalType: "uint256",
  //             name: "id",
  //             type: "uint256",
  //           },
  //           {
  //             internalType: "string",
  //             name: "name",
  //             type: "string",
  //           },
  //           {
  //             internalType: "uint256",
  //             name: "price",
  //             type: "uint256",
  //           },
  //           {
  //             internalType: "string",
  //             name: "manufacturerName",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "manufacturerDetails",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "longitude",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "latitude",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "category",
  //             type: "string",
  //           },
  //           {
  //             internalType: "address",
  //             name: "manufacturer",
  //             type: "address",
  //           },
  //           {
  //             internalType: "address",
  //             name: "logisticsPartner",
  //             type: "address",
  //           },
  //           {
  //             internalType: "address",
  //             name: "customer",
  //             type: "address",
  //           },
  //           {
  //             internalType: "string",
  //             name: "deliveryStatus",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "certificateAuthority",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "digitalSignature",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "certificateDocHash",
  //             type: "string",
  //           },
  //           {
  //             internalType: "bool",
  //             name: "isCertified",
  //             type: "bool",
  //           },
  //         ],
  //         internalType: "struct ProductNewTrack.Product",
  //         name: "",
  //         type: "tuple",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //     constant: true,
  //   },
  //   {
  //     inputs: [],
  //     name: "getAllProductIds",
  //     outputs: [
  //       {
  //         internalType: "uint256[]",
  //         name: "",
  //         type: "uint256[]",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //     constant: true,
  //   },
  // ];
  //const contractAddress = "0xC4B34b7aCdFbC0AE4F6510660227c4D15A67C135";

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setManufacturerAccount(accounts[0]);
      setCourierAccount(accounts[1]);
      setCertificateAuthorityAccount(accounts[2]);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      setContract(contract);
    } else {
      console.log("MetaMask is not installed");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (step === 4) {
      connectToMetaMask();
    }
  }, [step]);

  return (
    <Router>
      <div className="App">
  
        <Routes>
          {/* Step 1: Sign Up */}
          <Route path="/signup" element={<SignupPage setStep={setStep} />} />
  
          {/* Step 2: Login */}
          <Route
            path="/login"
            element={
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setStep={setStep}
                connectToMetaMask={connectToMetaMask} // Pass connectToMetaMask here
              />
            }
          />
  
          {/* Step 3: MetaMask Authentication */}
          <Route path="/metamask" element={<MetaMaskPage setStep={setStep} />} />
  
          {/* Manufacturer Dashboard and Features */}
          {isAuthenticated && userRole === "Manufacturer" && (
            <>
              <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} />
              <Route
                path="/add-product"
                element={<AddProduct contract={contract} account={manufacturerAccount} />}
              />
              <Route
                path="/get-product"
                element={<GetProduct contract={contract} />}
              />
            </>
          )}
  
          {/* Courier Dashboard and Features */}
          {isAuthenticated && userRole === "Courier" && (
            <>
              <Route path="/courier-dashboard" element={<CourierDashboard />} />
              <Route
                path="/assign-courier"
                element={<AssignCourier contract={contract} account={courierAccount} />}
              />
              <Route
                path="/logistics-partner"
                element={<LogisticsPartner contract={contract} account={courierAccount} />}
              />
            </>
          )}
  
          {/* Certificate Authority Dashboard and Features */}
          {isAuthenticated && userRole === "Certification Authority" && (
            <>
              <Route
                path="/certificate-authority"
                element={<CertificateAuthority contract={contract} account={certificateAuthorityAccount} />}
              />
            </>
          )}
  
          {/* Common Features */}
          {isAuthenticated && (
            <Route
              path="/all-products"
              element={<AllProducts contract={contract} />}
            />
          )}
  
          {/* Default Redirect Based on Role */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? userRole === "Manufacturer"
                  ? <Navigate to="/manufacturer-dashboard" />
                  : userRole === "Courier"
                  ? <Navigate to="/courier-dashboard" />
                  : userRole === "Certification Authority"
                  ? <Navigate to="/certificate-authority" />
                  : <Navigate to="/login" />
                : <Navigate to="/signup" />
            }
          />
  
          {/* Fallback for Unauthorized Access */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
