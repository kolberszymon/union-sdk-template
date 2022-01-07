import { IRaribleSdk } from "@rarible/sdk/build/domain";
import { BlockchainWallet } from "@rarible/sdk-wallet";
import { createContext, useContext } from "react";
import { Maybe } from "../common/maybe";
import type { ConnectionState } from "@rarible/sdk-wallet-connector";

type ContextProps = {
  sdk: IRaribleSdk;
  connection: ConnectionState<BlockchainWallet>;
  wallet: Maybe<string>;
};

export const SDKContext = createContext<Partial<ContextProps>>({});
export const useSdkContext = () => useContext(SDKContext);
