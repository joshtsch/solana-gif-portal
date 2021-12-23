import { Container, Footer, NavBar, Screen } from "@joshtsch/legos";
import { NextPage } from "next";
import Image from "next/image";
import { useContext, useEffect } from "react";
import Loading from "react-loading";
import useSWR from "swr";
import { NftCard } from "../components/NftCard";
import { EthereumWalletContext } from "../context";
import goonzContractAbi from "../contracts/CryptoonGoonzAbi.json";
import { useCheckIfWalletIsConnected, useGetNFTIds } from "../hooks";

const fetcher = (url: string, tokenIds: number[]) =>
  fetch(url, { method: "POST", body: JSON.stringify({ tokenIds }) }).then(
    (res) => res.json()
  );

const Goonz: NextPage = () => {
  const contractAddress = "0x0322F6f11A94CFB1b5B6E95E059d8DEB2bf17D6A";

  useCheckIfWalletIsConnected();
  useGetNFTIds({
    abi: goonzContractAbi,
    contractAddress,
  });

  const { currentAccount, setCurrentAccount, nftIds, loading, setLoading } =
    useContext(EthereumWalletContext);
  const { data, error } = useSWR(nftIds ? "/api/hello" : null, (url) =>
    fetcher(url, nftIds || [])
  );

  // if (error) return <div>failed to load</div>;
  useEffect(() => {
    if (!data) {
      setLoading(true);
    }

    setLoading(false);
  }, [data, setLoading]);

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
    <Screen style={{ paddingBottom: "1rem" }}>
      {currentAccount && <NavBar walletAddress={currentAccount} />}
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
        {!currentAccount && (
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${
              data?.nfts.length < 3 ? data.nfts.length : 3
            }, minmax(0, 1fr))`,
            gap: "3rem",
          }}
        >
          {loading && <Loading type="spinningBubbles" color="#fff" />}
          {data?.nfts.map((nft: string, idx: number) => (
            <NftCard
              nft={nft}
              key={nft}
              tokenId={nftIds ? nftIds[idx] : undefined}
            />
          ))}
        </div>
      </Container>
      <Footer
        socialMedia={[
          {
            href: "https://twitter.com/JoshTsch",
            text: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  alt={"@JoshTsch Twitter Link"}
                  src="/twitter-logo.svg"
                  width={35}
                  height={35}
                />
                {"Built by @JoshTsch"}
              </div>
            ),
          },
        ]}
      />
    </Screen>
  );
};

export default Goonz;
