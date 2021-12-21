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

const getNFTIds = async ({
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

  const txn = await contract.walletOfOwner(currentAccount);
  const remap = txn.map((thing: BigNumber) => thing.toNumber());
  cb(remap);

  setLoading(false);
};

type UseGetNFTMetadataArgs = Omit<
  FetchNFTMetadataArgs,
  "currentAccount" | "setLoading" | "cb"
>;

export function useGetNFTIds({ abi, contractAddress }: UseGetNFTMetadataArgs) {
  const { currentAccount, setLoading, setNftIds } = useContext(
    EthereumWalletContext
  );

  useEffect(() => {
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);

      getNFTIds({
        abi,
        cb: (txn) => {
          console.log(txn);
          setNftIds(txn);
        },
        contractAddress,
        currentAccount,
        setLoading,
      });
    }
  }, [abi, contractAddress, currentAccount, setLoading, setNftIds]);
}
