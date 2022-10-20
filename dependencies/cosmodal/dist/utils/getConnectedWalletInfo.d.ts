import { SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClientOptions } from "@cosmjs/stargate";
import { ChainInfo } from "@keplr-wallet/types";
import { ConnectedWallet, Wallet, WalletClient } from "../types";
export declare const getConnectedWalletInfo: (wallet: Wallet, client: WalletClient, chainInfo: ChainInfo, signingCosmWasmClientOptions?: SigningCosmWasmClientOptions, signingStargateClientOptions?: SigningStargateClientOptions) => Promise<ConnectedWallet>;
//# sourceMappingURL=getConnectedWalletInfo.d.ts.map