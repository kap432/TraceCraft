const ProductNewTrack = artifacts.require("ProductNewTrack");

module.exports = function (deployer) {
  // Deploy the ProductNewTrack contract
  deployer.deploy(ProductNewTrack);
};
