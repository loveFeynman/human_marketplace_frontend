import { cosmos } from "../proto";
import SignDoc = cosmos.tx.v1beta1.SignDoc;
import { ProtoCodec } from "../codec";
export declare class ProtoSignDocDecoder {
    readonly signDoc: SignDoc;
    protected readonly protoCodec: ProtoCodec;
    static decode(bytes: Uint8Array): ProtoSignDocDecoder;
    protected _txBody?: cosmos.tx.v1beta1.TxBody;
    protected _authInfo?: cosmos.tx.v1beta1.AuthInfo;
    constructor(signDoc: SignDoc, protoCodec?: ProtoCodec);
    get txBody(): cosmos.tx.v1beta1.TxBody;
    get txMsgs(): any[];
    get authInfo(): cosmos.tx.v1beta1.AuthInfo;
    get chainId(): string;
    get accountNumber(): string;
    toBytes(): Uint8Array;
    toJSON(): any;
}
