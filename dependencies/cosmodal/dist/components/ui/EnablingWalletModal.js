"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnablingWalletModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const BaseModal_1 = require("./BaseModal");
const EnablingWalletModal = (_a) => {
    var { isOpen, classNames, renderLoader, reset } = _a, props = tslib_1.__rest(_a, ["isOpen", "classNames", "renderLoader", "reset"]);
    const [showHelp, setShowHelp] = (0, react_1.useState)(false);
    // Show help if timeout is reached.
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            setShowHelp(false);
            return;
        }
        const timeout = setTimeout(() => setShowHelp(true), 5000);
        return () => clearTimeout(timeout);
    }, [isOpen, setShowHelp]);
    return (react_1.default.createElement(BaseModal_1.BaseModal, Object.assign({ classNames: classNames, isOpen: isOpen, maxWidth: "24rem", title: "Enabling Wallet..." }, props),
        showHelp && (react_1.default.createElement("p", { className: classNames === null || classNames === void 0 ? void 0 : classNames.textContent },
            "If nothing shows up in your wallet,",
            " ",
            react_1.default.createElement("button", { onClick: reset, style: { textDecoration: "underline", display: "inline" } }, "click here to reset"),
            " ",
            "and try connecting again. Refresh the page if the problem persists.")),
        renderLoader && react_1.default.createElement("div", { className: "mt-4" }, renderLoader())));
};
exports.EnablingWalletModal = EnablingWalletModal;
//# sourceMappingURL=EnablingWalletModal.js.map