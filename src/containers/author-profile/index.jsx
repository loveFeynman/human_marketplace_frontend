import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
import TabContent from "react-bootstrap/TabContent";
import TabContainer from "react-bootstrap/TabContainer";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";
import { useAppSelector } from "@app/hooks";
import { MarketplaceContract } from "@constant";
import NftItem from "@components/nft-item";
import { useContract } from "@hooks";
import TopSeller from "@components/top-seller/layout-03";

const LIMIT_BIDS = 10;

const AuthorProfileArea = ({ className }) => {
    const [myBids, setMyBids] = useState([]);
    const router = useRouter();
    const { runQuery } = useContract();
    const { connectedWallet } = useWalletManager();
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const myNftsFromStorage = useAppSelector((state) => state.myNfts);
    const collectionAddresses = useAppSelector(
        (state) => state.collections.addresses
    );

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
    }, [connectedWallet, runQuery]);

    const myNfts = useMemo(() => {
        const myCreated = [];
        const myOwned = [];
        let myOnSale = [];
        const userDefinedAddresses = (
            collectionAddresses?.userDefined || []
        ).map((collection) => collection.address);
        Object.keys(myNftsFromStorage || {}).forEach((key) => {
            const crrNfts = myNftsFromStorage[key];
            crrNfts.forEach((nft) => {
                if (userDefinedAddresses.includes(nft.token_address)) {
                    myCreated.push(nft);
                } else {
                    myOwned.push(nft);
                }
            });
        });
        if (connectedWallet) {
            Object.keys(marketplaceNfts || {}).forEach((key) => {
                const crrNfts = marketplaceNfts[key];
                myOnSale = [...myOnSale, ...crrNfts];
            });
        }
        return { onSale: myOnSale, created: myCreated, owned: myOwned };
    }, [
        collectionAddresses,
        connectedWallet,
        marketplaceNfts,
        myNftsFromStorage,
    ]);
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
                            {myNfts.onSale?.map((prod) => (
                                <div
                                    key={prod.token_id}
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
                            {myNfts.owned?.map((prod) => (
                                <div
                                    key={prod.token_id}
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
                            {myNfts.created?.map((prod) => (
                                <div
                                    key={prod.token_id}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <NftItem overlay item={prod} />
                                </div>
                            ))}
                        </TabPane>
                        <TabPane className="row g-5 d-flex" eventKey="nav-bids">
                            {myBids?.map((bid) => (
                                <TopSeller
                                    key={`${bid.bidder}-${bid.token_id}`}
                                    tokenId={bid.token_id}
                                    eth={`${Number(bid.price) / 1e6}`}
                                    onClick={() =>
                                        router.push(
                                            `/nft-detail?token_id=${bid.token_id}&collection=${bid.collection}`
                                        )
                                    }
                                />
                            ))}
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
