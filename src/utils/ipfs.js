import FormData from "form-data";
import axios from "axios";
import { pinataUrl } from "@constant";

export const uploadFileToIpfs = async (file) => {
    const data1 = new FormData();
    data1.append("file", file);
    data1.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
    data1.append(
        "pinataMetadata",
        JSON.stringify({
            name: file.name,
            keyvalues: { company: "Humans" },
        })
    );

    const config = {
        method: "post",
        // url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",  // for uploading JSON
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS", // for uploading image
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYmNjMTY3ZC1iYjNhLTRkMmUtYjEyZS00OGEzOWEyYjE4NGEiLCJlbWFpbCI6InZlbnVzMDcyNTAwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIwY2Y0ODIyYTBkYTgwNjRhNzE3Iiwic2NvcGVkS2V5U2VjcmV0IjoiZWFkNjMxY2I0OWQyNjYzNDczYjkwZDkyOTVhNWNmYzQ3ZTQwMzdkNTA0YTVmZTQ1MDliYjFjNmVkZTNhMTA5NSIsImlhdCI6MTY2MDE5NDkxMn0.wEwg8WB0XqnT96kEmD3sPDvRmZxlGiUN1DgLSNJXdec",
        },
        data: data1,
    };
    try {
        const result = await axios(config);
        return result?.data?.IpfsHash;
    } catch (e) {
        throw new Error(e);
    }
};

export const uploadJSONToIpfs = async (name, data) => {
    const uploadData = JSON.stringify({
        pinataOptions: {
            cidVersion: 1,
        },
        pinataMetadata: {
            name,
            // keyvalues: {
            //     customKey: "customValue",
            //     customKey2: "customValue2",
            // },
        },
        pinataContent: data,
    });
    const config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS", // for uploading JSON
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYmNjMTY3ZC1iYjNhLTRkMmUtYjEyZS00OGEzOWEyYjE4NGEiLCJlbWFpbCI6InZlbnVzMDcyNTAwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIwY2Y0ODIyYTBkYTgwNjRhNzE3Iiwic2NvcGVkS2V5U2VjcmV0IjoiZWFkNjMxY2I0OWQyNjYzNDczYjkwZDkyOTVhNWNmYzQ3ZTQwMzdkNTA0YTVmZTQ1MDliYjFjNmVkZTNhMTA5NSIsImlhdCI6MTY2MDE5NDkxMn0.wEwg8WB0XqnT96kEmD3sPDvRmZxlGiUN1DgLSNJXdec",
        },
        data: uploadData,
    };
    try {
        const result = await axios(config);
        return result?.data?.IpfsHash;
    } catch (e) {
        throw new Error(e);
    }
};

export const getImageFromHash = (hash) => {
    if (!hash) return "/images/client/client-2.png";
    return `${pinataUrl}/${hash}`;
};
