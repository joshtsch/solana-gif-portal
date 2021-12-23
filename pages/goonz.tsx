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
        <div
          style={{
            marginBottom: "3rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ height: "4rem", width: "4rem", marginLeft: "1rem" }} />
          <Image src="/Logo_edited.webp" width={300} height={129} />
          <div style={{ height: "4rem", width: "4rem", marginLeft: "1rem" }}>
            <svg fill="none" viewBox="0 0 30 30">
              <path
                style={{ fill: "rgb(32, 129, 226)" }}
                d="M13.474 2.80108C14.2729 1.85822 15.7271 1.85822 16.526 2.80108L17.4886 3.9373C17.9785 4.51548 18.753 4.76715 19.4892 4.58733L20.9358 4.23394C22.1363 3.94069 23.3128 4.79547 23.4049 6.0278L23.5158 7.51286C23.5723 8.26854 24.051 8.92742 24.7522 9.21463L26.1303 9.77906C27.2739 10.2474 27.7233 11.6305 27.0734 12.6816L26.2903 13.9482C25.8918 14.5928 25.8918 15.4072 26.2903 16.0518L27.0734 17.3184C27.7233 18.3695 27.2739 19.7526 26.1303 20.2209L24.7522 20.7854C24.051 21.0726 23.5723 21.7315 23.5158 22.4871L23.4049 23.9722C23.3128 25.2045 22.1363 26.0593 20.9358 25.7661L19.4892 25.4127C18.753 25.2328 17.9785 25.4845 17.4886 26.0627L16.526 27.1989C15.7271 28.1418 14.2729 28.1418 13.474 27.1989L12.5114 26.0627C12.0215 25.4845 11.247 25.2328 10.5108 25.4127L9.06418 25.7661C7.86371 26.0593 6.6872 25.2045 6.59513 23.9722L6.48419 22.4871C6.42773 21.7315 5.94903 21.0726 5.24777 20.7854L3.86969 20.2209C2.72612 19.7526 2.27673 18.3695 2.9266 17.3184L3.70973 16.0518C4.10824 15.4072 4.10824 14.5928 3.70973 13.9482L2.9266 12.6816C2.27673 11.6305 2.72612 10.2474 3.86969 9.77906L5.24777 9.21463C5.94903 8.92742 6.42773 8.26854 6.48419 7.51286L6.59513 6.0278C6.6872 4.79547 7.86371 3.94069 9.06418 4.23394L10.5108 4.58733C11.247 4.76715 12.0215 4.51548 12.5114 3.9373L13.474 2.80108Z"
              ></path>
              <path
                d="M13.5 17.625L10.875 15L10 15.875L13.5 19.375L21 11.875L20.125 11L13.5 17.625Z"
                fill="white"
                stroke="white"
              ></path>
            </svg>
          </div>
        </div>
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
