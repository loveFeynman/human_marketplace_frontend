import { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Image from "next/image";
import Anchor from "@ui/anchor";
import Button from "@ui/button";
import PlaceBidModal from "@components/modals/placebid-modal";
import Countdown from "@ui/countdown/layout-02";
import { ImageType } from "@utils/types";
import { pinataUrl } from "@constant";

const PlaceBet = ({ highest_bid, auction_date, btnColor, className }) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };
    return (
        <>
            <div className={clsx("place-bet-area", className)}>
                <div className="rn-bet-create">
                    <div className="bid-list winning-bid">
                        <h6 className="title">Winning bid</h6>
                        <div className="top-seller-inner-one">
                            <div className="top-seller-wrapper">
                                {highest_bid.logo && (
                                    <div className="thumbnail">
                                        <Anchor path={highest_bid.slug}>
                                            <Image
                                                src={`${pinataUrl}/${highest_bid.logo}`}
                                                alt="Nft_Profile"
                                                width={44}
                                                height={44}
                                                layout="fixed"
                                            />
                                        </Anchor>
                                    </div>
                                )}

                                <div className="top-seller-content">
                                    <span className="heighest-bid">
                                        Heighest bid{" "}
                                        <Anchor path={highest_bid.slug}>
                                            {highest_bid.name}
                                        </Anchor>
                                    </span>
                                    <span className="count-number">
                                        {highest_bid.price} HEART
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {auction_date && (
                        <div className="bid-list left-bid">
                            <h6 className="title">Auction has ended</h6>
                            <Countdown className="mt--15" date={auction_date} />
                        </div>
                    )}
                </div>
                <Button
                    color={btnColor || "primary-alta"}
                    className="mt--30"
                    onClick={handleBidModal}
                >
                    Place a Bid
                </Button>
            </div>
            <PlaceBidModal show={showBidModal} handleModal={handleBidModal} />
        </>
    );
};

PlaceBet.propTypes = {
    highest_bid: PropTypes.shape({
        amount: PropTypes.string,
        bidder: PropTypes.string,
    }),
    auction_date: PropTypes.string,
    btnColor: PropTypes.string,
    className: PropTypes.string,
};

export default PlaceBet;
