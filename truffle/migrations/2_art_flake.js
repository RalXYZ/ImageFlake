const ArtFlake = artifacts.require("ArtFlake");
const LibBoost = artifacts.require("Boost");

module.exports = function (deployer) {
  deployer.deploy(LibBoost);
  deployer.link(LibBoost, ArtFlake);
  deployer.deploy(ArtFlake);
};
 
