import { useAppSelector } from "@app/hooks";
import { useEffect, useState } from "react";
import useContract from "./use-contract";

function usePickNft(tokenId, collection) {
    const collections = useAppSelector((state) => state.collections);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const { runQuery } = useContract();
    const [selectedNft, setSelectedNft] = useState({});
    const marketplaceNft =
        marketplaceNfts[collection]?.filter(
            (item) => item.token_id === tokenId
        )[0] || {};
    useEffect(() => {
        (async () => {
            const nftData = await runQuery(collection, {
                all_nft_info: {
                    token_id: tokenId,
                },
            });
            const selectedNftData = {
                ...marketplaceNft,
                image_url: nftData?.info.extension.image_url,
                token_address: collection,
                token_id: tokenId,
                token_url: nftData?.info.token_uri,
                collection: collections[collection]?.collection_info.title,
            };
            setSelectedNft(selectedNftData);
        })();
    }, [tokenId, collection]);
    return selectedNft;
}

export default usePickNft;
