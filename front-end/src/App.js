import { ChakraProvider } from "@chakra-ui/react";
import Feed from "./pages/mainpage/Feed";

//Chakra Provider is a wrapper for the UI system I'm using (Chakra UI)
//Feed is the main component
function App() {
  return (
    <ChakraProvider>
      <Feed />
    </ChakraProvider>
  );
}

export default App;
