"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletManagerProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const connectors_1 = require("../connectors");
const types_1 = require("../types");
const utils_1 = require("../utils");
const ui_1 = require("./ui");
const WalletManagerContext_1 = require("./WalletManagerContext");
const WalletManagerProvider = ({ children, enabledWalletTypes, defaultChainId, chainInfoOverrides, classNames, closeIcon, renderLoader, walletConnectClientMeta, preselectedWalletType, localStorageKey, onKeplrKeystoreChangeEvent, getSigningCosmWasmClientOptions, getSigningStargateClientOptions, }) => {
    //! STATE
    const enabledWallets = (0, react_1.useMemo)(() => utils_1.Wallets.filter(({ type }) => enabledWalletTypes.includes(type)), [enabledWalletTypes]);
    const [isEmbeddedKeplrMobileWeb, setIsEmbeddedKeplrMobileWeb] = (0, react_1.useState)(false);
    // Modal State
    const [pickerModalOpen, setPickerModalOpen] = (0, react_1.useState)(false);
    const [walletEnableModalOpen, setWalletEnableModalOpen] = (0, react_1.useState)(false);
    // If set, opens QR code modal.
    const [walletConnectUri, setWalletConnectUri] = (0, react_1.useState)();
    // WalletConnect State
    const [walletConnect, setWalletConnect] = (0, react_1.useState)();
    // Call when closing QR code modal manually.
    const onQrCloseCallback = (0, react_1.useRef)();
    // Wallet connection State
    const [connectedWallet, setConnectedWallet] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    // Once mobile web is checked, we are ready to auto-connect.
    const [status, setStatus] = (0, react_1.useState)(types_1.WalletConnectionStatus.Initializing);
    // In case WalletConnect fails to load, we need to be able to retry.
    // This is done through clicking reset on the WalletConnectModal.
    const [connectingWallet, setConnectingWallet] = (0, react_1.useState)();
    const connectionAttemptRef = (0, react_1.useRef)(0);
    // Reset connection when it gets stuck somewhere.
    const [connectToWalletUponReset, setConnectToWalletUponReset] = (0, react_1.useState)();
    //! CALLBACKS
    // Retrieve chain info for initial wallet connection, throwing error if
    // not found.
    const _getDefaultChainInfo = (0, react_1.useCallback)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield (0, utils_1.getChainInfo)(defaultChainId, chainInfoOverrides); }), [defaultChainId, chainInfoOverrides]);
    // Closes modals and clears connection state.
    const _cleanupAfterConnection = (0, react_1.useCallback)((walletClient) => {
        // Close modals.
        setPickerModalOpen(false);
        setWalletConnectUri(undefined);
        setWalletEnableModalOpen(false);
        // Allow future enable requests to open the app.
        if (walletClient instanceof connectors_1.KeplrWalletConnectV1) {
            walletClient.dontOpenAppOnEnable = false;
        }
        // No longer connecting a wallet.
        setConnectingWallet(undefined);
    }, []);
    // Disconnect from connected wallet.
    const disconnect = (0, react_1.useCallback)((dontKillWalletConnect) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // Disconnect wallet.
        setConnectedWallet(undefined);
        setStatus(types_1.WalletConnectionStatus.ReadyForConnection);
        // Remove localStorage value.
        if (localStorageKey) {
            localStorage.removeItem(localStorageKey);
        }
        // Disconnect WalletConnect.
        setWalletConnect(undefined);
        if ((walletConnect === null || walletConnect === void 0 ? void 0 : walletConnect.connected) && !dontKillWalletConnect) {
            yield walletConnect.killSession();
        }
    }), [localStorageKey, walletConnect]);
    // Obtain WalletConnect if necessary, and connect to the wallet.
    const _connectToWallet = (0, react_1.useCallback)((wallet) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        setStatus(types_1.WalletConnectionStatus.Connecting);
        setError(undefined);
        setConnectingWallet(wallet);
        setPickerModalOpen(false);
        let walletClient;
        let _walletConnect = walletConnect;
        // The actual meat of enabling and getting the wallet clients.
        const finalizeWalletConnection = (newWcSession) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            // Cleared in `cleanupAfterConnection`.
            setWalletEnableModalOpen(true);
            const chainInfo = yield _getDefaultChainInfo();
            walletClient = yield wallet.getClient(chainInfo, _walletConnect);
            if (!walletClient) {
                throw new Error("Failed to retrieve wallet client.");
            }
            // Prevent double app open request.
            if (walletClient instanceof connectors_1.KeplrWalletConnectV1) {
                walletClient.dontOpenAppOnEnable = !!newWcSession;
            }
            // Save connected wallet data.
            setConnectedWallet(yield (0, utils_1.getConnectedWalletInfo)(wallet, walletClient, chainInfo, yield (getSigningCosmWasmClientOptions === null || getSigningCosmWasmClientOptions === void 0 ? void 0 : getSigningCosmWasmClientOptions(chainInfo)), yield (getSigningStargateClientOptions === null || getSigningStargateClientOptions === void 0 ? void 0 : getSigningStargateClientOptions(chainInfo))));
            // Save localStorage value.
            if (localStorageKey) {
                localStorage.setItem(localStorageKey, wallet.type);
            }
            setStatus(types_1.WalletConnectionStatus.Connected);
        });
        try {
            // Connect to WalletConnect if necessary.
            if (wallet.type === types_1.WalletType.WalletConnectKeplr) {
                // Instantiate new WalletConnect instance if necessary.
                if (!_walletConnect) {
                    _walletConnect = new (yield Promise.resolve().then(() => tslib_1.__importStar(require("@walletconnect/client")))).default({
                        bridge: "https://bridge.walletconnect.org",
                        signingMethods: [
                            "keplr_enable_wallet_connect_v1",
                            "keplr_sign_amino_wallet_connect_v1",
                        ],
                        qrcodeModal: {
                            open: (uri, cb) => {
                                // Open QR modal by setting URI.
                                setWalletConnectUri(uri);
                                onQrCloseCallback.current = cb;
                            },
                            // Occurs on disconnect, which is handled elsewhere.
                            close: () => console.log("qrcodeModal.close"),
                        },
                        // clientMeta,
                    });
                    // clientMeta in constructor is ignored for some reason, so
                    // let's set it directly :)))))))))))))
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _walletConnect._clientMeta = walletConnectClientMeta;
                    setWalletConnect(_walletConnect);
                }
                if (_walletConnect.connected) {
                    // WalletConnect already connected, nothing to do.
                    yield finalizeWalletConnection();
                }
                else {
                    // Prevent double requests by checking which connection attempt
                    // we're on before and after starting the connection attempt.
                    const currConnectionAttempt = ++connectionAttemptRef.current;
                    // Executes walletConnect's qrcodeModal.open.
                    yield _walletConnect.connect();
                    // If another connection attempt is being made, don't try to
                    // enable if connect finishes. This prevents double requests.
                    if (connectionAttemptRef.current !== currConnectionAttempt) {
                        return;
                    }
                    // Connect with new WalletConnect session.
                    yield finalizeWalletConnection(true);
                }
            }
            else {
                // No WalletConnect needed.
                yield finalizeWalletConnection();
            }
        }
        catch (err) {
            console.error(err);
            setError(err);
            setStatus(types_1.WalletConnectionStatus.Errored);
        }
        finally {
            _cleanupAfterConnection(walletClient);
        }
    }), [
        walletConnect,
        _getDefaultChainInfo,
        getSigningCosmWasmClientOptions,
        getSigningStargateClientOptions,
        localStorageKey,
        walletConnectClientMeta,
        _cleanupAfterConnection,
    ]);
    // Begin connection process, either auto-selecting a wallet or opening
    // the selection modal.
    const beginConnection = (0, react_1.useCallback)(() => {
        // We need to check if we are in the embedded Keplr Mobile web before
        // connecting, since we will force the embedded Keplr wallet if
        // possible. This will only happen if `connect` is called very quickly
        // without waiting for `state` to reach at least
        // `State.AttemptingAutoConnection`, though ideally `connect` is only
        // called once `state` reaches `State.ReadyForConnection`.
        // TODO: Add some docs about this.
        if (status === types_1.WalletConnectionStatus.Initializing) {
            throw new Error("Cannot connect while initializing.");
        }
        setStatus(types_1.WalletConnectionStatus.Connecting);
        setError(undefined);
        const automaticWalletType = preselectedWalletType ||
            // Try to fetch value from localStorage.
            (localStorageKey && localStorage.getItem(localStorageKey)) ||
            undefined;
        const skipModalWallet = 
        // Mobile web mode takes precedence over automatic wallet.
        isEmbeddedKeplrMobileWeb
            ? utils_1.KeplrWallet
            : // If only one wallet is available, skip the modal and use it.
                enabledWallets.length === 1
                    ? enabledWallets[0]
                    : // Try to find the wallet to automatically connect to if present.
                        automaticWalletType
                            ? enabledWallets.find(({ type }) => type === automaticWalletType)
                            : undefined;
        if (skipModalWallet) {
            _connectToWallet(skipModalWallet);
            return;
        }
        // If no default wallet, open modal to choose one.
        setPickerModalOpen(true);
    }, [
        status,
        preselectedWalletType,
        localStorageKey,
        isEmbeddedKeplrMobileWeb,
        enabledWallets,
        _connectToWallet,
    ]);
    // Initiate reset.
    const _reset = (0, react_1.useCallback)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield disconnect().catch(console.error);
        // Set after disconnect, since disconnect sets state to
        // ReadyForConnection.
        setStatus(types_1.WalletConnectionStatus.Resetting);
        // Try resetting all wallet state and reconnecting.
        if (connectingWallet) {
            setConnectToWalletUponReset(connectingWallet);
            _cleanupAfterConnection();
        }
        else {
            // If no wallet to reconnect to, just reload.
            window.location.reload();
        }
    }), [_cleanupAfterConnection, connectingWallet, disconnect]);
    //! EFFECTS
    // Detect if in embedded Keplr Mobile browser, and set ready after.
    (0, react_1.useEffect)(() => {
        if (status !== types_1.WalletConnectionStatus.Initializing ||
            // Only run this on a browser.
            typeof window === "undefined") {
            return;
        }
        Promise.resolve().then(() => tslib_1.__importStar(require("@keplr-wallet/stores"))).then(({ getKeplrFromWindow }) => getKeplrFromWindow())
            .then((keplr) => keplr &&
            keplr.mode === "mobile-web" &&
            setIsEmbeddedKeplrMobileWeb(true))
            .finally(() => setStatus(types_1.WalletConnectionStatus.AttemptingAutoConnection));
    }, [status]);
    // Auto connect on mount handler, after the above mobile web check.
    (0, react_1.useEffect)(() => {
        if (status !== types_1.WalletConnectionStatus.AttemptingAutoConnection ||
            // Only run this on a browser.
            typeof localStorage === "undefined") {
            return;
        }
        setStatus(types_1.WalletConnectionStatus.ReadyForConnection);
        if (
        // If inside Keplr mobile web, auto connect.
        isEmbeddedKeplrMobileWeb ||
            // If localStorage value present, auto connect.
            (localStorageKey && !!localStorage.getItem(localStorageKey))) {
            beginConnection();
        }
    }, [status, beginConnection, isEmbeddedKeplrMobileWeb, localStorageKey]);
    // Execute onQrCloseCallback if WalletConnect URI is cleared, since it
    // has now been closed.
    (0, react_1.useEffect)(() => {
        var _a;
        if (!walletConnectUri && onQrCloseCallback) {
            (_a = onQrCloseCallback.current) === null || _a === void 0 ? void 0 : _a.call(onQrCloseCallback);
            onQrCloseCallback.current = undefined;
        }
    }, [walletConnectUri, onQrCloseCallback]);
    // Attempt reconnecting to a wallet after resetting if we have set a
    // wallet to select after resetting.
    (0, react_1.useEffect)(() => {
        if (status === types_1.WalletConnectionStatus.Resetting &&
            !connectingWallet &&
            connectToWalletUponReset) {
            setConnectToWalletUponReset(undefined);
            // Updates state to Connecting.
            _connectToWallet(connectToWalletUponReset);
        }
    }, [connectingWallet, status, _connectToWallet, connectToWalletUponReset]);
    // WalletConnect disconnect listener.
    (0, react_1.useEffect)(() => {
        if (!walletConnect) {
            return;
        }
        // Detect disconnected WC session and clear wallet state.
        walletConnect.on("disconnect", () => {
            console.log("WalletConnect disconnected.");
            disconnect(true);
            _cleanupAfterConnection();
        });
    }, [_cleanupAfterConnection, disconnect, walletConnect]);
    // keplr_keystorechange event listener.
    (0, react_1.useEffect)(() => {
        if (
        // Only run this on a browser.
        typeof window === "undefined") {
            return;
        }
        const listener = (event) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            // Reconnect to wallet, since name/address may have changed.
            if (status === types_1.WalletConnectionStatus.Connected && connectedWallet) {
                _connectToWallet(connectedWallet.wallet);
            }
            // Execute callback if passed.
            onKeplrKeystoreChangeEvent === null || onKeplrKeystoreChangeEvent === void 0 ? void 0 : onKeplrKeystoreChangeEvent(event);
        });
        // Add event listener.
        window.addEventListener("keplr_keystorechange", listener);
        // Remove event listener on clean up.
        return () => {
            window.removeEventListener("keplr_keystorechange", listener);
        };
    }, [onKeplrKeystoreChangeEvent, connectedWallet, status, _connectToWallet]);
    // Memoize context data.
    const value = (0, react_1.useMemo)(() => ({
        connect: beginConnection,
        disconnect,
        connectedWallet,
        status,
        connected: status === types_1.WalletConnectionStatus.Connected,
        error,
        isEmbeddedKeplrMobileWeb,
        chainInfoOverrides,
        getSigningCosmWasmClientOptions,
        getSigningStargateClientOptions,
    }), [
        beginConnection,
        chainInfoOverrides,
        connectedWallet,
        disconnect,
        error,
        getSigningCosmWasmClientOptions,
        getSigningStargateClientOptions,
        isEmbeddedKeplrMobileWeb,
        status,
    ]);
    return (react_1.default.createElement(WalletManagerContext_1.WalletManagerContext.Provider, { value: value },
        children,
        status !== types_1.WalletConnectionStatus.Resetting && pickerModalOpen && (react_1.default.createElement(ui_1.SelectWalletModal, { classNames: classNames, closeIcon: closeIcon, isOpen: true, onClose: () => setPickerModalOpen(false), selectWallet: _connectToWallet, wallets: enabledWallets })),
        status !== types_1.WalletConnectionStatus.Resetting && !!walletConnectUri && (react_1.default.createElement(ui_1.WalletConnectModal, { classNames: classNames, closeIcon: closeIcon, isOpen: true, onClose: () => disconnect().finally(_cleanupAfterConnection), reset: _reset, uri: walletConnectUri })),
        status !== types_1.WalletConnectionStatus.Resetting && walletEnableModalOpen && (react_1.default.createElement(ui_1.EnablingWalletModal, { classNames: classNames, closeIcon: closeIcon, isOpen: true, onClose: () => setWalletEnableModalOpen(false), renderLoader: renderLoader, reset: _reset })),
        status === types_1.WalletConnectionStatus.Resetting && (react_1.default.createElement(ui_1.BaseModal, { classNames: classNames, isOpen: true, maxWidth: "24rem", title: "Resetting..." }, renderLoader === null || renderLoader === void 0 ? void 0 : renderLoader()))));
};
exports.WalletManagerProvider = WalletManagerProvider;
//# sourceMappingURL=WalletManagerProvider.js.map