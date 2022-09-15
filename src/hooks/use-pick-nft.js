import { useAppSelector } from "@app/hooks";
import { useMemo } from "react";

function usePickNft(tokenId) {
    const collections = useAppSelector((state) => state.collections);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const myNfts = useAppSelector((state) => state.myNfts);
    const selectedNft = useMemo(() => {
        let totalNfts = [];
        Object.keys(collections).forEach((key) => {
            totalNfts = [
                ...totalNfts,
                ...(myNfts[key] || []),
                ...(marketplaceNfts[key] || []),
            ];
        });
        return totalNfts.filter((nft) => nft.token_id === tokenId)?.[0] || null;
    }, [collections, marketplaceNfts, myNfts, tokenId]);
    return selectedNft;
}

export default usePickNft;
