export declare class UnknownMessage {
    /** Any type_url. */
    protected readonly _typeUrl: string;
    /** Any value. */
    protected readonly _value: Uint8Array;
    constructor(
    /** Any type_url. */
    _typeUrl: string, 
    /** Any value. */
    _value: Uint8Array);
    get typeUrl(): string;
    get value(): Uint8Array;
    toJSON(): {
        type_url: string;
        value: string;
    };
}
