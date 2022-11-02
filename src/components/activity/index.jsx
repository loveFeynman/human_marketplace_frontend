/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import Anchor from "@ui/anchor";
import usePickNft from "src/hooks/use-pick-nft";
import { useMemo } from "react";
import { useWalletManager } from "@noahsaso/cosmodal";
// import { getStandardTime } from "@utils/index";

const ACTION_STRING = {
    human_marketplace_accept_bid: {
        buy: "Bought for a bid price of",
        sell: "Sold for a bid price of",
    },
    human_marketplace_buy_fixed_price: {
        buy: "Bought for a fixed price of ",
        sell: "Sold for a fixed price of ",
    },
};

const Activity = ({
    className,
    time,
    token_id,
    collection,
    author,
    buyer,
    action,
    price,
}) => {
    const { nftInfo: selectedNft } = usePickNft(token_id, collection) || {};
    const { connectedWallet } = useWalletManager();
    const standardDate = new Date(Number(time) * 1000).toISOString();
    const date = standardDate && standardDate.split("T")[0];
    const exactTime = standardDate && standardDate.split("T")[1].split(".")[0];
    const description = useMemo(() => {
        const isBuyer = connectedWallet?.address === buyer;
        const priceNumber = Number(price) / 1e6;
        return `${
            ACTION_STRING[action][isBuyer ? "buy" : "sell"]
        } ${priceNumber} $HEART`;
    }, [action, buyer, connectedWallet?.address, price]);

    return (
        <div className={clsx("single-activity-wrapper", className)}>
            <div className="inner">
                <div className="read-content">
                    <div className="thumbnail">
                        <Anchor
                            path={`/explore/${token_id}?collection=${collection}`}
                        >
                            <Image
                                src={
                                    selectedNft.image_url ||
                                    "/images/collection/collection-sm-01.jpg"
                                }
                                alt="Nft_Profile"
                                width={500}
                                height={500}
                            />
                        </Anchor>
                    </div>
                    <div className="content">
                        <Anchor
                            path={`/explore/${token_id}?collection=${collection}`}
                        >
                            <h6 className="title">{selectedNft.token_id}</h6>
                        </Anchor>
                        {/* <p dangerouslySetInnerHTML={{ __html: desc }} /> */}
                        <p>{description}</p>
                        <div className="time-maintane">
                            <div className="time data">
                                <i className="feather-clock" />
                                <span>
                                    {exactTime} on {date}
                                </span>
                            </div>
                            <div className="user-area data">
                                <i className="feather-user" />
                                <Anchor path={author.slug}>
                                    {author.name}
                                </Anchor>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="icone-area">
                    {status === "follow" && <i className="feather-thumbs-up" />}
                    {status === "sale" && (
                        <i className="feather-shopping-cart" />
                    )}
                    {status === "like" && <i className="feather-heart" />}
                    {status === "offer" && <i className="feather-user-plus" />}
                </div> */}
            </div>
        </div>
    );
};

Activity.propTypes = {
    className: PropTypes.string,
    // title: PropTypes.string.isRequired,
    // path: PropTypes.string.isRequired,
    // desc: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    buyer: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
    }).isRequired,
    // image: PropTypes.shape({
    //     src: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
    //         .isRequired,
    //     alt: PropTypes.string,
    //     width: PropTypes.number,
    //     height: PropTypes.number,
    // }).isRequired,
    // status: PropTypes.oneOf(["follow", "sale", "like", "offer"]),
};

export default Activity;
