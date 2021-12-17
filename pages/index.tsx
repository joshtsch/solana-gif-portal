import { Container, Footer, NavBar, Screen } from "@joshtsch/legos";
import { Program, Provider, web3 } from "@project-serum/anchor";
import {
  ConfirmOptions,
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import Tweet from "../components/Tweet";
import idl from "../idl/idl.json";
import kp from "../keypair.json";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arr: any[] = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed" as ConfirmOptions,
};

interface Tweet {
  username: string;
  link: string;
}

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [tweetList, setTweetList] = useState<Tweet[] | null>([]);

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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const createAccount = async () => {
    try {
      const provider = getProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idl as any, programID, provider);
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
      await getTweetList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const sendTweet = async () => {
    if (inputValue.length === 0) {
      console.log("No tweet link given!");
      return;
    }
    setInputValue("");
    console.log("Tweet link:", inputValue);
    try {
      const provider = getProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idl as any, programID, provider);
      const twitterHandle = inputValue.split("/")[3];

      await program.rpc.addTweet(inputValue, twitterHandle, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey.toString(),
        },
      });
      console.log("Tweet successfully sent to program", inputValue);

      await getTweetList();
    } catch (error) {
      console.log("Error sending Tweet:", error);
    }
  };

  const getTweetList = async () => {
    try {
      const provider = getProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idl as any, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setTweetList(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        account.tweetList.map(({ twitterLink, twitterHandle }: any) => ({
          link: twitterLink,
          username: twitterHandle,
        })) || []
      );
    } catch (error) {
      console.log("Error in getTweetList: ", error);
      setTweetList(null);
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
    if (tweetList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createAccount}
          >
            Do One-Time Initialization For Tweet Program Account
          </button>
        </div>
      );
    } else {
      return (
        <div className="connected-container">
          <Input
            setInputValue={setInputValue}
            onSubmit={(event) => {
              event.preventDefault();
              sendTweet();
            }}
            value={inputValue}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "1rem",
            }}
          >
            {tweetList.map(({ link }, index) => {
              return (
                <div key={index}>
                  <Tweet url={link} />
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

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching Tweet list...");
      getTweetList();
    }
  }, [walletAddress]);

  return (
    <Screen style={{ paddingBottom: "1rem" }}>
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
        <p className="header">Tweet Portal</p>

        {walletAddress
          ? renderConnectedContainer()
          : renderNotConnectedContainer()}
      </Container>
      <Footer
        socialMedia={[
          { alt: "Twitter", href: TWITTER_LINK, logo: "/twitter-logo.svg" },
          {
            alt: "Twitter",
            href: "https://twitter.com/JoshTsch",
            logo: "/twitter-logo.svg",
          },
        ]}
      />
    </Screen>
  );
};

export default Home;
