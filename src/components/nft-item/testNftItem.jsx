import { useMemo } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
import Anchor from "@ui/anchor";
// import ClientAvatar from "@ui/client-avatar";
// import ShareDropdown from "@components/share-dropdown";
// import ProductBid from "@components/product-bid";
// import { ImageType } from "@utils/types";
import { NftType } from "@utils/types";
// import { CustomWalletContext } from "@context";

const NftItem = ({ overlay, item }) => {
    const { connectedWallet } = useWalletManager();
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
    return (
        <div
            className={clsx(
                "product-style-one with-placeBid",
                !overlay && "no-overlay"
            )}
        >
            <div className="card-thumbnail">
                {nftInfo.image && (
                    <Anchor
                        path={`/fortest/${item.token_id}?collection=${item.token_address}`}
                    >
                        <Image
                            src={nftInfo.image}
                            alt=""
                            width={533}
                            height={533}
                        />
                    </Anchor>
                )}
            </div>
            <div className="product-share-wrapper" />
            <Anchor
                path={`/fortest/${item.token_id}?collection=${item.token_address}`}
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
                        {nftInfo.price.amount / 1e6} {nftInfo.price.denom}
                    </div>
                </div>
            )}
            {/* <ProductBid price={price} likeCount={likeCount} /> */}
        </div>
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
