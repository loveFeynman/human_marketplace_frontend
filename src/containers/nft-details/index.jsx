/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
import Sticky from "@ui/sticky";
import Button from "@ui/button";
import CountdownTimer from "@ui/countdown/layout-01";
import { useContract, useAxios, useRefresh } from "@hooks";
import ProductTitle from "@components/product-details/title";
import TopSellerArea from "@components/top-seller/layout-01";
import PurchaseModal from "@components/modals/purchase-modal";
// import ProductCategory from "@components/product-details/category";
// import ProductCollection from "@components/product-details/collection";
import BidTab from "@components/product-details/bid-tab";
import PlaceBet from "@components/product-details/place-bet";
// import { NftType } from "@utils/types";
import { ChainConfig } from "@constant";
import { getImageFromHash } from "@utils/ipfs";
import { getFullName, getReducedAddress } from "@utils/index";
import { useRouter } from "next/router";
import Video from "@components/video";
import { UseHistory } from "./hooks";
// Demo Image

const ProductDetailsArea = ({
    space,
    className,
    product,
    bids,
    refreshData,
    // fetchNftInfo,
}) => {
    const [previewType, setPreviewType] = useState("image");
    const [showBidModal, setShowBidModal] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState({});
    const [creatorInfo, setCreatorInfo] = useState({});
    const [collectionInfo, setCollectionInfo] = useState({});
    // const history = UseHistory(
    //     "User.1",
    //     "human1mg3e6tsa5k9aamqgyxddmd40ar9zxg9qyuw6pljk8pnk5ufjlj5qefc9z6"
    // );
    // console.log("history: ", history);
    const history = UseHistory(product?.token_id, product?.token_address);
    const { second: value } = useRefresh();

    const { fetchUserInfo } = useAxios();
    const { connectedWallet } = useWalletManager();
    const router = useRouter();
    const {
        sellNft,
        withdrawNft,
        buyNft,
        setBid,
        acceptBid,
        getCollectionInfo,
    } = useContract();

    useEffect(() => {
        (async () => {
            const userInfo = await fetchUserInfo(
                product.seller || product.owner
            );
            const fetchedCreatorInfo = await fetchUserInfo(product.creator);
            const _collectionInfo = await getCollectionInfo(
                product.token_address
            );
            setCollectionInfo({
                title: _collectionInfo?.collection_info?.title,
                image: _collectionInfo?.collection_info?.background_url,
            });
            setCreatorInfo(fetchedCreatorInfo);
            setOwnerInfo(userInfo);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.owner, product.creator]);

    const nftInfo = useMemo(() => {
        const { price } = product;
        const expiresAt = product.expires_at
            ? new Date(product.expires_at)
            : null;
        const expired = expiresAt && Number(new Date()) - Number(expiresAt) > 0;
        const image = product.image_url;
        let buttonString =
            connectedWallet && connectedWallet?.address === product.owner
                ? "Sell"
                : "";
        if (price) {
            if (connectedWallet?.address === product.seller) {
                if (product.sale_type === "auction") {
                    buttonString = expired && bids?.length ? "Accept Bid" : "";
                } else {
                    buttonString = "";
                }
            } else if (product.sale_type === "auction") {
                buttonString = expired ? "" : "Set a Bid";
            } else {
                buttonString = "Buy";
            }
        }
        return {
            price,
            buttonString,
            image,
            expiresAt,
            expired,
            isOwner: product.owner === connectedWallet?.address,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectedWallet?.address, product, value]);

    const defaultAmount = useMemo(() => {
        const maxBid =
            product.bids?.max_bid &&
            !Number.isNaN(product.bids.max_bid) &&
            Number(product.bids.max_bid) > 0
                ? product.bids
                : null;
        if (maxBid) {
            return Number(maxBid.max_bid) / 1e6;
        }
        if (nftInfo.price) {
            return nftInfo.price.amount / 1e6;
        }
        return undefined;
    }, [nftInfo.price, product.bids]);

    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };
    const handleNft = async (amount, extraOption, callback) => {
        if (!nftInfo.price) {
            try {
                await sellNft(product, amount, extraOption);
                setShowBidModal(false);
                // router.back();
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
            }
        } else if (product.seller === connectedWallet.address) {
            try {
                if (product.sale_type === "auction") {
                    await acceptBid(product);
                    router.back();
                    // fetchNftInfo();
                } else {
                    await withdrawNft(product);
                }
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
                refreshData();
            }
        } else if (product.sale_type === "auction") {
            try {
                await setBid(product, {
                    amount,
                    denom: ChainConfig.microDenom,
                });
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
                refreshData();
            }
        } else {
            try {
                await buyNft(product);
                setShowBidModal(false);
                // router.back();
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
            }
        }
    };

    return (
        <>
            <div
                className={clsx(
                    "product-details-area",
                    space === 1 && "rn-section-gapTop",
                    className
                )}
            >
                <div className="container">
                    <div className="row g-5">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            className="col-lg-7 col-md-12 col-sm-12"
                        >
                            <Sticky
                                style={{
                                    width: "max-content",
                                    maxWidth: "100%",
                                    // maxHeight: "100vh",
                                }}
                            >
                                {previewType === "image" && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={product.image_url}
                                        alt=""
                                        width={533}
                                        height={533}
                                        onError={() => setPreviewType("video")}
                                    />
                                )}
                                {previewType === "video" && (
                                    <Video
                                        src={product.image_url}
                                        controls
                                        loop
                                        autoPlay
                                        muted
                                        size={{
                                            width: 533,
                                            height: 533,
                                        }}
                                    />
                                )}
                                {nftInfo.expiresAt && (
                                    <CountdownTimer
                                        date={nftInfo.expiresAt.toString()}
                                        completedString="Auction Expired!"
                                    />
                                )}
                            </Sticky>
                        </div>
                        <div className="col-lg-5 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
                            <div className="rn-pd-content-area">
                                <ProductTitle
                                    title={product.token_id}
                                    likeCount={product.likeCount}
                                    isOwner={nftInfo.isOwner}
                                    isNft
                                />
                                {product.price && (
                                    <span className="bid">
                                        Listed Price{" "}
                                        <span className="price">
                                            {product.price.amount / 1e6} $Heart
                                        </span>
                                    </span>
                                )}
                                {/* <h6 className="title-name">
                                    {product.seller || product.owner}
                                </h6> */}
                                <div className="catagory-collection">
                                    <div className="catagory">
                                        <span>Owned by</span>
                                        <TopSellerArea
                                            name={
                                                getFullName(
                                                    ownerInfo.first_name,
                                                    ownerInfo.last_name
                                                ) ||
                                                getReducedAddress(
                                                    ownerInfo.wallet
                                                )
                                            }
                                            // total_sale={ownerInfo.total_sale}
                                            slug={`/profile/${ownerInfo.wallet}`}
                                            image={{
                                                src: getImageFromHash(
                                                    ownerInfo.logo
                                                ),
                                                width: "44px",
                                                height: "44px",
                                            }}
                                        />
                                    </div>
                                    <div className="catagory">
                                        <span>Collection</span>
                                        <TopSellerArea
                                            name={collectionInfo.title}
                                            // total_sale={ownerInfo.total_sale}
                                            slug={`/explore/collections/${product.token_address}`}
                                            image={{
                                                src: collectionInfo.image,
                                                width: "44px",
                                                height: "44px",
                                            }}
                                        />
                                    </div>
                                </div>

                                {nftInfo.buttonString && (
                                    <Button
                                        style={{ marginRight: 20 }}
                                        color="primary-alta"
                                        onClick={handleBidModal}
                                    >
                                        {nftInfo.buttonString}
                                    </Button>
                                )}
                                {connectedWallet?.address === product.owner &&
                                    product.price && (
                                        <Button
                                            color="primary-alta"
                                            onClick={() => withdrawNft(product)}
                                        >
                                            Withdraw
                                        </Button>
                                    )}
                                {/* <div className="catagory-collection">
                                <ProductCategory owner={product.owner} />
                                <ProductCollection
                                    collection={product.collection}
                                />
                            </div> */}
                                <div className="rn-bid-details">
                                    {nftInfo.expiresAt && bids[0] && (
                                        <PlaceBet
                                            highest_bid={bids[0]}
                                            auction_date={nftInfo.expiresAt.toString()}
                                            handleBid={handleBidModal}
                                            buttonString={nftInfo.buttonString}
                                        />
                                    )}
                                    <BidTab
                                        bids={bids}
                                        properties={product?.properties}
                                        tags={product?.tags}
                                        history={history}
                                        token_uri={product?.token_url}
                                        ownerInfo={ownerInfo}
                                        creatorInfo={creatorInfo}
                                        created_at={product?.created_at}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseModal
                show={showBidModal}
                handleModal={handleBidModal}
                generalOptions={{
                    // title: `${nftInfo.buttonString} NFT`,
                    title: nftInfo.buttonString,
                    buttonString: nftInfo.buttonString,
                    isSelling: !nftInfo.price,
                }}
                amountOptions={{
                    denom: nftInfo.price?.denom || ChainConfig.microDenom,
                    defaultAmount,
                    disabled:
                        !!nftInfo.price &&
                        (nftInfo.buttonString === "Accept Bid" ||
                            product.sale_type !== "auction"),
                }}
                handleClickConfirm={handleNft}
            />
        </>
    );
};

ProductDetailsArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    // product: PropTypes.objectOf(NftType).isRequired,
    bids: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool,
            bidder: PropTypes.string,
            collection: PropTypes.string,
            price: PropTypes.number,
            token_id: PropTypes.string,
        })
    ),
    // product: PropTypes.shape({
    //     title: PropTypes.string.isRequired,
    //     likeCount: PropTypes.number,
    //     price: PropTypes.shape({
    //         amount: PropTypes.number.isRequired,
    //         currency: PropTypes.string.isRequired,
    //     }).isRequired,
    //     owner: PropTypes.shape({}),
    //     collection: PropTypes.shape({}),
    //     bids: PropTypes.arrayOf(PropTypes.shape({})),
    //     properties: PropTypes.arrayOf(PropTypes.shape({})),
    //     tags: PropTypes.arrayOf(PropTypes.shape({})),
    //     history: PropTypes.arrayOf(PropTypes.shape({})),
    //     highest_bid: PropTypes.shape({}),
    //     auction_date: PropTypes.string,
    //     images: PropTypes.arrayOf(ImageType),
    // }),
};

ProductDetailsArea.defaultProps = {
    space: 1,
};

export default ProductDetailsArea;
