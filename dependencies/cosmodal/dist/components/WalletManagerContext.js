"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWallet = exports.useWalletManager = exports.WalletManagerContext = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const types_1 = require("../types");
const utils_1 = require("../utils");
exports.WalletManagerContext = (0, react_1.createContext)(null);
const useWalletManager = () => {
    const context = (0, react_1.useContext)(exports.WalletManagerContext);
    if (!context) {
        throw new Error("You forgot to use WalletManagerProvider.");
    }
    return context;
};
exports.useWalletManager = useWalletManager;
const useWallet = (chainId) => {
    const { status: managerStatus, error: managerError, connectedWallet: managerConnectedWallet, chainInfoOverrides, getSigningCosmWasmClientOptions, getSigningStargateClientOptions, } = (0, exports.useWalletManager)();
    const [chainIdStatus, setChainIdStatus] = (0, react_1.useState)(types_1.WalletConnectionStatus.Initializing);
    const [chainIdError, setChainIdError] = (0, react_1.useState)();
    const [chainIdConnectedWallet, setChainIdConnectedWallet] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (managerStatus !== types_1.WalletConnectionStatus.Connected ||
            !managerConnectedWallet ||
            !chainId) {
            // If the initial wallet client is not yet connected, this chainId
            // cannot be connected to yet and is thus still initializing.
            setChainIdStatus(types_1.WalletConnectionStatus.Initializing);
            setChainIdConnectedWallet(undefined);
            setChainIdError(undefined);
            return;
        }
        const connect = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            setChainIdStatus(types_1.WalletConnectionStatus.Connecting);
            setChainIdError(undefined);
            const chainInfo = yield (0, utils_1.getChainInfo)(chainId, chainInfoOverrides);
            setChainIdConnectedWallet(
            // TODO: Cache
            yield (0, utils_1.getConnectedWalletInfo)(managerConnectedWallet.wallet, managerConnectedWallet.walletClient, chainInfo, yield (getSigningCosmWasmClientOptions === null || getSigningCosmWasmClientOptions === void 0 ? void 0 : getSigningCosmWasmClientOptions(chainInfo)), yield (getSigningStargateClientOptions === null || getSigningStargateClientOptions === void 0 ? void 0 : getSigningStargateClientOptions(chainInfo))));
            setChainIdStatus(types_1.WalletConnectionStatus.Connected);
        });
        connect().catch((error) => {
            console.error(error);
            setChainIdError(error);
            setChainIdStatus(types_1.WalletConnectionStatus.Errored);
        });
    }, [
        managerStatus,
        managerConnectedWallet,
        chainId,
        getSigningCosmWasmClientOptions,
        getSigningStargateClientOptions,
        chainInfoOverrides,
    ]);
    const status = chainId ? chainIdStatus : managerStatus;
    const connected = status === types_1.WalletConnectionStatus.Connected;
    const error = chainId ? chainIdError : managerError;
    const connectedWallet = chainId
        ? chainIdConnectedWallet
        : managerConnectedWallet;
    return Object.assign({ status, connected, error }, connectedWallet);
};
exports.useWallet = useWallet;
//# sourceMappingURL=WalletManagerContext.js.map