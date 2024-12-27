const ProductTrac = artifacts.require("ProductTrac");

module.exports = function (deployer) {
  // Deploy the ProductNewTrack contract
  deployer.deploy(ProductTrac);
};
