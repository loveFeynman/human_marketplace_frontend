import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
// import { useRouter } from "next/router";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
import TabContent from "react-bootstrap/TabContent";
import TabContainer from "react-bootstrap/TabContainer";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";
import { useAppSelector } from "@app/hooks";
import { MarketplaceContract } from "@constant";
import NftItem from "@components/nft-item";
import { useContract, useAxios } from "@hooks";
import MyBids from "./my-bids";
// import TopSeller from "@components/top-seller/layout-03";

const LIMIT_BIDS = 10;

const AuthorProfileArea = ({ className }) => {
    const [myBids, setMyBids] = useState([]);
    const [myBidTargetNfts, setMyBidTargetNfts] = useState([]);
    // const router = useRouter();
    const { runQuery } = useContract();
    const { connectedWallet } = useWalletManager();
    const [createdNfts, setCreatedNfts] = useState([]);
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [onSaleNfts, setOnSaleNfts] = useState([]);
    const { getCreatedNfts } = useAxios();
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const myNftsFromStorage = useAppSelector((state) => state.myNfts);
    const collections = useAppSelector((state) => state.collections);

    // useEffect(() => {
    //     if (!connectedWallet) {
    //         router.push("/");
    //     }
    // }, [connectedWallet, router]);

    useEffect(() => {
        setMyBids([]);
        if (!connectedWallet) {
            return;
        }
        const fetchBids = async (startAfter) => {
            const message = {
                bids_by_bidder: {
                    bidder: connectedWallet.address,
                    start_after: startAfter,
                    limit: LIMIT_BIDS,
                },
            };
            const queryResult = await runQuery(MarketplaceContract, message);
            const fetchedBids = queryResult?.bids || [];
            setMyBids((prev) => [...prev, ...fetchedBids]);
            if (fetchedBids.length === LIMIT_BIDS) {
                const lastBid = fetchedBids[fetchedBids.length - 1];
                fetchBids({
                    collection: lastBid.collection,
                    token_id: lastBid.token_id,
                });
            }
        };
        fetchBids();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectedWallet]);

    useEffect(() => {
        (async () => {
            const createdNftsInSubquery = await getCreatedNfts(
                connectedWallet?.address
            );
            // const createdNftsInSubquery = await getCreatedNfts(
            //     "human15g8ll4n3sksjnf8yvtzz84nv0stx7arawtukft"
            // );

            const createdNftsInContract = await Promise.all(
                createdNftsInSubquery?.map(async (nft) => {
                    try {
                        const nftData = await runQuery(nft.collection, {
                            all_nft_info: {
                                token_id: nft.tokenId,
                            },
                        });

                        const marketplaceNft =
                            marketplaceNfts[nft.collection]?.filter(
                                (item) => item.token_id === nft.tokenId
                            )[0] || {};
                        return {
                            ...marketplaceNft,
                            image_url:
                                nftData?.info.extension.image_url.startsWith(
                                    "http"
                                )
                                    ? nftData?.info.extension.image_url
                                    : "/images/bg/bg-image-9.png",
                            token_address: nft.collection,
                            token_id: nft.tokenId,
                            token_url: nftData?.info.token_uri,
                            collection:
                                collections[nft.collection]?.collection_info
                                    ?.title,
                            owner: nftData?.access.owner,
                        };
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log("createdNftsInContract: ", err);
                        return {};
                    }
                }) || []
            );

            setCreatedNfts(createdNftsInContract);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections, connectedWallet?.address, marketplaceNfts]);

    useEffect(() => {
        if (myBids.length) {
            const result = [];
            myBids.forEach(async (bid) => {
                const existingNftInfo = (marketplaceNfts[bid.collection] || [])
                    .concat(myNftsFromStorage[bid.collection] || [])
                    .filter((item) => item.token_id === bid.token_id);
                if (existingNftInfo.length) {
                    result.push(existingNftInfo[0]);
                } else {
                    const nftData = await runQuery(bid.collection, {
                        all_nft_info: {
                            token_id: bid.token_id,
                        },
                    });
                    result.push({
                        image_url: nftData?.info.extension.image_url,
                        token_address: bid.collection,
                        token_id: bid.token_id,
                        token_url: nftData?.info.token_uri,
                        collection:
                            collections[bid.collection]?.collection_info
                                ?.title || "",
                        owner: nftData?.access.owner,
                        creator: nftData?.info.extension.minter,
                        created_at: nftData?.info.created_time,
                    });
                }
            });
            setMyBidTargetNfts(result);
        } else {
            setMyBidTargetNfts([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections, marketplaceNfts, myBids, myNftsFromStorage]);

    useEffect(() => {
        const myOwned = [];
        Object.keys(myNftsFromStorage || {}).forEach((key) => {
            if (key !== "addresses") {
                const crrNfts = myNftsFromStorage[key];
                crrNfts.forEach((nft) => {
                    myOwned.push(nft);
                });
            }
        });
        setOwnedNfts([...new Set(myOwned)]);
        // return { onSale: myOnSale, owned: myOwned };
    }, [myNftsFromStorage]);

    useEffect(() => {
        const myOnSale = [];
        if (connectedWallet) {
            Object.keys(marketplaceNfts || {}).forEach((key) => {
                const crrNfts = marketplaceNfts[key];
                crrNfts.forEach((nft) => {
                    if (nft.seller !== connectedWallet?.address) return;
                    myOnSale.push(nft);
                });
            });
        }
        setOnSaleNfts([...new Set(myOnSale)]);
        // return { onSale: myOnSale, owned: myOwned };
    }, [connectedWallet, marketplaceNfts]);

    const finalOwnedNfts = useMemo(() => {
        const existingInOwnedNfts = ownedNfts.map(
            (item) => `${item.collection}-${item.token_id}`
        );
        return [
            ...new Set(ownedNfts),
            ...new Set(
                onSaleNfts.filter(
                    (item) =>
                        !existingInOwnedNfts.includes(
                            `${item.collection}-${item.token_id}`
                        )
                )
            ),
        ];
    }, [ownedNfts, onSaleNfts]);

    return (
        <div className={clsx("rn-authore-profile-area", className)}>
            <TabContainer defaultActiveKey="nav-owned">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="tab-wrapper-one">
                                <nav className="tab-button-one">
                                    <Nav
                                        className="nav nav-tabs"
                                        id="nav-tab"
                                        role="tablist"
                                    >
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-on-sale"
                                        >
                                            On Sale
                                        </Nav.Link>
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-owned"
                                        >
                                            Owned
                                        </Nav.Link>
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-created"
                                        >
                                            Created
                                        </Nav.Link>
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-bids"
                                        >
                                            My Bids
                                        </Nav.Link>
                                    </Nav>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <TabContent className="tab-content rn-bid-content">
                        <TabPane
                            className="row d-flex g-5"
                            eventKey="nav-on-sale"
                        >
                            {onSaleNfts?.map((prod) => (
                                <div
                                    key={`on-sale-${prod.token_id}`}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <NftItem overlay item={prod} />
                                </div>
                            ))}
                        </TabPane>
                        <TabPane
                            className="row g-5 d-flex"
                            eventKey="nav-owned"
                        >
                            {finalOwnedNfts.map((prod) => (
                                <div
                                    key={`owned-${prod.token_id}`}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <NftItem overlay item={prod} />
                                </div>
                            ))}
                        </TabPane>
                        <TabPane
                            className="row g-5 d-flex"
                            eventKey="nav-created"
                        >
                            {createdNfts.map((prod) => (
                                <div
                                    key={`created-${prod.token_id}`}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <NftItem overlay item={prod} />
                                </div>
                            ))}
                        </TabPane>
                        <TabPane className="row g-5 d-flex" eventKey="nav-bids">
                            {/* {myBids?.map((bid) => (
                                <TopSeller
                                    key={`${bid.bidder}-${bid.token_id}`}
                                    tokenId={bid.token_id}
                                    eth={`${Number(bid.price) / 1e6}`}
                                    onClick={() =>
                                        router.push(
                                            `/explore/${bid.token_id}?collection=${bid.collection}`
                                        )
                                    }
                                />
                            ))} */}
                            <MyBids bids={myBidTargetNfts} />
                        </TabPane>
                    </TabContent>
                </div>
            </TabContainer>
        </div>
    );
};

AuthorProfileArea.propTypes = {
    className: PropTypes.string,
};
export default AuthorProfileArea;
