const Meme = artifacts.require("meme");

module.exports = function(deployer) {
  deployer.deploy(Meme);
};
