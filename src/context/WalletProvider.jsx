import PropTypes from "prop-types";
import { WalletManagerProvider, WalletType } from "@noahsaso/cosmodal";
import { ChainConfig } from "@constant";
import { fromMicroDenom } from "@utils/coins";

const COIN_TYPE = 118;

const getChainConfig = (config) => {
    const coinMinimalDenom = config.microDenom;
    const coinDecimals = Number.parseInt(config.coinDecimals, 10);
    const { coinGeckoId } = config;
    const { chainId } = config;
    const { chainName } = config;
    const { rpcEndpoint } = config;
    const { restEndpoint } = config;
    const addrPrefix = config.addressPrefix;
    const gasPrice = Number.parseFloat(config.gasPrice);
    const coin = fromMicroDenom(coinMinimalDenom);
    const coinDenom = coin.toUpperCase();

    return {
        chainId,
        chainName,
        rpc: rpcEndpoint,
        rest: restEndpoint,
        bip44: {
            coinType: COIN_TYPE,
        },
        bech32Config: {
            bech32PrefixAccAddr: addrPrefix,
            bech32PrefixAccPub: `${addrPrefix}pub`,
            bech32PrefixValAddr: `${addrPrefix}valoper`,
            bech32PrefixValPub: `${addrPrefix}valoperpub`,
            bech32PrefixConsAddr: `${addrPrefix}valcons`,
            bech32PrefixConsPub: `${addrPrefix}valconspub`,
        },
        currencies: [
            {
                coinDenom,
                coinMinimalDenom,
                coinDecimals,
            },
        ],
        feeCurrencies: [
            {
                coinDenom,
                coinMinimalDenom,
                coinDecimals,
                coinGeckoId,
            },
        ],
        stakeCurrency: {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            coinGeckoId,
        },
        coinType: COIN_TYPE,
        gasPriceStep: {
            low: gasPrice / 2,
            average: gasPrice,
            high: gasPrice * 2,
        },
    };
};

export const checkKeplr = async () => {
    const keplrWallet = await (async () => {
        let keplr = null;
        if (window.keplr) {
            keplr = window.keplr;
        } else if (document.readyState === "complete") {
            keplr = window.keplr;
        } else {
            keplr = await new Promise((resolve) => {
                const documentStateChange = (event) => {
                    if (
                        event.target &&
                        event.target.readyState === "complete"
                    ) {
                        resolve(window.keplr);
                        document.removeEventListener(
                            "readystatechange",
                            documentStateChange
                        );
                    }
                };
                document.addEventListener(
                    "readystatechange",
                    documentStateChange
                );
            });
        }
        return keplr;
    })();
    if (keplrWallet) {
        await keplrWallet.experimentalSuggestChain(getChainConfig(ChainConfig));
    }
};

const WalletProvider = ({ children }) => (
    <WalletManagerProvider
        defaultChainId={ChainConfig.chainId}
        enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
        localStorageKey="keplr-wallet"
        walletConnectClientMeta={{
            name: "Humans.ai",
            description: "Humans.ai",
            url: "",
            icons: [],
        }}
        chainInfoOverrides={[
            {
                rest: ChainConfig.restEndpoint,
                rpc: ChainConfig.rpcEndpoint,
                chainId: ChainConfig.chainId,
                chainName: ChainConfig.chainName,
            },
        ]}
        classNames={{
            modalOverlay: "cosmodal-overlay",
            modalContent: "cosmodal-content",
            modalHeader: "cosmodal-header",
            walletList: "cosmodal-wallet-list",
            wallet: "cosmodal-wallet-item",
            walletImage: "cosmodal-wallet-image",
            walletInfo: "cosmodal-wallet-info",
            walletName: "cosmodal-wallet-name",
            walletDescription: "cosmodal-wallet-description",
        }}
    >
        {children}
    </WalletManagerProvider>
);

WalletProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default WalletProvider;
