

require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */


const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GOERLI_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY; 


module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli:  {
      url: GOERLI_RPC_URL, 
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
