"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeplrWalletConnectV1 = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@keplr-wallet/common");
const provider_1 = require("@keplr-wallet/provider");
const browser_utils_1 = require("@walletconnect/browser-utils");
const utils_1 = require("@walletconnect/utils");
const axios_1 = tslib_1.__importDefault(require("axios"));
const buffer_1 = require("buffer");
const deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
// VersionFormatRegExp checks if a chainID is in the format required for parsing versions
// The chainID should be in the form: `{identifier}-{version}`
const ChainVersionFormatRegExp = /(.+)-([\d]+)/;
function parseChainId(chainId) {
    const split = chainId.split(ChainVersionFormatRegExp).filter(Boolean);
    if (split.length !== 2) {
        return {
            identifier: chainId,
            version: 0,
        };
    }
    else {
        return { identifier: split[0], version: parseInt(split[1]) };
    }
}
class KeplrWalletConnectV1 {
    constructor(connector, chainInfos, options = {}) {
        var _a;
        this.connector = connector;
        this.chainInfos = chainInfos;
        // When creating a new WalletConnect session, the user will be taken to
        // Keplr Mobile via a deep link. The session is established immediately
        // with no further interaction, and the next step is to enable the chain.
        // Enabling the chain will prompt the user to approve the chain, which
        // occurs in the background once the mobile app is opened. Then it will
        // tell them to go back to the browser, and on returning to the browser,
        // they will see a second deep link prompt, a result of the enable
        // request that occurred in the background previously. When establishing
        // a new WalletConnect session, let's make sure we don't prompt the user
        // to open the app twice.
        this.dontOpenAppOnEnable = false;
        this.version = "0.9.0";
        this.mode = "walletconnect";
        this.defaultOptions = {};
        this.onCallReqeust = (error, payload) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (error) {
                console.log(error);
                return;
            }
            if (!payload) {
                return;
            }
            if (payload.method === "keplr_keystore_may_changed_event_wallet_connect_v1") {
                const param = payload.params[0];
                if (!param) {
                    return;
                }
                const lastSeenKeys = yield this.getAllLastSeenKey();
                if (!lastSeenKeys) {
                    return;
                }
                const mayChangedKeyMap = {};
                for (const mayChangedKey of param.keys) {
                    mayChangedKeyMap[mayChangedKey.chainIdentifier] = {
                        address: mayChangedKey.address,
                        algo: param.algo,
                        bech32Address: mayChangedKey.bech32Address,
                        isNanoLedger: param.isNanoLedger,
                        name: param.name,
                        pubKey: mayChangedKey.pubKey,
                    };
                }
                let hasChanged = false;
                for (const chainId of Object.keys(lastSeenKeys)) {
                    const savedKey = lastSeenKeys[chainId];
                    if (savedKey) {
                        const { identifier } = parseChainId(chainId);
                        const mayChangedKey = mayChangedKeyMap[identifier];
                        if (mayChangedKey) {
                            if (mayChangedKey.algo !== savedKey.algo ||
                                mayChangedKey.name !== savedKey.name ||
                                mayChangedKey.isNanoLedger !== savedKey.isNanoLedger ||
                                mayChangedKey.address !== savedKey.address ||
                                mayChangedKey.bech32Address !== savedKey.bech32Address ||
                                mayChangedKey.pubKey !== savedKey.pubKey) {
                                hasChanged = true;
                                lastSeenKeys[chainId] = mayChangedKey;
                            }
                        }
                    }
                }
                if (hasChanged) {
                    yield this.saveAllLastSeenKey(lastSeenKeys);
                    window.dispatchEvent(new Event("keplr_keystorechange"));
                }
            }
        });
        this.kvStore =
            (_a = options.kvStore) !== null && _a !== void 0 ? _a : new common_1.IndexedDBKVStore("keplr_wallet_connect");
        this.onBeforeSendRequest = options.onBeforeSendRequest;
        this.onAfterSendRequest = options.onAfterSendRequest;
        connector.on("disconnect", () => {
            this.clearSaved();
        });
        connector.on("call_request", this.onCallReqeust);
    }
    clearSaved() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.kvStore.set(this.getKeyHasEnabled(), null),
                this.kvStore.set(this.getKeyLastSeenKey(), null),
            ]);
        });
    }
    sendCustomRequest(request, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // If mobile, attempt to open app to approve request.
            if ((0, browser_utils_1.isMobile)()) {
                console.log(request);
                switch (request.method) {
                    case "keplr_enable_wallet_connect_v1": {
                        if (this.dontOpenAppOnEnable)
                            break;
                        // Fall through to open the app.
                    }
                    // eslint-disable-next-line no-fallthrough
                    case "keplr_sign_amino_wallet_connect_v1":
                        // Prompt to open the app.
                        window.location.href = (0, browser_utils_1.isAndroid)()
                            ? "intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;"
                            : "keplrwallet://wcV1";
                }
            }
            if (this.onBeforeSendRequest) {
                yield this.onBeforeSendRequest(request, options);
            }
            const res = yield this.connector.sendCustomRequest(request, options);
            if (this.onAfterSendRequest) {
                yield this.onAfterSendRequest(res, request, options);
            }
            return res;
        });
    }
    enable(chainIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof chainIds === "string") {
                chainIds = [chainIds];
            }
            const hasEnabledChainIds = yield this.getHasEnabledChainIds();
            let allEnabled = true;
            for (const chainId of chainIds) {
                if (hasEnabledChainIds.indexOf(chainId) < 0) {
                    allEnabled = false;
                    break;
                }
            }
            if (allEnabled) {
                return;
            }
            yield this.sendCustomRequest({
                id: (0, utils_1.payloadId)(),
                jsonrpc: "2.0",
                method: "keplr_enable_wallet_connect_v1",
                params: chainIds,
            });
            yield this.saveHasEnabledChainIds(chainIds);
        });
    }
    getKeyHasEnabled() {
        return `${this.connector.session.key}-enabled`;
    }
    getHasEnabledChainIds() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.kvStore.get(this.getKeyHasEnabled()))) !== null && _a !== void 0 ? _a : [];
        });
    }
    saveHasEnabledChainIds(chainIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hasEnabledChainIds = yield this.getHasEnabledChainIds();
            for (const chainId of chainIds) {
                if (hasEnabledChainIds.indexOf(chainId) < 0) {
                    hasEnabledChainIds.push(chainId);
                }
            }
            yield this.kvStore.set(this.getKeyHasEnabled(), hasEnabledChainIds);
        });
    }
    enigmaDecrypt(_chainId, _ciphertext, _nonce) {
        throw new Error("Not yet implemented");
    }
    enigmaEncrypt(_chainId, _contractCodeHash, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    _msg) {
        throw new Error("Not yet implemented");
    }
    experimentalSuggestChain(_chainInfo) {
        throw new Error("Not yet implemented");
    }
    getEnigmaPubKey(_chainId) {
        throw new Error("Not yet implemented");
    }
    getEnigmaTxEncryptionKey(_chainId, _nonce) {
        throw new Error("Not yet implemented");
    }
    getEnigmaUtils(_chainId) {
        throw new Error("Not yet implemented");
    }
    getKey(chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lastSeenKey = yield this.getLastSeenKey(chainId);
            if (lastSeenKey) {
                return {
                    address: buffer_1.Buffer.from(lastSeenKey.address, "hex"),
                    algo: lastSeenKey.algo,
                    bech32Address: lastSeenKey.bech32Address,
                    isNanoLedger: lastSeenKey.isNanoLedger,
                    name: lastSeenKey.name,
                    pubKey: buffer_1.Buffer.from(lastSeenKey.pubKey, "hex"),
                };
            }
            const response = (yield this.sendCustomRequest({
                id: (0, utils_1.payloadId)(),
                jsonrpc: "2.0",
                method: "keplr_get_key_wallet_connect_v1",
                params: [chainId],
            }))[0];
            yield this.saveLastSeenKey(chainId, response);
            return {
                address: buffer_1.Buffer.from(response.address, "hex"),
                algo: response.algo,
                bech32Address: response.bech32Address,
                isNanoLedger: response.isNanoLedger,
                name: response.name,
                pubKey: buffer_1.Buffer.from(response.pubKey, "hex"),
            };
        });
    }
    getKeyLastSeenKey() {
        return `${this.connector.session.key}-key`;
    }
    getLastSeenKey(chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const saved = yield this.getAllLastSeenKey();
            return saved ? saved[chainId] : undefined;
        });
    }
    getAllLastSeenKey() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.kvStore.get(this.getKeyLastSeenKey());
        });
    }
    saveAllLastSeenKey(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set(this.getKeyLastSeenKey(), data);
        });
    }
    saveLastSeenKey(chainId, response) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const saved = (_a = (yield this.getAllLastSeenKey())) !== null && _a !== void 0 ? _a : {};
            saved[chainId] = response;
            yield this.saveAllLastSeenKey(saved);
        });
    }
    signArbitrary(_chainId, _signer, _data) {
        throw new Error("Not yet implemented");
    }
    verifyArbitrary(_chainId, _signer, _data, _signature) {
        throw new Error("Not yet implemented");
    }
    getOfflineSigner(chainId) {
        return new provider_1.CosmJSOfflineSigner(chainId, this);
    }
    getOfflineSignerAuto(chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = yield this.getKey(chainId);
            return key.isNanoLedger
                ? new provider_1.CosmJSOfflineSignerOnlyAmino(chainId, this)
                : new provider_1.CosmJSOfflineSigner(chainId, this);
        });
    }
    getOfflineSignerOnlyAmino(chainId) {
        return new provider_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
    }
    getSecret20ViewingKey(_chainId, _contractAddress) {
        throw new Error("Not yet implemented");
    }
    sendTx(chainId, tx, mode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chainInfo = this.chainInfos.find((chainInfo) => chainInfo.chainId === chainId);
            if (!chainInfo)
                throw new Error("No chain info found.");
            const restInstance = axios_1.default.create({
                baseURL: chainInfo.rest,
            });
            const isProtoTx = buffer_1.Buffer.isBuffer(tx) || tx instanceof Uint8Array;
            const params = isProtoTx
                ? {
                    tx_bytes: buffer_1.Buffer.from(tx).toString("base64"),
                    mode: (() => {
                        switch (mode) {
                            case "async":
                                return "BROADCAST_MODE_ASYNC";
                            case "block":
                                return "BROADCAST_MODE_BLOCK";
                            case "sync":
                                return "BROADCAST_MODE_SYNC";
                            default:
                                return "BROADCAST_MODE_UNSPECIFIED";
                        }
                    })(),
                }
                : {
                    tx,
                    mode: mode,
                };
            const result = yield restInstance.post(isProtoTx ? "/cosmos/tx/v1beta1/txs" : "/txs", params);
            const txResponse = isProtoTx ? result.data["tx_response"] : result.data;
            if (txResponse.code != null && txResponse.code !== 0) {
                throw new Error(txResponse["raw_log"]);
            }
            return buffer_1.Buffer.from(txResponse.txhash, "hex");
        });
    }
    signAmino(chainId, signer, signDoc, signOptions = {}) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.sendCustomRequest({
                id: (0, utils_1.payloadId)(),
                jsonrpc: "2.0",
                method: "keplr_sign_amino_wallet_connect_v1",
                params: [
                    chainId,
                    signer,
                    signDoc,
                    (0, deepmerge_1.default)((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions),
                ],
            }))[0];
        });
    }
    signDirect(_chainId, _signer, _signDoc, _signOptions = {}) {
        throw new Error("Not yet implemented");
    }
    suggestToken(_chainId, _contractAddress, _viewingKey) {
        throw new Error("Not yet implemented");
    }
}
exports.KeplrWalletConnectV1 = KeplrWalletConnectV1;
//# sourceMappingURL=walletconnect-keplr.js.map