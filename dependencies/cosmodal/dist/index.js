"use strict";
// Fix Safari's nonexistent browser.storage https://github.com/chainapsis/keplr-wallet/blob/4726a96b9663f17b91c5d6b0448bf85ebb4a678a/packages/common/src/kv-store/extension.ts
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
if (typeof window !== "undefined" &&
    typeof browser !== "undefined" &&
    typeof browser.storage === "undefined") {
    browser.storage = { local: { get: undefined, set: undefined } };
}
tslib_1.__exportStar(require("./components"), exports);
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map