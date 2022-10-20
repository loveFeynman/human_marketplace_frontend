"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("@testing-library/react");
const react_2 = tslib_1.__importDefault(require("react"));
const test_utils_1 = require("react-dom/test-utils");
const components_1 = require("../components");
const types_1 = require("../types");
const DisplayStatus = () => {
    const { status } = (0, components_1.useWalletManager)();
    (0, components_1.useWallet)();
    return react_2.default.createElement("p", null, status);
};
describe("display status", () => {
    beforeAll(() => (0, test_utils_1.act)(() => {
        (0, react_1.render)(react_2.default.createElement(components_1.WalletManagerProvider, { defaultChainId: types_1.ChainInfoID.Juno1, enabledWalletTypes: [types_1.WalletType.Keplr, types_1.WalletType.WalletConnectKeplr] },
            react_2.default.createElement(DisplayStatus, null)));
    }));
    it("should display the status in the DOM", () => {
        expect(react_1.screen.getByText(types_1.WalletConnectionStatus.ReadyForConnection)).toBeInTheDocument();
    });
    afterAll(react_1.cleanup);
});
//# sourceMappingURL=display_status.test.js.map