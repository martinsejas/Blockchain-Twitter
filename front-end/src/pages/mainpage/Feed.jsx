import React, {useState, useEffect} from 'react';  
import { FeedMakeTweetDiv, FeedMainDiv, FeedMetaMaskDiv, FeedTitleDiv, FeedTweetsDiv } from './styled';
import { Button,FormControl, FormErrorMessage, Textarea} from '@chakra-ui/react'
import SMART_CONTRACT from '../../smartContract';
import detectEthereumProvider from '@metamask/detect-provider';
import * as Yup from "yup";
import {Formik, Form, Field} from 'formik';
import TweetContainer from '../../components/TweetContainer/TweetContainer';



function Feed() {

let [displayButton, setDisplayButton] = useState(false); 
let [userAccount, setUserAccount] = useState(null)
let [isLoading, setIsLoading] = useState(false); 
let [isMetamaskHandled, setIsMetamaskHandled] = useState(false); 
let [feedTweets, setFeedTweets] = useState([]);

let loadingNewMessage = false;


useEffect( () => {
  populateFeed(setFeedTweets)
},[])

useEffect( ()=>{
   if(window.ethereum && window.ethereum.selectedAddress)
   {
      window.ethereum
       .request({ method: "eth_requestAccounts" })
       .then((accounts) => {
         if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            console.log('Please connect to MetaMask.');
          } else if (accounts[0] !== userAccount) {
            setUserAccount(accounts[0]);
          }
       }) //will call the handleAccountsChanged function which will save the wallet address on our userAccount variable
       .catch((err) => {
         // Some unexpected error.
         // For backwards compatibility reasons, if no accounts are available,
         // eth_accounts will return an empty array.
         console.error(err);
       });
      setIsMetamaskHandled(true)
   }
},[userAccount])

//function for handling change of metamask accounts
function handleAccountsChanged(accounts) {
   if (accounts.length === 0) {
     // MetaMask is locked or the user has not connected any accounts
     console.log('Please connect to MetaMask.');
   } else if (accounts[0] !== userAccount) {
     setUserAccount(accounts[0]);
   }
 }

 //function for deleting tweets
const deleteTweet = (id) => {
  if (window.confirm(`You will permanently delete this tweet, are you sure?`)) {
    SMART_CONTRACT.methods.DeleteTweet(id)
    .send({ from: userAccount })
    .then((response) => {
      populateFeed(setFeedTweets)
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
  }
};

 //function handling connection to metamask
 //1.- checks if there is an ethereum provider for the browser
 //2.- If it's not Metamask, prompt the user to install it
 //3.- If it IS metamask, check the user is on the Goerli testnet
 //4.- Prompt the user to switch to the goerli testnet (if not there), (if there) request connection to metamask account
 //5.- Once connection is established, get address from metamask
 //6.- Save address to our userAccount variable to consume the smart contract
async function connectToMetamask(){

   //detect ethereum provider
   setIsLoading(true)
   const provider = await detectEthereumProvider();
   setIsLoading(false)

   //if not metamask, prompt the user to install it or use it
   if(provider === null || provider !== window.ethereum)
   {
      alert("Please install Metamask! Or use it as your  wallet to create Tweets! ")
      return
   }

   const chainId = await window.ethereum.request({ method: 'eth_chainId' });

   //Check user is on the right network, Goerli chainId is '0x5'
   if(chainId !== "0x5")
   {
      alert("Please change your Metamask network to the Goerli testnet")
      return   
   }
  
   //Get account
     window.ethereum
       .request({ method: "eth_requestAccounts" })
       .then(handleAccountsChanged) //will call the handleAccountsChanged function which will save the wallet address on our userAccount variable
       .catch((err) => {
         // Some unexpected error.
         // For backwards compatibility reasons, if no accounts are available,
         // eth_accounts will return an empty array.
         console.error(err);
       }); 
   
   setDisplayButton(!displayButton);
   setIsMetamaskHandled(true)
   
}


//function that will request the api for tweets to load the feed
async function populateFeed(setFeedTweets){
            SMART_CONTRACT.methods.GetTweets().call().then( (response) => 
            {
              setFeedTweets(response)
            }).catch ( (err) => console.log(`Err: ${err}`))
}

//map that will load all the tweets
let displayTweets = feedTweets.map( (tweet, index) => {
  return <TweetContainer 
  tweet={tweet}
  key={index}
  id ={index}
  user={userAccount}
  deleteTweet={(id) => deleteTweet(id)}
  setFeedTweets = {() => populateFeed(setFeedTweets)}
  />
})

//reversing the tweets to be most recent first, but this reverse could be activated on a sorting button
displayTweets = displayTweets.reverse();

  return (
    <FeedMainDiv>
      <FeedTitleDiv>
        <h1>Welcome to Ethereum Twitter!</h1>
      </FeedTitleDiv>
      {isMetamaskHandled ? (
        <span></span>
      ) : (
        <FeedMetaMaskDiv>
          {
            <Button
              disabled={displayButton}
              isLoading={isLoading}
              onClick={() => connectToMetamask()}
            >
              ENABLE METAMASK
            </Button>
          }
        </FeedMetaMaskDiv>
      )}
      <FeedMakeTweetDiv>
        <Formik
          initialValues={{ body: "" }}
          //input control
          validationSchema={Yup.object({
            body: Yup.string()
              .min(5, "Minimum 5 characters")
              .max(140, "Max 140 caracters")
              .required("Obligatory Field"),
          })}
          //actions on Submit
          onSubmit={async (values, actions) => {
            //values.body is the content inside
            // set loading animation to button while tweet is being created
            loadingNewMessage = true;

            //create a new tweet by calling smartcontract 
            SMART_CONTRACT.methods
              .PostTweet(values.body, Math.floor(new Date().getTime() / 1000))
              .send({ from: userAccount })
              .then((response) => {
                populateFeed(setFeedTweets);
                loadingNewMessage = false;
                actions.resetForm();
                actions.setSubmitting(false);
              })
              .catch((err) => {
                console.log(`Error: ${err}`);
              });
          }}
        >
          {(props) => {
            return (
              <Form>
                <Field name="body">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.body && form.touched.body}
                    >
                      <Textarea
                        {...field}
                        className="bodyInput"
                        placeholder="What do you want to share with your blockchain?"
                        _placeholder={{ opacity: 0.8, color: "#323941" }}
                      />
                      <FormErrorMessage className="errorMessage">
                        {form.errors.body}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  disabled={userAccount === null}
                  id="postButton"
                  variant="solid"
                  isLoading={loadingNewMessage}
                  type="submit"
                >
                  TWEET
                </Button>
              </Form>
            );
          }}
        </Formik>
      </FeedMakeTweetDiv>
      <hr />

      {feedTweets[0] ? (
        <FeedTweetsDiv>{displayTweets}</FeedTweetsDiv>
      ) : (
        <Button id="feedLoadingButton" isLoading={true}></Button>
      )}
    </FeedMainDiv>
  );
}

export default Feed