"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubheader = exports.BaseModal = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_modal_1 = tslib_1.__importDefault(require("react-modal"));
const styled_components_1 = tslib_1.__importDefault(
    require("styled-components")
);
const CloseIcon_1 = require("./CloseIcon");
const BaseModal = ({
    isOpen,
    onClose,
    title,
    maxWidth = "50rem",
    classNames,
    closeIcon,
    children,
}) => {
    var _a, _b;
    // ReactModal accessibility.
    (0, react_1.useEffect)(() => {
        react_modal_1.default.setAppElement("body");
    }, []);
    return react_1.default.createElement(
        react_modal_1.default,
        {
            className:
                (_a =
                    classNames === null || classNames === void 0
                        ? void 0
                        : classNames.modalContent) !== null && _a !== void 0
                    ? _a
                    : "_",
            contentElement: (props, children) =>
                react_1.default.createElement(
                    ModalContent,
                    Object.assign({ maxWidth: maxWidth }, props),
                    children
                ),
            isOpen: isOpen,
            onRequestClose: (e) => {
                e.preventDefault();
                onClose === null || onClose === void 0 ? void 0 : onClose();
            },
            overlayClassName:
                (_b =
                    classNames === null || classNames === void 0
                        ? void 0
                        : classNames.modalOverlay) !== null && _b !== void 0
                    ? _b
                    : "_",
            overlayElement: (props, children) =>
                react_1.default.createElement(
                    ModalOverlay,
                    Object.assign({}, props),
                    children
                ),
        },
        react_1.default.createElement(
            react_1.default.Fragment,
            null,
            typeof title === "string"
                ? react_1.default.createElement(
                      ModalHeader,
                      {
                          className:
                              classNames === null || classNames === void 0
                                  ? void 0
                                  : classNames.modalHeader,
                      },
                      title
                  )
                : title,
            onClose &&
                react_1.default.createElement(
                    ModalCloseButton,
                    {
                        className:
                            classNames === null || classNames === void 0
                                ? void 0
                                : classNames.modalCloseButton,
                        onClick: onClose,
                    },
                    closeIcon !== null && closeIcon !== void 0
                        ? closeIcon
                        : react_1.default.createElement(CloseIcon_1.CloseIcon, {
                              height: 26,
                              width: 26,
                          })
                ),
            children
        )
    );
};
exports.BaseModal = BaseModal;
const ModalContent = styled_components_1.default.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 2.5rem;
  padding-bottom: 3rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  background: white;
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  outline: none;
  cursor: auto;

  @media (max-width: 768px) {
    width: calc(100% - 40px);
  }
`;
const ModalOverlay = styled_components_1.default.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const ModalHeader = styled_components_1.default.div`
  color: rgb(31, 41, 55);
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.75rem;
`;
exports.ModalSubheader = styled_components_1.default.div`
  color: rgb(31, 41, 55);
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.25rem;
`;
const ModalCloseButton = styled_components_1.default.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  cursor: pointer;
`;
//# sourceMappingURL=BaseModal.js.map
