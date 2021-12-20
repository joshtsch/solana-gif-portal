import { NextPage } from "next";
import { useContext } from "react";
import { EthereumWalletContext } from "../context";
import goonzContractAbi from "../contracts/CryptoonGoonzAbi.json";
import { useCheckIfWalletIsConnected, useGetNFTMetadata } from "../hooks";

const Goonz: NextPage = () => {
  useCheckIfWalletIsConnected();
  useGetNFTMetadata({
    abi: goonzContractAbi,
    contractAddress: "0x0322F6f11A94CFB1b5B6E95E059d8DEB2bf17D6A",
  });

  const { nfts } = useContext(EthereumWalletContext);

  return (
    <div>
      {nfts?.map((nft) => {
        const src = nft.uri.replace(
          "ipfs://",
          "https://cloudflare-ipfs.com/ipfs/"
        );
        console.log(src);
        // return <img src={src} key={nft.uri} />;
      })}
    </div>
  );
};

export default Goonz;
