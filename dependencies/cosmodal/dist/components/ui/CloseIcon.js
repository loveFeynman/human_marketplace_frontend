"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseIcon = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const CloseIcon = (props) =>
    react_1.default.createElement(
        "svg",
        Object.assign(
            {
                fill: "none",
                height: props.width || 16,
                viewBox: "0 0 16 16",
                width: props.width || 16,
                xmlns: "http://www.w3.org/2000/svg",
            },
            props
        ),
        react_1.default.createElement("path", {
            clipRule: "evenodd",
            d: "m9.893 11.674-1.9-1.9-1.902 1.902c-.451.451-1.176.452-1.627.002a1.16 1.16 0 0 1-.01-1.638l1.903-1.902L4.47 6.249a1.16 1.16 0 0 1-.01-1.637 1.164 1.164 0 0 1 1.648-.001l1.889 1.888 1.902-1.902a1.16 1.16 0 0 1 1.638.01c.45.45.45 1.175-.002 1.626L9.632 8.135l1.9 1.9c.45.45.46 1.186-.002 1.648a1.16 1.16 0 0 1-1.637-.01Z",
            fill: "currentColor",
            fillOpacity: 0.95,
            fillRule: "evenodd",
        })
    );
exports.CloseIcon = CloseIcon;
//# sourceMappingURL=CloseIcon.js.map
