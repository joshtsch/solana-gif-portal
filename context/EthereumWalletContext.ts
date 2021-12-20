import { Dispatch, SetStateAction, createContext } from "react";

export type CurrentAccount = string | null;
export type SetCurrentAccountAction = Dispatch<SetStateAction<CurrentAccount>>;
export type Loading = boolean;
export type SetLoading = Dispatch<SetStateAction<Loading>>;
export type NFT = { uri: string };
export type NFTs = NFT[] | null;
export type SetNFTs = Dispatch<SetStateAction<NFTs>>;

interface EthereumWalletContextType {
  currentAccount: CurrentAccount;
  setCurrentAccount: SetCurrentAccountAction;
  loading: Loading;
  setLoading: SetLoading;
  nfts: NFTs;
  setNfts: SetNFTs;
}

export const EthereumWalletContext = createContext<EthereumWalletContextType>({
  currentAccount: "",
  setCurrentAccount: () => null,
  loading: false,
  setLoading: () => null,
  nfts: [],
  setNfts: () => null,
});
