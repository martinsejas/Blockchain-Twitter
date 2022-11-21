import styled from "styled-components";

export const TweetContainerDiv = styled.div`
width: 100%; 
min-height: 15vh; 
margin-bottom: 7px;
display: flex;
flex-direction: column; 
background-color: white;
color: black;
font-family: Roboto, sans-serif; 
border-bottom: 1px solid grey;
border-radius: 5px 5px 5px 5px;


`

export const TweetNameAndTimeDiv = styled.div`
width: 100%; 
height: 20%; 
display: flex; 
font-size: 0.8rem; 
justify-content: space-between;
padding: 1% 2%;
font-style: italic; 
color: grey;
font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;

#spaceSpan
{
    padding: 0 10px
}
`

export const TweetMessageDiv = styled.div`
width: 100%; 
height: 60%; 
padding: 2% 2%;

p{
    font-weight: 400;
    font-size: 1.1rem;
}
`
export const TweetActionDiv = styled.div`
display: flex;
width: 100%; 
height: 10%; 
justify-content: space-evenly; 
padding: 1% 2%;
margin-top: -1.5%; 

Button{
    font-size: 1.2rem;
    background-color: white;
    color: grey;
}

`