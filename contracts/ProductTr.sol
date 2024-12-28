// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductTr {
    // Define a struct for the Product
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        string manufacturerName;
        string manufacturerDetails;
        string longitude;
        string latitude;
        string category;
        address manufacturer; // Store the address of the manufacturer
        address logisticsPartner; // Store the address of the logistics partner
        address customer; // Store the address of the customer (final receiver)
        string deliveryStatus; // Track the delivery status (Wholesaler, Retailer, Customer)
        string certificateAuthority; // Name of the certificate provider
        string digitalSignature; // Digital signature of CA
        string certificateDocHash; // IPFS hash of the certificate document
        bool isCertified; // Certification status
        Checkpoint[] checkpoints; // Array to store checkpoints
    }

    // Define a struct for the Checkpoints
    struct Checkpoint {
        string location;
        string longitude;
        string latitude;
        uint256 checkInTime;
        uint256 checkOutTime;
    }

    // Mapping to store products by their ID
    mapping(uint256 => Product) private products;

    // Array to store all product IDs
    uint256[] private productIds;

    // Events
    event ProductAdded(
        uint256 productId,
        string name,
        uint256 price,
        string manufacturerName,
        string manufacturerDetails,
        string longitude,
        string latitude,
        string category
    );

    event ProductCertified(
        uint256 productId,
        string certificateAuthority,
        string certificateDocHash
    );

    event ProductAssignedToCourier(
        uint256 productId,
        address logisticsPartner
    );

    event ProductDelivered(
        uint256 productId,
        string deliveryStatus,
        address logisticsPartner
    );

    event ProductAssignedToCustomer(
        uint256 productId,
        address customer
    );

    event CheckpointAdded(
        uint256 productId,
        string location,
        string longitude,
        string latitude,
        uint256 checkInTime,
        uint256 checkOutTime
    );

    // Function to add a product
    function addProduct(
    uint256 _id,
    string memory _name,
    uint256 _price,
    string memory _manufacturerName,
    string memory _manufacturerDetails,
    string memory _longitude,
    string memory _latitude,
    string memory _category
) public {
    // Ensure the product does not already exist
    require(products[_id].id == 0, "Product with this ID already exists.");

    // Create the product
    Product storage newProduct = products[_id];
    newProduct.id = _id;
    newProduct.name = _name;
    newProduct.price = _price;
    newProduct.manufacturerName = _manufacturerName;
    newProduct.manufacturerDetails = _manufacturerDetails;
    newProduct.longitude = _longitude;
    newProduct.latitude = _latitude;
    newProduct.category = _category;
    newProduct.manufacturer = msg.sender;
    newProduct.logisticsPartner = address(0);
    newProduct.customer = address(0);
    newProduct.deliveryStatus = "";
    newProduct.certificateAuthority = "";
    newProduct.digitalSignature = "";
    newProduct.certificateDocHash = "";
    newProduct.isCertified = false;

    // Add product ID to the list of products
    productIds.push(_id);

    // Emit event to log the product addition
    emit ProductAdded(
        _id,
        _name,
        _price,
        _manufacturerName,
        _manufacturerDetails,
        _longitude,
        _latitude,
        _category
    );
}

    // Function to certify a product
    function certifyProduct(
        uint256 _productId,
        string memory _certificateAuthority,
        string memory _digitalSignature,
        string memory _certificateDocHash
    ) public {
        // Ensure the product exists
        require(products[_productId].id != 0, "Product does not exist.");

        // Ensure the product is not already certified
        require(!products[_productId].isCertified, "Product is already certified.");

        // Certify the product
        products[_productId].certificateAuthority = _certificateAuthority;
        products[_productId].digitalSignature = _digitalSignature;
        products[_productId].certificateDocHash = _certificateDocHash;
        products[_productId].isCertified = true;

        // Emit event to log the certification
        emit ProductCertified(_productId, _certificateAuthority, _certificateDocHash);
    }

    // Function for logistics partner to assign themselves to a product
    function assignCourier(uint256 _productId) public {
        // Ensure the product exists
        require(products[_productId].id != 0, "Product does not exist.");

        // Ensure the product is certified
        require(products[_productId].isCertified, "Product must be certified before assigning a courier.");

        // Ensure the product has not already been assigned to a logistics partner
        require(products[_productId].logisticsPartner == address(0), "Product already assigned to a logistics partner.");

        // Assign the logistics partner (the caller) to the product
        products[_productId].logisticsPartner = msg.sender;

        // Emit event to log the assignment of the logistics partner
        emit ProductAssignedToCourier(_productId, msg.sender);
    }

    // Function to add a checkpoint for a product
    function addCheckpoint(
        uint256 _productId,
        string memory _location,
        string memory _longitude,
        string memory _latitude,
        uint256 _checkInTime,
        uint256 _checkOutTime
    ) public {
        // Ensure the product exists
        require(products[_productId].id != 0, "Product does not exist.");

        // Ensure the caller is the logistics partner for this product
        require(products[_productId].logisticsPartner == msg.sender, "Only the assigned logistics partner can add checkpoints.");

        // Add the checkpoint to the product
        products[_productId].checkpoints.push(
            Checkpoint({
                location: _location,
                longitude: _longitude,
                latitude: _latitude,
                checkInTime: _checkInTime,
                checkOutTime: _checkOutTime
            })
        );

        // Emit event to log the checkpoint addition
        emit CheckpointAdded(_productId, _location, _longitude, _latitude, _checkInTime, _checkOutTime);
    }

    // Function for logistics partner to mark the product as delivered
    function markAsDelivered(uint256 _productId, string memory _deliveryStatus) public {
        // Ensure the product exists
        require(products[_productId].id != 0, "Product does not exist.");

        // Ensure the caller is the logistics partner for this product
        require(products[_productId].logisticsPartner == msg.sender, "Only the assigned logistics partner can mark as delivered.");

        // Ensure the product has not already been delivered
        require(bytes(products[_productId].deliveryStatus).length == 0, "Product has already been delivered.");

        // Update the delivery status
        products[_productId].deliveryStatus = _deliveryStatus;

        // Emit event to log the delivery
        emit ProductDelivered(_productId, _deliveryStatus, msg.sender);
    }

    // Function to assign a product to the customer
    function assignToCustomer(uint256 _productId, address _customer) public {
        // Ensure the product exists
        require(products[_productId].id != 0, "Product does not exist.");

        // Ensure the caller is the manufacturer of the product
        require(products[_productId].manufacturer == msg.sender, "Only the manufacturer can assign the product to a customer.");

        // Ensure the product has been delivered
        require(bytes(products[_productId].deliveryStatus).length != 0, "Product must be delivered before assigning to customer.");

        // Assign the customer to the product
        products[_productId].customer = _customer;

        // Emit event to log the assignment to customer
        emit ProductAssignedToCustomer(_productId, _customer);
    }

    // Function to get a product by ID
    function getProduct(uint256 _id) public view returns (Product memory) {
        // Ensure the product exists
        require(products[_id].id != 0, "Product not found.");

        // Return the entire product struct
        return products[_id];
    }

    // Function to get all product IDs
    function getAllProductIds() public view returns (uint256[] memory) {
        return productIds;
    }

    // Function to get all checkpoints for a specific product
function getCheckpoints(uint256 _productId) public view returns (
    string[] memory locations,
    string[] memory longitudes,
    string[] memory latitudes,
    uint256[] memory checkInTimes,
    uint256[] memory checkOutTimes
) {
    // Ensure the product exists
    require(products[_productId].id != 0, "Product does not exist.");

    // Get the number of checkpoints
    uint256 checkpointCount = products[_productId].checkpoints.length;

    // Initialize arrays to hold checkpoint data
    locations = new string[](checkpointCount);
    longitudes = new string[](checkpointCount);
    latitudes = new string[](checkpointCount);
    checkInTimes = new uint256[](checkpointCount);
    checkOutTimes = new uint256[](checkpointCount);

    // Populate the arrays with checkpoint data
    for (uint256 i = 0; i < checkpointCount; i++) {
        Checkpoint memory checkpoint = products[_productId].checkpoints[i];
        locations[i] = checkpoint.location;
        longitudes[i] = checkpoint.longitude;
        latitudes[i] = checkpoint.latitude;
        checkInTimes[i] = checkpoint.checkInTime;
        checkOutTimes[i] = checkpoint.checkOutTime;
    }
}

}