import { useContext, useEffect } from "react";
import { EthereumWalletContext, SetLoading } from "../context";

const checkIfWalletIsConnected = async (
  setLoading: SetLoading,
  cb: (account: string) => void
) => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      setLoading(false);
      return;
    } else {
      console.log("We have the ethereum object", ethereum);

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        cb(account);
      } else {
        console.log("No authorized account found");
      }
    }
  } catch (error) {
    console.log(error);
  }

  setLoading(false);
};

export function useCheckIfWalletIsConnected() {
  const { setCurrentAccount, setLoading } = useContext(EthereumWalletContext);

  useEffect(() => {
    setLoading(true);
    checkIfWalletIsConnected(setLoading, (account) => {
      setCurrentAccount(account);
    });

    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== "4") {
          alert("Please connect to Rinkeby!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkNetwork();
  }, [setCurrentAccount, setLoading]);
}
