import { AppProps } from "next/app";
import "../styles/index.css";
import { SDKContext } from "../context/SDKContext";
import { SdkWalletConnector } from "../sdk/sdk-wallet-connector";
import { connector } from "../context/connectors-setup";

// In order to use desired blockchain you need to pick desired wallet
// Currently supported wallets are:
// Metamask, Torus, Walletlink, Mew, Beacon, Fcl

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SdkWalletConnector connector={connector} desiredWallets={["beacon"]}>
      {(sdk, wallet, connection) => {
        return (
          <SDKContext.Provider value={{ sdk, wallet, connection }}>
            <Component {...pageProps} />
          </SDKContext.Provider>
        );
      }}
    </SdkWalletConnector>
  );
}

export default MyApp;
