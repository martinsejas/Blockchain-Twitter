# ETHEREUM TWITTER FRONTEND 
## Overview
<hr>

This project represents the front end for a crypto twitter clone  that uses a Smart Contract as the backend. The project is integrated using web3.

 Users with a **Metamask** crypto wallet, funded with **Goerli tokens**  can: *read tweets, create tweets*, *edit tweets*, and *delete tweets*. 

 Users **without** a connected account can read the feed of Tweets. 

 ## User Prerequisites 
 <hr>

 To get the full experience ethereum experience as a user there are some pre-requisites to be fullfilled. 

 1. Use [Mozilla Firefox](https://www.mozilla.org/) / [Google Chrome](https://www.google.com/chrome/) / [Brave](https://brave.com/download/) as your web browser.

 2. Install the [Metamask Extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=fr) (link for Google Chrome)

 3. Create a Metamask Account 

 4. Create a Metamask Wallet

 5. Fund the wallet using a **Goerli Faucet,**  [this one](https://goerlifaucet.com/) or [this one](faucets.chain.link) will work.

 6. Once your wallet is funded access the live site for the project: [https://ethereum-twitter.surge.sh/](https://ethereum-twitter.surge.sh/)

 7. Click on 'Enable Metamask' where you will be prompted to connect your account. 

 8. Once connected, tweet away!

*Note: If you don't wish to connect a metamask account you will only be able to read the feed.*

## Developer Prerequisites
<hr>

Clone the repository and then try the following commands

(Make sure you have the latest version of Node installed)

```shell
cd ./front-end
npm install
npm run start
```

A local website will be deployed (by default at localhost:3000)
 


## Developer Tools

<hr>


### FRAMEWORK:  <b>ReactJs</b> (using ChakraUI as the main styling library)

<br>

### PACKAGES USED
- Styled-Components
- Yup 
- Formik 
- Metamask
- ChakraUI
- DotEnv 
- Web3 

## Technical Overview
<hr>
The <b>Tweet.sol</b> <i>(ether-twitter/back-end/contracts) </i>  smart contract was programmed and designed to be deployed as a DApp smart contract for the ethereum network. However, it is common for blockchain developers do deploy the app on the Goerli network, which is the equivalent of Ethereum without using real money for operation. 

<br>
The back-end was made in Solidity, and deployed as a smart contract. Hence the 'API' that this front end application interacts with is a smart contract deployed to the Goerli blockchain network. Where a web3 instance is created to access the smart contract's methods. 

<br>
The front-end includes many user-friendly features such as:

- If the user doesn't have a cryptowallet, or doesn't wish to connect one to the website, the Feed can still be read due to the provision of a cached Goerli node that accesses the network. 

- Dotenv is used to protect sensitive data.

- Disconnected accounts have the 'Tweet' button disabled, avoiding pollution of the feed.

- If the user attempts to connect a Metamask account with the wrong network, the user will get a prompt to fix it.

- Form validation on tweet creation or edit. Users can't submit empty tweets, or tweets exceeding 140 characters.

- Loading animations for tweet creation and edit (blockchain transactions take a LONG time)

- Implemented a modal for editing.

Feel free to checkout the repository and [contact me](github.com/martinsejas) if you wish! 

