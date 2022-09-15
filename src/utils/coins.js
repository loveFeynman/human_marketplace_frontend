export function fromMicroAmount(amount, coinDecimals) {
    return String(
        Number.parseInt(amount, 10) / 10 ** Number.parseInt(coinDecimals, 10)
    );
}

export function fromMicroDenom(udenom) {
    return udenom.replace("u", "");
}

export function fromMicroCoin(coin, coinDecimals) {
    return {
        amount: fromMicroAmount(coin.amount, coinDecimals),
        denom: fromMicroDenom(coin.denom),
    };
}

export function toMicroAmount(amount, coinDecimals) {
    return String(
        Number.parseFloat(amount) * 10 ** Number.parseInt(coinDecimals, 10)
    );
}

export function toMicroDenom(denom) {
    return `u${denom}`;
}

export function toMicroCoin(coin, coinDecimals) {
    return {
        amount: toMicroAmount(coin.amount, coinDecimals),
        denom: toMicroDenom(coin.denom),
    };
}
