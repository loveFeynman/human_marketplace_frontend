/* eslint-disable no-nested-ternary */
/* eslint-disable no-confusing-arrow */
import { fileSizeLimit } from "@constant";

export const getFullName = (firstName, lastName) =>
    lastName
        ? firstName
            ? `${firstName} ${lastName}`
            : lastName
        : firstName || "";

export const getReducedAddress = (address) =>
    address ? `${address?.slice(0, 5)}...${address?.slice(-5)}` : "";

export const getStandardTime = (time) => {
    const interval = Date.now() / 1000 - Number(time);
    if (interval < 3600) return `${(interval / 60).toFixed(0)} mins`;
    if (interval < 3600 * 24) {
        return `${(interval / 3600).toFixed(0)} hours`;
    }
    return `${(interval / 3600 / 24).toFixed(0)} days`;
};

export const getCorrectTime = (utcTime) => {
    if (!utcTime) return null;
    const full_date = utcTime.split("T");
    const date = full_date[0].split("-");
    const time = full_date[1].split(":");
    const timeArray = [...date, ...time];
    const timestamp = new Date(
        timeArray[0],
        timeArray[1] - 1,
        timeArray[2],
        timeArray[3],
        timeArray[4]
    ).getTime();
    return getStandardTime(timestamp / 1000);
};

export const getContractAddressFromResponse = (response, key) => {
    const attributes = response?.logs?.[0]?.events?.filter(
        (event) => event.type === "wasm"
    )[0]?.attributes;
    return attributes?.filter((attribute) => attribute.key === key)[0]?.value;
};

export const checkFileSize = (file) =>
    (file?.size || 0) < fileSizeLimit * 1024 * 1024; // 100MB

export const checkFileType = (file) =>
    !!file?.type?.match("image.*") ||
    !!file?.type?.match("video.*") ||
    !!file?.type?.match("audio.*");

export const validationFile = (file) =>
    checkFileSize(file) && checkFileType(file);
