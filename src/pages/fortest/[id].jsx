import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Sticky from "@ui/sticky";
// import Breadcrumb from "@components/breadcrumb";
// import ProductDetailsArea from "@containers/nft-details";
// import ProductArea from "@containers/nft-details-area";
import usePickNft from "src/hooks/use-pick-nft";
import { useContract } from "@hooks";
import { MarketplaceContract } from "@constant";
import useAxios from "src/hooks/use-axios";
import { getReducedAddress } from "@utils/index";
import NiceSelect from "@ui/nice-select";
import Button from "@ui/button";
// demo data

const LIMIT_BIDS = 20;

const NftDetail = () => {
    const router = useRouter();
    const token_id = router.asPath.split("/")[2];
    const { runQuery, runExecute } = useContract();
    const [success, setSuccess] = useState(false);
    const [showData, setShowData] = useState({ endpoint: "", workload_id: "" });
    const selectedNft = usePickNft(token_id) || {};
    const [bids, setBids] = useState([]);
    const { fetchUserInfo } = useAxios();
    const [option, setOption] = useState("Execute1");
    useEffect(() => {
        setBids([]);
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
                        time: bid.time.slice(0, 13),
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
        fetchBids();
    }, [runQuery, selectedNft.token_address, selectedNft.token_id]);
    const handleChangeCollection = (item, name) => {
        // setValue(name, item.value);
        setOption(item.value);
    };
    const handleSubmit = async () => {
        try {
            const result = await runExecute(
                "human15fxl9g5pfjdhfqtmspmhpwtlxhfkwh9l2yk2uj926qqvg3gsfkuqwct4x8",
                {
                    execute_algorithm: {
                        msg: {
                            provider_id: "2",
                            nft_addr:
                                "human1e8z2wjelypwxw5sey62jvwjyup88w55q3h6m0x8jtwjf6sx5c7ystheysl",
                            token_id: "nft1",
                        },
                    },
                },
                {
                    funds: "1",
                    denom: "uheart",
                }
            );
            const wasmData = result.logs[0].events[5].attributes;
            const endpoint = wasmData[2].value;
            const workload_id = wasmData[1].value;
            setShowData({ endpoint, workload_id });
            // await axios.post("http://44.211.12.215:443/set", postData);
            setSuccess(true);
        } catch (err) {
            setSuccess(false);
            console.log("err: ", err);
        }
    };
    return (
        <Wrapper>
            <SEO pageTitle="NFT Detail" />
            <Header />
            <main id="main-content" style={{ padding: "0 200px" }}>
                {/* <Breadcrumb pageTitle="NFT Detail" currentPage="NFT Detail" /> */}
                {/* <ProductDetailsArea product={selectedNft || {}} bids={bids} /> */}
                <div style={{ display: "flex", padding: "20px 0" }}>
                    <div className="col-lg-7 col-md-12 col-sm-12">
                        <Sticky style={{ width: "max-content" }}>
                            <img
                                src={selectedNft.image_url}
                                alt=""
                                width={533}
                                height={533}
                            />
                            {/* {nftInfo.expiresAt && (
                                    <CountdownTimer
                                        date={nftInfo.expiresAt.toString()}
                                        completedString="Auction Expired!"
                                    />
                                )} */}
                        </Sticky>
                    </div>
                    <div
                        className="container container-no-max-width"
                        style={{ width: "1400px" }}
                    >
                        <div
                            style={{
                                columnGap: "40px",
                                alignItems: "center",
                                display: "flex",
                                padding: "40px 0",
                            }}
                        >
                            <NiceSelect
                                options={[
                                    { value: "Execute1", text: "Provider1" },
                                    { value: "Execute2", text: "Provider2" },
                                    { value: "Execute3", text: "Provider3" },
                                ]}
                                placeholder="Select Option"
                                onChange={handleChangeCollection}
                                name="option"
                                defaultCurrent={option}
                            />
                            <Button onClick={handleSubmit} type="submit">
                                {option}
                            </Button>
                        </div>
                    </div>
                </div>
                {success && (
                    <>
                        <div>Workload Id: {showData.workload_id}</div>
                        <iframe
                            src={showData.endpoint}
                            style={{ height: "600px" }}
                        ></iframe>
                    </>
                )}
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
