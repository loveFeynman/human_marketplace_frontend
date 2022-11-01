/* eslint-disable no-console */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/iframe-has-title */
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
import { MarketplaceContract, ChainConfig } from "@constant";
import { useAxios } from "src/hooks";
import { getReducedAddress } from "@utils/index";
import NiceSelect from "@ui/nice-select";
import Button from "@ui/button";
// demo data
// william
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { useWallet } from "@noahsaso/cosmodal";
import { coins } from "@cosmjs/proto-signing";
import axios from "axios";

const LIMIT_BIDS = 20;

const NftDetail = () => {
    const router = useRouter();
    const token_id = router.asPath.split("/")[2].split("?")[0];
    const { runQuery } = useContract();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showData, setShowData] = useState({ endpoint: "", workload_id: "" });
    const { collection } = router.query;
    const { nftInfo: selectedNft } = usePickNft(token_id, collection) || {};
    const [, setBids] = useState([]);
    const { fetchUserInfo } = useAxios();
    const [option, setOption] = useState("Execute1");

    const { offlineSigner, address } = useWallet(ChainConfig.chainId);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runQuery, selectedNft.token_address, selectedNft.token_id]);
    const handleChangeCollection = (item) => {
        // setValue(name, item.value);
        setOption(item.value);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const cwClient = await SigningCosmWasmClient.connectWithSigner(
                ChainConfig.rpcEndpoint,
                offlineSigner,
                {
                    gasPrice: GasPrice.fromString(
                        `${ChainConfig.gasPrice}${ChainConfig.microDenom}`
                    ),
                }
            );

            console.log("address: ", address);
            const result = await cwClient.execute(
                address,
                "human1rshdhvvhra8gl3ywhpgtd29aythlt9tjzdv648nq3hl922499cgqx5zjzk",
                {
                    execute_algorithm: {
                        msg: {
                            provider_id: "0",
                            nft_addr:
                                "human1e8z2wjelypwxw5sey62jvwjyup88w55q3h6m0x8jtwjf6sx5c7ystheysl",
                            token_id: "ai_nft",
                        },
                    },
                },
                "auto",
                "",
                coins("1000000", "uheart")
            );

            const wasmData = result.logs[0].events[5].attributes;
            // const endpoint = wasmData[2].value;
            const workload_id = wasmData[1].value;

            const signature = await window.keplr.signArbitrary(
                ChainConfig.chainId,
                address,
                workload_id // Buffer.from(JSON.stringify(execute_msg)).toString("base64")
            );

            console.log("signature: ", signature);

            // Create the document for signing.
            // const signDoc = {
            //     chain_id: "",
            //     account_number: "0",
            //     sequence: "0",
            //     fee: {
            //         gas: "0",
            //         amount: [],
            //     },
            //     msgs: [
            //         {
            //             type: "sign/MsgSignData",
            //             value: {
            //                 signer: address,
            //                 data: Buffer.from(JSON.stringify(execute_msg)).toString("base64"),
            //             },
            //         },
            //     ],
            //     memo: "",
            // };

            // const res = await window.keplr.signAmino(
            //     ChainConfig.chainId,
            //     address,
            //     signDoc,
            //     );

            console.log(
                "workload: ",
                workload_id,
                signature.signature,
                signature.pub_key.value
            );

            const postData = {
                workload_id,
                signature: signature.signature,
                pubkey: signature.pub_key.value,
            };
            try {
                const resData = await axios.post(
                    "http://18.220.100.80:443/set-state",
                    postData
                );
                setShowData({ endpoint: resData.data, workload_id });
            } catch (err) {
                console.log("err: ", err);
            }

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setSuccess(false);
            setLoading(false);
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
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                className={loading && "disabled"}
                            >
                                {option}
                            </Button>
                        </div>
                    </div>
                </div>
                {success && (
                    <>
                        <div>Workload Id: {showData.workload_id}</div>
                        <iframe
                            src={`http://18.220.100.80:443${showData.endpoint}`}
                            style={{ height: "600px" }}
                        />
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
