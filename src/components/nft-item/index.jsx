/* eslint-disable indent */
import { memo, useMemo, useState } from "react";
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
import { getFullName } from "@utils/index";
import { ChainConfig } from "@constant";
import { useContract, useRefresh } from "@hooks";
import Video from "@components/video";
import { checkKeplr } from "src/context/WalletProvider";
import { useAppSelector } from "@app/hooks";
// import { CustomWalletContext } from "@context";

const NftItem = ({ overlay, item }) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const [isPendingTx, setIsPendingTx] = useState(false);
    const [previewType, setPreviewType] = useState("image");
    // console.log("item", item.token_id, previewType);
    const { sellNft, withdrawNft, buyNft, setBid, acceptBid } = useContract();
    const { connect, connectedWallet } = useWalletManager();
    const { second: value } = useRefresh();
    const users = useAppSelector((state) => state.users.byAddress);
    const userInfo = users[item.seller || item.owner];

    const isOwner = item.owner && item.owner === connectedWallet?.address;
    // const { connectedWallet } = useContext(CustomWalletContext);
    const nftInfo = useMemo(() => {
        const { price } = item;
        const bids =
            item.bids?.max_bid &&
            !Number.isNaN(item.bids.max_bid) &&
            Number(item.bids.max_bid) > 0
                ? item.bids
                : null;
        const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
        const expired = expiresAt && Number(new Date()) - Number(expiresAt) > 0;
        const image = item.image_url;
        let buttonString = isOwner ? "Sell" : "";
        if (price) {
            if (connectedWallet?.address === item.seller) {
                if (item.sale_type !== "auction") {
                    buttonString = "Withdraw";
                } else if (expired && Number(bids?.max_bid) > 0) {
                    buttonString = "Accept Bid";
                } else {
                    buttonString = "Withdraw";
                }
            } else if (item.sale_type === "auction") {
                buttonString = expired ? "" : "Set a Bid";
            } else {
                buttonString = "Buy";
            }
        }
        return { price, buttonString, image, expiresAt, expired, bids };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectedWallet, item, isOwner, value]);

    const defaultAmount = useMemo(() => {
        if (nftInfo.bids) {
            return Number(nftInfo.bids.max_bid) / 1e6;
        }
        if (nftInfo.price) {
            return nftInfo.price.amount / 1e6;
        }
        return undefined;
    }, [nftInfo.bids, nftInfo.price]);

    const handleBidModal = async () => {
        if (!connectedWallet) {
            connect();
            await checkKeplr();
        } else if (nftInfo.buttonString === "Withdraw") {
            await withdrawNft(item);
        } else {
            setShowBidModal((prev) => !prev);
        }
    };

    const handleNft = async (amount, extraOption, callback) => {
        if (isPendingTx) return;
        setIsPendingTx(true);
        if (!nftInfo.price) {
            try {
                await sellNft(item, amount, extraOption);
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                setIsPendingTx(false);
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
                setIsPendingTx(false);
                callback();
            }
        } else if (item.sale_type === "auction") {
            try {
                await setBid(item, { amount, denom: ChainConfig.microDenom });
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                setIsPendingTx(false);
                callback();
            }
        } else {
            try {
                await buyNft(item);
                setShowBidModal(false);
                // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
                setIsPendingTx(false);
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
                            path={`/explore/${item.token_id}?collection=${item.token_address}`}
                        >
                            {previewType === "image" && (
                                <Image
                                    src={nftInfo.image}
                                    alt=""
                                    width={533}
                                    height={533}
                                    onError={() => {
                                        setPreviewType("video");
                                    }}
                                    // onLoadingComplete={(result) => {
                                    //     console.log(
                                    //         "item",
                                    //         item.token_id,
                                    //         result
                                    //     );
                                    // }}
                                />
                            )}
                            {previewType === "video" && (
                                <Video
                                    src={nftInfo.image}
                                    autoPlay
                                    muted
                                    loop
                                    fit
                                />
                            )}
                        </Anchor>
                    )}
                    {nftInfo.expiresAt && (
                        <CountdownTimer
                            date={nftInfo.expiresAt.toString()}
                            completedString="Auction Expired!"
                        />
                    )}
                    {nftInfo.buttonString && (
                        <Button onClick={handleBidModal} size="small">
                            {nftInfo.buttonString}
                        </Button>
                    )}
                </div>
                <div className="product-share-wrapper">
                    <div
                        style={{ width: "100%", height: "1.5em" }}
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
                        {nftInfo.bids && (
                            <span
                                style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                }}
                                className="more-author-text"
                            >
                                {Number(nftInfo.bids.max_bid) / 1e6} $Heart by{" "}
                                {getFullName(
                                    users[nftInfo.bids.max_bidder]?.first_name,
                                    users[nftInfo.bids.max_bidder]?.last_name
                                ) || nftInfo.bids.max_bidder}
                            </span>
                        )}
                    </div>

                    {/* {!disableShareDropdown && <ShareDropdown />} */}
                </div>
                {/* <Anchor path={`/product/${item.tokenId}`}> */}
                <Anchor
                    path={`/explore/${item.token_id}?collection=${item.token_address}`}
                >
                    <span className="product-name">{item.token_id}</span>
                </Anchor>
                <Anchor path={`/explore/collections/${item.token_address}`}>
                    <div
                        style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                        className="latest-bid"
                    >
                        {item.collection}
                    </div>
                </Anchor>
                {(item.seller || item.owner) && (
                    <div
                        style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                        title={item.seller}
                        className="latest-bid"
                    >
                        <Anchor path={`/profile/${item.seller || item.owner}`}>
                            {getFullName(
                                userInfo?.first_name,
                                userInfo?.last_name
                            ) ||
                                item.seller ||
                                item.owner}
                        </Anchor>
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

// export default NftItem;

export default memo(NftItem);
