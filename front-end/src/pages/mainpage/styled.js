import styled from "styled-components";

//main div encapsulating entire page
export const FeedMainDiv = styled.div`
width: 100vw; 
height: auto; //dynamic height to act as a feed
min-height: 100vh; 
background-color: #1DA1F2; //copying twitter's original color
overflow-y: scroll; //allow scrollling 
display: flex; 
flex-direction: column; 
align-items: center; 

hr{
    width: 50%; 
    color: white;
    margin-top: 3vh;
}

#feedLoadingButton
{
    margin-top: 5vh; 
}
`
//divi holding the title of the webpage
export const FeedTitleDiv = styled.div`
width: 60%; 
height: 15vh; 
font-family: Roboto, sans-serif; 
color: white; 
font-size: 2rem; 
text-align: center;
font-weight: 700; 

h1 {
    padding-top: 5vh; 
}
`
//div handling the metamask button portion, will disappear once connected
export const FeedMetaMaskDiv = styled.div`
width: 40%; 
display: flex;
justify-content: center;
margin-bottom: 5vh;

Button{
    width: 45%; 
    font-size: 1.3rem;
    padding: 4% 0%; 
    font-weight: 500; 
    background-color: #0a8e33;
    color: white;
    align-self: center;

    :hover {
        background-color: #0a8e33;
        opacity: 0.8;
    }
}`

export const FeedMakeTweetDiv = styled.div`
width: 45%; 
display: flex; 
Form{
    width: 100%; 
    display: flex; 
    flex-direction: column;
    border-radius: 5px; 
}

.bodyInput {
   background-color: white;
   font-size: 1.1rem; 
   width: 100%;
   padding-top: 1%;
   border-radius: 5px; 
   margin-top: 1px;
   min-height: 14vh;
   max-height: 15vh;
}

#postButton{
    height: 5vh;
    width: 100%; 
    margin-top: 2vh;
    color: white;
    background-color: #0a8e33; 
    border: 2px solid white;
    /* box-shadow: 1px 1px 1px;  */
    align-self: center;

    :hover {
        background-color: #0a8e33;
        opacity: 0.8;
    }
}
`

export const FeedTweetsDiv = styled.div`
    width: 45%; 
    margin-top: 2vh;
    height: max-content; 
    overflow-y: auto; 
    display: flex; 
    flex-direction: column; 

   
`