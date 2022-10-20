import { ProtoSignDocDecoder } from "../decoder";
import { Coin, StdSignDoc } from "@cosmjs/launchpad";
import { cosmos } from "../proto";
export declare class SignDocWrapper {
    protected readonly signDoc: StdSignDoc | cosmos.tx.v1beta1.SignDoc;
    protected _protoSignDoc?: ProtoSignDocDecoder;
    readonly isADR36SignDoc: boolean;
    readonly mode: "amino" | "direct";
    constructor(signDoc: StdSignDoc | cosmos.tx.v1beta1.SignDoc);
    static fromAminoSignDoc(signDoc: StdSignDoc): SignDocWrapper;
    static fromDirectSignDoc(signDoc: cosmos.tx.v1beta1.SignDoc): SignDocWrapper;
    static fromDirectSignDocBytes(signDocBytes: Uint8Array): SignDocWrapper;
    clone(): SignDocWrapper;
    get protoSignDoc(): ProtoSignDocDecoder;
    get aminoSignDoc(): StdSignDoc;
    get chainId(): string;
    get memo(): string;
    get fees(): readonly Coin[];
    get gas(): number;
}
