const ProductTr = artifacts.require("ProductTr");

module.exports = function (deployer) {
  // Deploy the ProductNewTrack contract
  deployer.deploy(ProductTr);
};
