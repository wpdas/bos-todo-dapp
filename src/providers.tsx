import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ModalProvider from "./contexts/ModalProvider";
import { NearSocialBridgeProvider, Spinner } from "near-social-bridge";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <NearSocialBridgeProvider fallback={<Spinner />} waitForStorage>
        <ModalProvider>{children}</ModalProvider>
      </NearSocialBridgeProvider>
    </ChakraProvider>
  );
}

export default Providers;
