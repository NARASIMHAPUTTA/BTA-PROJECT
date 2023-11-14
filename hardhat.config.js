require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

SEPOLIA_URL = process.env.SEPOLIA_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL, // Provide the Sepolia testnet URL in your .env file
      accounts: [process.env.PRIVATE_KEY], // Provide your private key in the .env file
    },
  },
};
