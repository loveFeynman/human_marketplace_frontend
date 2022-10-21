"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectModal = void 0;
const tslib_1 = require("tslib");
const browser_utils_1 = require("@walletconnect/browser-utils");
const qrcode_react_1 = tslib_1.__importDefault(require("qrcode.react"));
const react_1 = tslib_1.__importStar(require("react"));
const BaseModal_1 = require("./BaseModal");
const IOS_KEPLR_MOBILE_URL = "itms-apps://itunes.apple.com/app/1567851089";
const WalletConnectModal = (_a) => {
    var { isOpen, uri, classNames, reset } = _a, props = tslib_1.__rest(_a, ["isOpen", "uri", "classNames", "reset"]);
    const isMobile = (0, react_1.useMemo)(() => (0, browser_utils_1.isMobile)(), []);
    const isAndroid = (0, react_1.useMemo)(() => (0, browser_utils_1.isAndroid)(), []);
    // Defined if isMobile is true.
    const navigateToAppURL = (0, react_1.useMemo)(() => isMobile
        ? isAndroid
            ? `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`
            : `keplrwallet://wcV1?${uri}`
        : undefined, [isMobile, isAndroid, uri]);
    // Open app if mobile URL is available.
    (0, react_1.useEffect)(() => {
        if (!isOpen || !navigateToAppURL)
            return;
        // Slight delay so they can read the modal.
        const timeout = setTimeout(() => {
            window.location.href = navigateToAppURL;
        }, 2000);
        return () => clearTimeout(timeout);
    }, [navigateToAppURL, isOpen]);
    const [qrShowing, setQrShowing] = (0, react_1.useState)(!isMobile);
    // Show mobile help if timeout is reached.
    const [showMobileHelp, setShowMobileHelp] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!isMobile || !isOpen) {
            setShowMobileHelp(false);
            return;
        }
        const timeout = setTimeout(() => setShowMobileHelp(true), 5000);
        return () => clearTimeout(timeout);
    }, [isOpen, isMobile, setShowMobileHelp]);
    return (react_1.default.createElement(BaseModal_1.BaseModal, Object.assign({ classNames: classNames, isOpen: isOpen, maxWidth: "24rem", title: isMobile ? "Connect to Mobile Wallet" : "Scan QR Code" }, props),
        !!navigateToAppURL && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("p", { className: classNames === null || classNames === void 0 ? void 0 : classNames.textContent, style: { marginBottom: "1rem" } },
                react_1.default.createElement("a", { href: navigateToAppURL, style: { textDecoration: "underline" } }, "Open your mobile wallet"),
                " ",
                "and accept the connection request."),
            react_1.default.createElement("p", { className: classNames === null || classNames === void 0 ? void 0 : classNames.textContent, style: { marginBottom: showMobileHelp ? "1rem" : "1.5rem" } },
                "If you don't have Keplr Mobile installed,",
                " ",
                react_1.default.createElement("a", { href: isAndroid ? navigateToAppURL : IOS_KEPLR_MOBILE_URL, style: { textDecoration: "underline" } }, "click here to install it"),
                ". You can also scan the QR code at the bottom from another device with Keplr Mobile installed."),
            showMobileHelp && (react_1.default.createElement("p", { className: classNames === null || classNames === void 0 ? void 0 : classNames.textContent, style: { marginBottom: "1.5rem" } },
                "If nothing shows up in your mobile wallet, or nothing happened once you accepted,",
                " ",
                react_1.default.createElement("button", { onClick: reset, style: { textDecoration: "underline", display: "inline" } }, "click here to reset"),
                " ",
                "and try connecting again. Refresh the page if the problem persists.")),
            react_1.default.createElement("button", { onClick: () => setQrShowing((s) => !s), style: { textAlign: "left" } },
                react_1.default.createElement(BaseModal_1.ModalSubheader, { className: classNames === null || classNames === void 0 ? void 0 : classNames.modalSubheader, style: {
                        marginBottom: qrShowing ? "1rem" : 0,
                        textDecoration: "underline",
                    } },
                    qrShowing ? "Hide" : "Show",
                    " QR Code")))),
        !!uri && qrShowing && (react_1.default.createElement(qrcode_react_1.default, { size: 500, style: { width: "100%", height: "100%" }, value: uri }))));
};
exports.WalletConnectModal = WalletConnectModal;
//# sourceMappingURL=WalletConnectModal.js.map