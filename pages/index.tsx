import { Container, Footer, NavBar, Screen } from "@joshtsch/legos";
import { Program, Provider, web3 } from "@project-serum/anchor";
import {
  ConfirmOptions,
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import type { NextPage } from "next";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import idl from "../idl/idl.json";
import kp from "../keypair.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// const TEST_GIFS = [
//   "https://media.giphy.com/media/mz7iww9tCUnJJeZvGN/giphy.gif",
//   "https://media.giphy.com/media/A7glKaSuRNd5lN0dJU/giphy.gif",
//   "https://media.giphy.com/media/xUNemHqSwUaBNktQ76/giphy.gif",
//   "https://media.giphy.com/media/d0DdMCREQChi3jGymW/giphy.gif",
//   "https://media.giphy.com/media/oBQZIgNobc7ewVWvCd/giphy.gif",
// ];

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arr: any[] = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed" as ConfirmOptions,
};

interface Gif {
  gifLink: string;
}

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [gifList, setGifList] = useState<Gif[] | null>([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    console.log({ connection }, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      console.log({ provider });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idl as any, programID, provider);
      console.log("ping");
      console.log(provider.wallet.publicKey);
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey.toString(),
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!");
      return;
    }
    setInputValue("");
    console.log("Gif link:", inputValue);
    try {
      const provider = getProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idl as any, programID, provider);

      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey.toString(),
        },
      });
      console.log("GIF successfully sent to program", inputValue);

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't been initialized.
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }
    // Otherwise, we're good! Account exists. User can submit GIFs.
    else {
      return (
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <input
              type="text"
              placeholder="Enter gif link!"
              value={inputValue}
              onChange={onInputChange}
            />
            <button type="submit" className="cta-button submit-gif-button">
              Submit
            </button>
          </form>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "2rem",
            }}
          >
            {gifList.map((item, index) => {
              console.log(item.gifLink);
              return (
                <div
                  className="gif-item"
                  key={index}
                  style={{
                    position: "relative",
                    height: "200px",
                    width: "200px",
                  }}
                >
                  <div style={{ position: "absolute" }}>
                    <Image
                      src={item.gifLink}
                      alt="gif link"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div style={{ position: "absolute" }}>HEY</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const getGifList = async () => {
    try {
      const provider = getProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idl as any, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");
      getGifList();
    }
  }, [walletAddress]);

  return (
    <Screen>
      {walletAddress && <NavBar walletAddress={walletAddress} />}
      <Container
        style={{
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "center",
          marginBottom: "2rem",
          marginTop: "2rem",
        }}
      >
        <p className="header">💎 Diamond GIF Portal 💎</p>
        <p className="sub-text">
          ✨💎 View your GIF collection in the metaverse 💎✨
        </p>

        {walletAddress
          ? renderConnectedContainer()
          : renderNotConnectedContainer()}
      </Container>
      <Footer
        socialMedia={[
          { alt: "Twitter", href: TWITTER_LINK, logo: "/twitter-logo.svg" },
        ]}
      />
    </Screen>
  );
};

export default Home;
