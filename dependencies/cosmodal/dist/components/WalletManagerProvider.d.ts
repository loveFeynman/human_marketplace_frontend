import { SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClientOptions } from "@cosmjs/stargate";
import { IClientMeta } from "@walletconnect/types";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { ChainInfoOverrides, ModalClassNames, SigningClientGetter, WalletType } from "../types";
export declare type WalletManagerProviderProps = PropsWithChildren<{
    enabledWalletTypes: WalletType[];
    defaultChainId: string;
    chainInfoOverrides?: ChainInfoOverrides;
    classNames?: ModalClassNames;
    closeIcon?: ReactNode;
    walletConnectClientMeta?: IClientMeta;
    renderLoader?: () => ReactNode;
    preselectedWalletType?: `${WalletType}`;
    localStorageKey?: string;
    onKeplrKeystoreChangeEvent?: (event: Event) => unknown;
    getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>;
    getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>;
}>;
export declare const WalletManagerProvider: FunctionComponent<WalletManagerProviderProps>;
//# sourceMappingURL=WalletManagerProvider.d.ts.map