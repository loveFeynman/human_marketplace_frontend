import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import { useWalletManager } from "@noahsaso/cosmodal";
import Sticky from "@ui/sticky";
import Button from "@ui/button";
import CountdownTimer from "@ui/countdown/layout-01";
import { useContract } from "@hooks";
import ProductTitle from "@components/product-details/title";
import PurchaseModal from "@components/modals/purchase-modal";
// import ProductCategory from "@components/product-details/category";
// import ProductCollection from "@components/product-details/collection";
import BidTab from "@components/product-details/bid-tab";
// import PlaceBet from "@components/product-details/place-bet";
import { NftType } from "@utils/types";
import { ChainConfig } from "@constant";

// Demo Image

const ProductDetailsArea = ({ space, className, product, bids }) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const { connectedWallet } = useWalletManager();
    const { sellNft, withdrawNft, buyNft, setBid, acceptBid } = useContract();
    const nftInfo = useMemo(() => {
        const { price } = product;
        const image = product.image_url;
        let buttonString = "Sell";
        if (price) {
            if (connectedWallet?.address === product.seller) {
                buttonString =
                    product.sale_type === "auction" ? "Accept Bid" : "Withdraw";
            } else if (product.sale_type === "auction") {
                buttonString = "Set a Bid";
            } else {
                buttonString = "Buy";
            }
        }
        const expiresAt = product.expires_at
            ? new Date(product.expires_at)
            : null;
        const expired = expiresAt && Number(new Date()) - Number(expiresAt) > 0;
        return {
            price,
            buttonString,
            image,
            expiresAt,
            expired,
        };
    }, [connectedWallet?.address, product]);

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
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
            }
        } else if (product.seller === connectedWallet.address) {
            try {
                if (product.sale_type === "auction") {
                    await acceptBid(product);
                } else {
                    await withdrawNft(product);
                }
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
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
            }
        } else {
            try {
                await buyNft(product);
                setShowBidModal(false);
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
                        <div className="col-lg-7 col-md-12 col-sm-12">
                            <Sticky style={{ width: "max-content" }}>
                                <Image
                                    src={product.image_url}
                                    alt=""
                                    width={533}
                                    height={533}
                                />
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
                                />
                                {product.price && (
                                    <span className="bid">
                                        Listed Price{" "}
                                        <span className="price">
                                            {product.price.amount / 1e6} $Heart
                                        </span>
                                    </span>
                                )}
                                <h6 className="title-name">
                                    {product.seller || ""}
                                </h6>
                                <Button
                                    color="primary-alta"
                                    onClick={handleBidModal}
                                >
                                    {nftInfo.buttonString}
                                </Button>
                                {/* <div className="catagory-collection">
                                <ProductCategory owner={product.owner} />
                                <ProductCollection
                                    collection={product.collection}
                                />
                            </div> */}
                                <div className="rn-bid-details">
                                    <BidTab
                                        bids={bids}
                                        owner={product.owner}
                                        properties={product?.properties}
                                        tags={product?.tags}
                                        history={product?.history}
                                    />
                                    {/* <PlaceBet
                                    highest_bid={product.highest_bid}
                                    auction_date={product?.auction_date}
                                /> */}
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
    product: PropTypes.objectOf(NftType).isRequired,
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
