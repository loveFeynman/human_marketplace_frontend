"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoSignDocDecoder = void 0;
const proto_1 = require("../proto");
const codec_1 = require("../codec");
class ProtoSignDocDecoder {
    constructor(signDoc, protoCodec = codec_1.defaultProtoCodec) {
        this.signDoc = signDoc;
        this.protoCodec = protoCodec;
    }
    static decode(bytes) {
        return new ProtoSignDocDecoder(proto_1.cosmos.tx.v1beta1.SignDoc.decode(bytes));
    }
    get txBody() {
        if (!this._txBody) {
            this._txBody = proto_1.cosmos.tx.v1beta1.TxBody.decode(this.signDoc.bodyBytes);
        }
        return this._txBody;
    }
    get txMsgs() {
        const msgs = [];
        for (const msg of this.txBody.messages) {
            msgs.push(this.protoCodec.unpackAny(msg));
        }
        return msgs;
    }
    get authInfo() {
        if (!this._authInfo) {
            this._authInfo = proto_1.cosmos.tx.v1beta1.AuthInfo.decode(this.signDoc.authInfoBytes);
        }
        return this._authInfo;
    }
    get chainId() {
        return this.signDoc.chainId;
    }
    get accountNumber() {
        return this.signDoc.accountNumber.toString();
    }
    toBytes() {
        return proto_1.cosmos.tx.v1beta1.SignDoc.encode(this.signDoc).finish();
    }
    toJSON() {
        return {
            txBody: Object.assign(Object.assign({}, this.txBody.toJSON()), {
                messages: this.txMsgs.map((msg) => {
                    if (msg && msg.toJSON) {
                        return msg.toJSON();
                    }
                    return msg;
                }),
            }),
            authInfo: this.authInfo.toJSON(),
            chainId: this.chainId,
            accountNumber: this.accountNumber,
        };
    }
}
exports.ProtoSignDocDecoder = ProtoSignDocDecoder;
//# sourceMappingURL=index.js.map