import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NearSocialBridgeProvider } from "near-social-bridge";
import { ChakraProvider } from "@chakra-ui/react";
import ProgressSpinner from "./components/ProgressSpinner";
import ModalProvider from "./contexts/ModalProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ChakraProvider>
    <NearSocialBridgeProvider fallback={<ProgressSpinner />} waitForStorage>
      <ModalProvider>
        <App />
      </ModalProvider>
    </NearSocialBridgeProvider>
  </ChakraProvider>
);
