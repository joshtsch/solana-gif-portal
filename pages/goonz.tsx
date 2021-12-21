import { NextPage } from "next";
import Image from "next/image";
import { useContext, useEffect } from "react";
import useSWR from "swr";
import { EthereumWalletContext } from "../context";
import goonzContractAbi from "../contracts/CryptoonGoonzAbi.json";
import {
  useCheckIfWalletIsConnected,
  useGetNFTIds,
  useGetNFTMetadata,
} from "../hooks";

const fetcher = (url: string, tokenIds: number[]) =>
  fetch(url, { method: "POST", body: JSON.stringify({ tokenIds }) }).then(
    (res) => res.json()
  );

const Goonz: NextPage = () => {
  useCheckIfWalletIsConnected();
  useGetNFTIds({
    abi: goonzContractAbi,
    contractAddress: "0x0322F6f11A94CFB1b5B6E95E059d8DEB2bf17D6A",
  });
  useGetNFTMetadata({
    abi: goonzContractAbi,
    contractAddress: "0x0322F6f11A94CFB1b5B6E95E059d8DEB2bf17D6A",
  });

  const { nftIds } = useContext(EthereumWalletContext);
  const { data, error } = useSWR(nftIds ? "/api/hello" : null, (url) =>
    fetcher(url, nftIds || [])
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      {/* {nfts?.map((nft) => {
        const src = data.image.replace(
          "ipfs://",
          "https://cloudflare-ipfs.com/ipfs/"
        );
        return (
          <Image src={src} key={nft.uri} width={645} height={587} alt="NFT" />
        );
      })} */}
      {data?.nfts.map((nft: string) => (
        <Image
          src={nft.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")}
          key={nft}
          width={645}
          height={587}
          alt="NFT"
        />
      ))}
    </div>
  );
};

export default Goonz;
