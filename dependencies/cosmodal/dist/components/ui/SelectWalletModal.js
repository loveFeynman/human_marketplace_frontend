"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectWalletModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(
    require("styled-components")
);
const BaseModal_1 = require("./BaseModal");
const SelectWalletModal = (_a) => {
    var { wallets, selectWallet, classNames } = _a,
        props = tslib_1.__rest(_a, ["wallets", "selectWallet", "classNames"]);
    return react_1.default.createElement(
        BaseModal_1.BaseModal,
        Object.assign(
            { classNames: classNames, title: "Connect your wallet" },
            props
        ),
        react_1.default.createElement(
            WalletList,
            {
                className:
                    classNames === null || classNames === void 0
                        ? void 0
                        : classNames.walletList,
            },
            wallets.map((wallet) =>
                react_1.default.createElement(
                    WalletRow,
                    {
                        key: wallet.type,
                        className:
                            classNames === null || classNames === void 0
                                ? void 0
                                : classNames.wallet,
                        onClick: (e) => {
                            e.preventDefault();
                            selectWallet(wallet);
                        },
                    },
                    react_1.default.createElement(WalletIconImg, {
                        alt: "keplr logo",
                        className:
                            classNames === null || classNames === void 0
                                ? void 0
                                : classNames.walletImage,
                        src: wallet.imageUrl,
                    }),
                    react_1.default.createElement(
                        WalletInfo,
                        {
                            className:
                                classNames === null || classNames === void 0
                                    ? void 0
                                    : classNames.walletInfo,
                        },
                        react_1.default.createElement(
                            WalletName,
                            {
                                className:
                                    classNames === null || classNames === void 0
                                        ? void 0
                                        : classNames.walletName,
                            },
                            wallet.name
                        ),
                        react_1.default.createElement(
                            WalletDescription,
                            {
                                className:
                                    classNames === null || classNames === void 0
                                        ? void 0
                                        : classNames.walletDescription,
                            },
                            wallet.description
                        )
                    )
                )
            )
        )
    );
};
exports.SelectWalletModal = SelectWalletModal;
const WalletList = styled_components_1.default.div`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  width:100%;
  margin-top:2rem;
`;
const WalletRow = styled_components_1.default.div`
  border-radius: 1rem;
  padding: 2rem;
  width:50%;
  display: flex;
  flex-direction:column;
  align-items: center;
  background-color: rgb(229, 231, 233);
  &:hover {
    cursor: pointer;
    background-color: rgb(215, 219, 221);
  }
`;
const WalletIconImg = styled_components_1.default.img`
  width: 4.5rem;
  height: 4.5rem;
  margin-bottom: 1rem;
`;
const WalletInfo = styled_components_1.default.div`
  display: flex;
  flex-direction: column;
  text-align:center;
`;
const WalletName = styled_components_1.default.div`
  color: black;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.75rem;
`;
const WalletDescription = styled_components_1.default.div`
  margin-top: 0.25rem;
  color: rgb(75 85 99);
`;
//# sourceMappingURL=SelectWalletModal.js.map
