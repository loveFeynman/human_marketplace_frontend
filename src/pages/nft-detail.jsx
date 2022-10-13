import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductDetailsArea from "@containers/nft-details";
// import ProductArea from "@containers/nft-details-area";
import usePickNft from "src/hooks/use-pick-nft";
import { useContract, useAxios } from "@hooks";
import { MarketplaceContract } from "@constant";
import { getReducedAddress } from "@utils/index";
// demo data

const LIMIT_BIDS = 20;

const NftDetail = () => {
    const router = useRouter();
    const { token_id, collection } = router.query;
    const { runQuery } = useContract();
    const selectedNft = usePickNft(token_id, collection) || {};
    const [bids, setBids] = useState([]);
    const { fetchUserInfo } = useAxios();
    const fetchBids = async (startBidder) => {
        const msg = {
            bids: {
                collection: selectedNft.token_address,
                token_id: selectedNft.token_id,
                start_after: startBidder,
                limit: LIMIT_BIDS,
            },
        };
        const queryResults = await runQuery(MarketplaceContract, msg);
        const fetchedBids = queryResults?.bids || [];
        const bidersInfo = await Promise.all(
            fetchedBids.map(async (bid) => {
                const info = await fetchUserInfo(bid.bidder);
                return info;
            })
        );
        setBids(
            fetchedBids.map((bid, index) => {
                const _bids = {
                    price: Number(bid.price) / 1e6,
                    name:
                        bidersInfo[index].first_name ||
                        getReducedAddress(bid.bidder),
                    logo: bidersInfo[index].logo,
                    bidder: bid.bidder,
                    slug: `/profile/${bid.bidder}`,
                    time: bid?.time?.slice(0, 13),
                };
                return _bids;
            })
        );
        // setBids((prev) =>
        //     prev.concat(
        //         fetchedBids.map((bid) => ({
        //             ...bid,
        //             price: Number(bid.price) / 1e6,
        //         }))
        //     )
        // );
        if (fetchedBids.length === LIMIT_BIDS) {
            fetchBids(fetchedBids[fetchedBids.length - 1].bidder);
        }
    };
    useEffect(() => {
        fetchBids();
    }, [runQuery, selectedNft.token_address, selectedNft.token_id]);
    const refreshData = async () => {
        await fetchBids();
    };
    return (
        <Wrapper>
            <SEO pageTitle="NFT Detail" />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle="NFT Detail" currentPage="NFT Detail" />
                <ProductDetailsArea
                    product={selectedNft || {}}
                    bids={bids}
                    refreshData={refreshData}
                />
                {/* <ProductArea
                    data={{
                        section_title: { title: "Recent View" },
                        products: recentViewProducts,
                    }}
                />
                <ProductArea
                    data={{
                        section_title: { title: "Related Item" },
                        products: relatedProducts,
                    }}
                /> */}
            </main>
            <Footer />
        </Wrapper>
    );
};

export default NftDetail;
