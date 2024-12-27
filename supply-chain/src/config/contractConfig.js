const contractAddress = "0x439e0A14bdB2Be78119939CB825f5DAf11234b76";

const contractABI = [
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
        "name": "location",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "checkInTime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "checkOutTime",
        "type": "uint256"
      }
    ],
    "name": "CheckpointAdded",
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
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_checkInTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_checkOutTime",
        "type": "uint256"
      }
    ],
    "name": "addCheckpoint",
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
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "location",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "checkInTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "checkOutTime",
                "type": "uint256"
              }
            ],
            "internalType": "struct ProductTrac.Checkpoint[]",
            "name": "checkpoints",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct ProductTrac.Product",
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
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getCheckpoints",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "locations",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "checkInTimes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "checkOutTimes",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
  ];

  export { contractAddress, contractABI };