import { useRouter } from "next/router";
import ShareModal from "@components/modals/share-modal";
import ShareDropdown from "@components/share-dropdown";
import { useWalletManager } from "@noahsaso/cosmodal";
import Anchor from "@ui/anchor";
import clsx from "clsx";
import Image from "next/image";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { getImageFromHash } from "@utils/ipfs";
import { useEffect } from "react";
import { useAxios } from "src/hooks";

const UserIntroArea = ({ className, space }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [follow, setFollow] = useState({});
    const { fetchUserInfo, fetchFollowInfo, handleFollow } = useAxios();
    const { connectedWallet } = useWalletManager();
    const { asPath } = useRouter();
    const userAddress = asPath.split("/")[2];

    //insert social media icons with links if user added this information in edit-profile
    function insertTwitter() {
        if (userData.twitter.length > 0) {
            const twitterLink = "https://twitter.com/" + userData.twitter;
            return (
                <a
                    href={twitterLink}
                    target="_blank"
                    rel="noreferrer"
                    className="social-follw"
                >
                    <i className="feather-twitter" />
                    <span className="user-name"> {userData.twitter}</span>
                </a>
            );
        }
    }

    function insertInstagram() {
        if (userData.instagram.length > 0) {
            const instagramLink = "https://instagram.com/" + userData.instagram;
            return (
                <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="social-follw"
                >
                    <i className="feather-instagram" />
                    <span className="user-name"> {userData.instagram}</span>
                </a>
            );
        }
    }

    const fetchFollow = async () => {
        const followInfo = await fetchFollowInfo(userAddress);
        setFollow({
            from: followInfo.from.map((_data) => _data.to_address),
            to: followInfo.to.map((_data) => _data.from_address),
        });
    };
    useEffect(() => {
        (async () => {
            const info = await fetchUserInfo(userAddress);
            setUserInfo(info);
            await fetchFollow();
        })();
    }, [userAddress]);

    const shareModalHandler = () => setIsShareModalOpen((prev) => !prev);
    const handleFollowClick = async () => {
        await handleFollow(connectedWallet?.address, userAddress);
        await fetchFollow();
    };
    const userData = useMemo(() => {
        const result = {
            background: {
                src: userInfo.cover
                    ? getImageFromHash(userInfo.cover)
                    : "/images/bg/bg-image-9.png",
            },
            image: {
                alt: "",
                src: userInfo.logo
                    ? getImageFromHash(userInfo.logo)
                    : "/images/icons/boy-avater.png",
            },
            name: userInfo.first_name || "",
            twitter: userInfo.twitter || "",
            instagram: userInfo.instagram || "",
        };
        return result;
    }, [userInfo.first_name, userInfo.cover, userInfo.logo]);

    return (
        <>
            <ShareModal
                show={isShareModalOpen}
                handleModal={shareModalHandler}
            />
            <div className="rn-author-bg-area position-relative ptb--150">
                <Image
                    src={userData.background.src}
                    alt="Slider BG"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                />
            </div>
            <div
                className={clsx(
                    "rn-author-area",
                    space === 1 && "mb--30 mt_dec--120",
                    className
                )}
            >
                <div className="container">
                    <div className="row padding-tb-50 align-items-center d-flex">
                        <div className="col-lg-12">
                            <div className="author-wrapper">
                                <div className="author-inner">
                                    {userData?.image?.src && (
                                        <div className="user-thumbnail">
                                            <Image
                                                src={userData.image.src}
                                                alt={
                                                    userData.image?.alt ||
                                                    userData.name
                                                }
                                                width={140}
                                                height={140}
                                                layout="fixed"
                                            />
                                        </div>
                                    )}

                                    <div className="rn-author-info-content">
                                        <h4 className="title">
                                            {userData.name}
                                        </h4>
                                        {/* <a
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="social-follw"
                                        >
                                            <i className="feather-twitter" />
                                            <span className="user-name">
                                                {userData.twitter}
                                            </span>
                                        </a> */}
                                        <div className="mb-1 d-flex justify-content-center gap-5">
                                            {userData.twitter? insertTwitter() : ''}
                                            {userData.instagram? insertInstagram() : ''}
                                        </div>

                                        <div className="follow-area">
                                            <div className="follow followers">
                                                <span>
                                                    {follow.to &&
                                                        follow.to.length}{" "}
                                                    <a
                                                        href="https://twitter.com"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="color-body"
                                                    >
                                                        followers
                                                    </a>
                                                </span>
                                            </div>

                                            <div className="follow following">
                                                <span>
                                                    {follow.from &&
                                                        follow.from.length}{" "}
                                                    <a
                                                        href="https://twitter.com"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="color-body"
                                                    >
                                                        following
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="author-button-area">
                                            {connectedWallet && (
                                                <span
                                                    className="btn at-follw follow-button"
                                                    onClick={handleFollowClick}
                                                >
                                                    <i className="feather-user-plus" />
                                                    {follow.to &&
                                                    follow.to.includes(
                                                        connectedWallet?.address
                                                    )
                                                        ? "Unfollow"
                                                        : "Follow"}
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                className="btn at-follw share-button"
                                                onClick={shareModalHandler}
                                            >
                                                <i className="feather-share-2" />
                                            </button>

                                            <div className="count at-follw">
                                                <ShareDropdown />
                                            </div>
                                            {/* <Anchor
                                                path="/edit-profile"
                                                className="btn at-follw follow-button edit-btn"
                                            >
                                                <i className="feather feather-edit" />
                                            </Anchor> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

UserIntroArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};
UserIntroArea.defaultProps = {
    space: 1,
};

export default UserIntroArea;
