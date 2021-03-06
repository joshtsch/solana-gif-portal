/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppProps } from "next/app";
import { useState } from "react";
import {
  CurrentAccount,
  EthereumWalletContext,
  Loading,
  NFTIds,
  NFTs,
} from "../context";
import "../styles/globals.css";

declare global {
  interface Window {
    ethereum: any;
    solana: any;
    twttr: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount>(null);
  const [loading, setLoading] = useState<Loading>(false);
  const [nfts, setNfts] = useState<NFTs>(null);
  const [nftIds, setNftIds] = useState<NFTIds>(null);

  return (
    <EthereumWalletContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
        loading,
        setLoading,
        nfts,
        setNfts,
        nftIds,
        setNftIds,
      }}
    >
      <Component {...pageProps} />
    </EthereumWalletContext.Provider>
  );
}

export default MyApp;
