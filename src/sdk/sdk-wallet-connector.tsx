import { Rx, useRxOrThrow } from "@rixio/react";
import { useEffect, useMemo, useState } from "react";
import { from } from "rxjs";
import { createRaribleSdk } from "@rarible/sdk";
import type {
  IConnector,
  ConnectionState,
} from "@rarible/sdk-wallet-connector";
import { IRaribleSdk } from "@rarible/sdk/build/domain";
import { BlockchainWallet } from "@rarible/sdk-wallet";
import { Blockchain } from "@rarible/api-client";
import { Maybe } from "../common/maybe";

export type ConnectorComponentProps = {
  connector: IConnector<string, BlockchainWallet>;
  desiredWallets: Array<string>;
  children: (
    sdk: IRaribleSdk,
    walletAddress: Maybe<string>,
    connection: ConnectionState<BlockchainWallet>
  ) => JSX.Element;
};

export function SdkWalletConnector({
  connector,
  desiredWallets,
  children,
}: ConnectorComponentProps) {
  const conn = useRxOrThrow(connector.connection);
  const [address, setAddress] = useState<Maybe<string>>(undefined);

  useEffect(() => {
    if (conn?.status === "connected") {
      const wallet = conn.connection;
      switch (wallet.blockchain) {
        case Blockchain.ETHEREUM:
          wallet.ethereum
            .getFrom()
            .then((address) => setAddress(address))
            .catch(() => setAddress(undefined));
          break;
        case Blockchain.TEZOS:
          wallet.provider
            .address()
            .then((address) => setAddress(address))
            .catch(() => setAddress(undefined));
          break;
        case Blockchain.FLOW:
          wallet.fcl
            .currentUser()
            .authenticate()
            .then((auth) => setAddress(auth?.addr))
            .catch(() => setAddress(undefined));
          break;
        default:
          setAddress(undefined);
      }
    }
  }, [conn]);

  if (conn.status === "disconnected" || conn.status === "connecting") {
    // Here we can show connect to Tezos wallet button, because it basically lists all of the possible wallets
    return (
      <Options
        connector={connector}
        connectionState={conn}
        desiredWallets={desiredWallets}
      />
    );
  } else if (conn.status === "initializing") {
    return <p>Initializing...</p>;
  } else {
    const sdk = createRaribleSdk(conn.connection, "staging");
    return (
      <div>
        {conn.disconnect && (
          <button onClick={conn.disconnect}>disconnect</button>
        )}
        {children(sdk, address, conn)}
      </div>
    );
  }
}

interface OptionsProps<C> {
  connector: IConnector<string, C>;
  connectionState: ConnectionState<C>;
  desiredWallets: Array<string>;
}

// You can style your connect buttons here

function Options<C>({
  connector,
  connectionState,
  desiredWallets,
}: OptionsProps<C>) {
  const options$ = useMemo(() => from(connector.getOptions()), [connector]);

  return (
    <Rx value$={options$}>
      {(options) => (
        <div>
          <p>Connect to:</p>
          {options
            .filter((o) =>
              desiredWallets.length > 0
                ? desiredWallets.includes(o.option)
                : true
            )
            .map((o) => (
              <div key={o.option}>
                <button
                  onClick={() => {
                    connector.connect(o);
                  }}
                >
                  {o.option}
                </button>
                {connectionState.status === "connecting" &&
                connectionState.providerId === o.provider.getId()
                  ? "Connecting..."
                  : null}
              </div>
            ))}
        </div>
      )}
    </Rx>
  );
}
