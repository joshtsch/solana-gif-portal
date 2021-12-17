/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppProps } from "next/app";
import "../styles/globals.css";

declare global {
  interface Window {
    solana: any;
    twttr: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
