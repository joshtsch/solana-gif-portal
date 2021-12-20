/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber, ethers } from "ethers";
import { useContext, useEffect } from "react";
import { CurrentAccount, EthereumWalletContext, SetLoading } from "../context";

interface FetchNFTMetadataArgs {
  abi: any;
  cb: (txn: any) => void;
  contractAddress: string;
  currentAccount: CurrentAccount;
  setLoading: SetLoading;
}

const fetchNFTMetadata = async ({
  abi,
  cb,
  contractAddress,
  currentAccount,
  setLoading,
}: FetchNFTMetadataArgs) => {
  console.log("Checking for Character NFT on address:", currentAccount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const txn = await contract.tokenURI(464);
  console.log(txn);
  // if (txn.name) {
  //   console.log("User has character NFT");
  cb(txn);
  // setCharacterNFT(transformCharacterData(txn));
  // } else {
  //   console.log("No character NFT found");
  // }

  setLoading(false);
};

type UseGetNFTMetadataArgs = Omit<
  FetchNFTMetadataArgs,
  "currentAccount" | "setLoading" | "cb"
>;

export function useGetNFTMetadata({
  abi,
  contractAddress,
}: UseGetNFTMetadataArgs) {
  const { currentAccount, setLoading, setNfts } = useContext(
    EthereumWalletContext
  );

  useEffect(() => {
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);

      fetchNFTMetadata({
        abi,
        cb: (txn) => {
          console.log(txn);
          setNfts([{ uri: txn }]);
        },
        contractAddress,
        currentAccount,
        setLoading,
      });
    }
  }, [abi, contractAddress, currentAccount, setLoading, setNfts]);
}
