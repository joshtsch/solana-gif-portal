import { useContext } from "react";
import { EthereumWalletContext } from "../context";

export function ConnectEthereumWalletButton() {
  const { setCurrentAccount } = useContext(EthereumWalletContext);

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWalletAction}
    >
      Connect Wallet To Get Started
    </button>
  );
}
