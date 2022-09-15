import { createContext, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { fromMicroDenom } from "@utils/coins";
import { ChainConfig } from "@constant";

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

const CustomWalletContext = createContext({
    connect: () => {},
    disconnect: () => {},
    offlineSigner: null,
    signingClient: null,
    connectedWallet: null,
});

const checkKeplr = async () => {
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

const CustomWalletProvider = ({ children }) => {
    const [connectedWallet, setConnectedWallet] = useState(null);
    const [offlineSigner, setOfflineSigner] = useState(null);
    const [signingClient, setSigningClient] = useState(null);

    const connect = useCallback(async () => {
        if (!window.keplr) {
            // eslint-disable-next-line no-alert
            alert("Please install keplr extension");
        } else {
            await checkKeplr();
            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(
                        getChainConfig(ChainConfig)
                    );
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }
            }
            await window.keplr.enable(ChainConfig.chainId);
            const offlineSignerResult = await window.keplr.getOfflineSigner(
                ChainConfig.chainId
            );
            const { name: label, bech32Address: address } =
                await window.keplr.getKey(ChainConfig.chainId);
            setConnectedWallet({
                address,
                name: label,
            });
            setOfflineSigner(offlineSignerResult);
            const client = await SigningCosmWasmClient.connectWithSigner(
                ChainConfig.rpcEndpoint,
                offlineSignerResult,
                {
                    gassPrice: GasPrice.fromString(
                        `${ChainConfig.gasPrice}${ChainConfig.microDenom}`
                    ),
                }
            );
            setSigningClient(client);
        }
    }, []);

    const disconnect = useCallback(() => {
        setConnectedWallet(null);
        setOfflineSigner(null);
        setSigningClient(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            connect,
            disconnect,
            offlineSigner,
            signingClient,
            connectedWallet,
        }),
        [connect, disconnect, offlineSigner, signingClient, connectedWallet]
    );

    return (
        <CustomWalletContext.Provider value={contextValue}>
            {children}
        </CustomWalletContext.Provider>
    );
};

CustomWalletProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { CustomWalletContext, CustomWalletProvider };
