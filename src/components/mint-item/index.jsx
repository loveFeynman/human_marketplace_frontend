/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
// import Anchor from "@ui/anchor";
// import ClientAvatar from "@ui/client-avatar";
import Button from "@ui/button";
import CountdownTimer from "@ui/countdown/layout-01";
// import ShareDropdown from "@components/share-dropdown";
import PurchaseModal from "@components/modals/purchase-modal";
import { ImageType } from "@utils/types";
import { useContract } from "@hooks";
import { ChainConfig } from "@constant";
import { toast } from "react-toastify";
// import { CustomWalletContext } from "@context";

const MintItem = ({
    title,
    // slug,
    price,
    // latestBid,
    image,
    // authors,
    // bitCount,
    // likeCount,
    total_supply,
    className,
    contractAddress,
    filter,
}) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const [stateInfo, setStateInfo] = useState({});
    const [show, setShow] = useState(false);
    const { runQuery, runExecute } = useContract();
    const { connectedWallet } = useWalletManager();
    // const { connectedWallet } = useContext(CustomWalletContext);

    const fetchStateInfo = async () => {
        const stateInfoResult = await runQuery(contractAddress, {
            get_state_info: {},
        });
        if (
            filter === "all" ||
            stateInfoResult?.start_mint_time < Date.now() / 1000
        ) {
            setShow(true);
        }
        setStateInfo(stateInfoResult || {});
    };

    useEffect(() => {
        fetchStateInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const mintInfo = useMemo(() => {
        const priceInfo = stateInfo.is_public_mint
            ? stateInfo.public_price?.amount
            : stateInfo.private_price?.amount;
        const mintPrice =
            connectedWallet?.address === stateInfo.admin
                ? 0
                : Number(priceInfo);

        const startMintTime =
            stateInfo.start_mint_time &&
            new Date(stateInfo.start_mint_time * 1000);

        return { mintPrice, startMintTime };
    }, [stateInfo, connectedWallet]);

    const handleBidModal = () => {
        if (!connectedWallet) {
            toast.error("Connect wallet!");
            return;
        }
        const isBefore =
            mintInfo.startMintTime &&
            Number(new Date()) < Number(mintInfo.startMintTime);
        if (isBefore) {
            toast.error("Mint is not started!");
            return;
        }
        setShowBidModal(true);
    };

    const handleMint = async (amount, extraOption, callback) => {
        try {
            if (amount) {
                await runExecute(
                    contractAddress,
                    {
                        mint: {},
                    },
                    {
                        funds: `${amount}`,
                    }
                );
            } else {
                await runExecute(contractAddress, {
                    mint: {},
                });
            }

            toast.success("Success!");
            setShowBidModal(false);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e, contractAddress, amount);
            toast.error(`Fail!`);
        } finally {
            callback();
        }
    };

    return show ? (
        <>
            <div className={clsx("lg-product-wrapper", className)}>
                <div className="inner">
                    <div className="lg-left-content">
                        {image?.src && (
                            // <Anchor
                            //     path={`/product/${slug}`}
                            //     className="thumbnail"
                            // >
                            //     <Image
                            //         src={image.src}
                            //         alt={image?.alt || "NFT_portfolio"}
                            //         width={image?.width ? image.width : 430}
                            //         height={image?.height ? image.height : 430}
                            //     />
                            // </Anchor>
                            <Image
                                src={image.src}
                                alt={image?.alt || "NFT_portfolio"}
                                width={image?.width ? image.width : 430}
                                height={image?.height ? image.height : 430}
                            />
                        )}
                        <div className="read-content">
                            <div className="product-share-wrapper">
                                {/* <div className="profile-share">
                                    {authors?.map((author) => (
                                        <ClientAvatar
                                            key={author.name}
                                            slug={author.slug}
                                            name={author.name}
                                            image={author.image}
                                        />
                                    ))}
                                    <Anchor
                                        className="more-author-text"
                                        path={`/product/${slug}`}
                                    >
                                        {bitCount}+ Place Bit.
                                    </Anchor>
                                </div> */}
                                <div className="last-bid">
                                    {"Private Price: "}
                                    {Number(price.private.amount) / 1e6} $HEART
                                    &nbsp;
                                </div>
                                <div className="last-bid">
                                    {"Public Price: "}
                                    {Number(price.public.amount) / 1e6} $HEART
                                </div>
                            </div>
                            {/* <Anchor path={`/product/${slug}`}>
                                <h6 className="title">{title}</h6>
                            </Anchor> */}
                            <h6 className="title">
                                {title}
                                {`(${total_supply})`}
                            </h6>
                            {mintInfo.startMintTime && (
                                <CountdownTimer
                                    date={mintInfo.startMintTime.toString()}
                                    completedString="Mint Started!"
                                />
                            )}
                            {/* <span className="latest-bid">
                                Highest bid {latestBid}
                            </span> */}
                            {/* <div className="share-wrapper d-flex">
                                <div className="react-area mr--15">
                                    <svg
                                        viewBox="0 0 17 16"
                                        fill="none"
                                        width="16"
                                        height="16"
                                        className="sc-bdnxRM sc-hKFxyN kBvkOu"
                                    >
                                        <path
                                            d="M8.2112 14L12.1056 9.69231L14.1853 7.39185C15.2497
                                             6.21455 15.3683 4.46116 14.4723 3.15121V3.15121C13.3207
                                              1.46757 10.9637 1.15351 9.41139 2.47685L8.2112
                                               3.5L6.95566 2.42966C5.40738 1.10976 3.06841
                                                1.3603 1.83482 2.97819V2.97819C0.777858
                                                 4.36443 0.885104 6.31329 2.08779
                                                  7.57518L8.2112 14Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                    <span className="number">{likeCount}</span>
                                </div>
                                <ShareDropdown />
                            </div> */}
                        </div>
                    </div>
                    <Button
                        color="primary-alta"
                        size="medium"
                        className="mr--30 bid-btn"
                        onClick={handleBidModal}
                    >
                        Mint
                    </Button>
                </div>
            </div>
            <PurchaseModal
                show={showBidModal}
                handleModal={() => setShowBidModal(false)}
                generalOptions={{
                    title: `Mint ${title}`,
                    buttonString: "Mint",
                }}
                amountOptions={{
                    defaultAmount: mintInfo.mintPrice / 1e6,
                    denom: ChainConfig.microDenom,
                    disabled: true,
                }}
                handleClickConfirm={handleMint}
            />
        </>
    ) : null;
};

MintItem.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    contractAddress: PropTypes.string.isRequired,
    filter: PropTypes.string,
    // slug: PropTypes.string.isRequired,
    price: PropTypes.shape({
        public: PropTypes.shape({
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            currency: PropTypes.string.isRequired,
        }),
        private: PropTypes.shape({
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            currency: PropTypes.string.isRequired,
        }),
    }).isRequired,
    // latestBid: PropTypes.string.isRequired,
    image: ImageType.isRequired,
    // authors: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         name: PropTypes.string.isRequired,
    //         slug: PropTypes.string.isRequired,
    //         image: ImageType.isRequired,
    //     })
    // ),
    // bitCount: PropTypes.number,
    // likeCount: PropTypes.number,
};

MintItem.defaultProps = {
    // likeCount: 0,
};

export default MintItem;
