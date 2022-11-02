"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedWalletInfo = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../types");
const getConnectedWalletInfo = (wallet, client, chainInfo, signingCosmWasmClientOptions, signingStargateClientOptions) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    // Only Keplr browser extension supports suggesting chain.
    // Not WalletConnect nor embedded Keplr Mobile web.
    if (wallet.type === types_1.WalletType.Keplr && client.mode !== "mobile-web") {
        yield client.experimentalSuggestChain(chainInfo);
    }
    yield client.enable(chainInfo.chainId);
    // Parallelize for efficiency.
    const [{ name, bech32Address: address }, offlineSigner] = yield Promise.all([
        // Get name.
        client.getKey(chainInfo.chainId),
        // Get offline signer.
        wallet.getOfflineSignerFunction(client)(chainInfo.chainId),
    ]);
    const [signingCosmWasmClient, signingStargateClient] = yield Promise.all([
        // Get CosmWasm client.
        yield (yield Promise.resolve().then(() => tslib_1.__importStar(require("@cosmjs/cosmwasm-stargate")))).SigningCosmWasmClient.connectWithSigner(chainInfo.rpc, offlineSigner, signingCosmWasmClientOptions),
        // Get Stargate client.
        yield (yield Promise.resolve().then(() => tslib_1.__importStar(require("@cosmjs/stargate")))).SigningStargateClient.connectWithSigner(chainInfo.rpc, offlineSigner, signingStargateClientOptions),
    ]);
    if (address === undefined) {
        throw new Error("Failed to retrieve wallet address.");
    }
    return {
        wallet,
        walletClient: client,
        chainInfo,
        offlineSigner,
        name,
        address,
        signingCosmWasmClient,
        signingStargateClient,
    };
});
exports.getConnectedWalletInfo = getConnectedWalletInfo;
//# sourceMappingURL=getConnectedWalletInfo.js.map