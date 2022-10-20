import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
import Anchor from "@ui/anchor";
import CountdownTimer from "@ui/countdown/layout-01";
// import ClientAvatar from "@ui/client-avatar";
// import ShareDropdown from "@components/share-dropdown";
// import ProductBid from "@components/product-bid";
import PurchaseModal from "@components/modals/purchase-modal";
import Button from "@ui/button";
// import { ImageType } from "@utils/types";
import { NftType } from "@utils/types";
import { ChainConfig } from "@constant";
import { useContract } from "@hooks";
// import { CustomWalletContext } from "@context";

const NftItem = ({ overlay, item }) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const { sellNft, withdrawNft, buyNft, setBid, acceptBid } = useContract();
    const { connectedWallet } = useWalletManager();
    const isOwner = item.owner && item.owner === connectedWallet?.address;
    // const { connectedWallet } = useContext(CustomWalletContext);
    const nftInfo = useMemo(() => {
        const { price } = item;
        const image = item.image_url;
        let buttonString = "Sell";
        if (price) {
            if (connectedWallet?.address === item.seller) {
                buttonString =
                    item.sale_type === "auction" ? "Accept Bid" : "Withdraw";
            } else if (item.sale_type === "auction") {
                buttonString = "Set a Bid";
            } else {
                buttonString = "Buy";
            }
        }
        const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
        const expired = expiresAt && Number(new Date()) - Number(expiresAt) > 0;
        const bids =
            item.bids?.max_bid &&
            !Number.isNaN(item.bids.max_bid) &&
            Number(item.bids.max_bid) > 0
                ? item.bids
                : null;
        return { price, buttonString, image, expiresAt, expired, bids };
    }, [connectedWallet, item]);

    const defaultAmount = useMemo(() => {
        if (nftInfo.bids) {
            return Number(nftInfo.bids.max_bid) / 1e6;
        }
        if (nftInfo.price) {
            return nftInfo.price.amount / 1e6;
        }
        return undefined;
    }, [nftInfo.bids, nftInfo.price]);

    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };

    const handleNft = async (amount, extraOption, callback) => {
        if (!nftInfo.price) {
            try {
                await sellNft(item, amount, extraOption);
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
            }
        } else if (item.seller === connectedWallet.address) {
            try {
                if (item.sale_type === "auction") {
                    await acceptBid(item);
                } else {
                    await withdrawNft(item);
                }
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
            }
        } else if (item.sale_type === "auction") {
            try {
                await setBid(item, { amount, denom: ChainConfig.microDenom });
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                callback();
            }
        } else {
            try {
                await buyNft(item);
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
                    "product-style-one with-placeBid",
                    !overlay && "no-overlay"
                )}
            >
                <div className="card-thumbnail">
                    {nftInfo.image && (
                        <Anchor
                            path={`/nft-detail?token_id=${item.token_id}&collection=${item.token_address}`}
                        >
                            <img
                                src={nftInfo.image}
                                alt=""
                                width={533}
                                height={533}
                            />
                        </Anchor>
                    )}
                    {nftInfo.expiresAt && (
                        <CountdownTimer
                            date={nftInfo.expiresAt.toString()}
                            completedString="Auction Expired!"
                        />
                    )}
                    {isOwner &&
                        (!nftInfo.expired ||
                            nftInfo.buttonString === "Withdraw") && (
                            <Button 
                                onClick={handleBidModal} 
                                size="small"
                            >
                                {nftInfo.buttonString}
                            </Button>
                        )}
                </div>
                <div className="product-share-wrapper">
                    {nftInfo.bids && (
                        <div
                            style={{ width: "100%" }}
                            className="profile-share"
                        >
                            {/* {authors?.map((client) => (
                                <ClientAvatar
                                    key={client.name}
                                    slug={client.slug}
                                    name={client.name}
                                    image={client.image}
                                />
                            ))} */}
                            <span
                                style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                }}
                                className="more-author-text"
                            >
                                {Number(nftInfo.bids.max_bid) / 1e6} $Heart by{" "}
                                {nftInfo.bids.max_bidder}
                            </span>
                        </div>
                    )}
                    {/* {!disableShareDropdown && <ShareDropdown />} */}
                </div>
                {/* <Anchor path={`/product/${item.tokenId}`}> */}
                <Anchor
                    path={`/nft-detail?token_id=${item.token_id}&collection=${item.token_address}`}
                >
                    <span className="product-name">{item.token_id}</span>
                </Anchor>
                <div className="latest-bid">{item.collection}</div>
                {item.seller && (
                    <div
                        style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                        title={item.seller}
                        className="latest-bid"
                    >
                        {item.seller}
                    </div>
                )}
                {/* <span className="latest-bid">Highest bid {latestBid}</span> */}
                {nftInfo.price && (
                    <div className="bid-react-area">
                        <div className="last-bid">
                            {nftInfo.price.amount / 1e6} $Heart
                        </div>
                    </div>
                )}
                {/* <ProductBid price={price} likeCount={likeCount} /> */}
            </div>
            <PurchaseModal
                show={showBidModal}
                handleModal={handleBidModal}
                generalOptions={{
                    title: `${nftInfo.buttonString} NFT`,
                    buttonString: nftInfo.buttonString,
                    isSelling: !nftInfo.price,
                }}
                amountOptions={{
                    denom: nftInfo.price?.denom || ChainConfig.microDenom,
                    defaultAmount,
                    disabled: !!nftInfo.price && item.sale_type !== "auction",
                }}
                handleClickConfirm={handleNft}
            />
        </>
    );
};

NftItem.propTypes = {
    overlay: PropTypes.bool,
    item: PropTypes.objectOf(NftType).isRequired,
};

NftItem.defaultProps = {
    overlay: false,
};

export default NftItem;
