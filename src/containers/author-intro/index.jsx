/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import ShareModal from "@components/modals/share-modal";
import FollowingModal from "@components/modals/following-modal";
// import ShareDropdown from "@components/share-dropdown";
import { useWalletManager } from "@noahsaso/cosmodal";
import Anchor from "@ui/anchor";
import clsx from "clsx";
import Image from "next/image";
import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
import { useAppSelector } from "@app/hooks";
import { getImageFromHash } from "@utils/ipfs";
import { useAxios } from "src/hooks";

const AuthorIntroArea = ({ className, space }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { connectedWallet } = useWalletManager();
    const shareModalHandler = () => setIsShareModalOpen((prev) => !prev);
    const handleFollowingModal = () => setIsFollowingModalOpen((prev) => !prev);
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const [follow, setFollow] = useState({});
    const { fetchFollowInfo } = useAxios();

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
                    : "/images/icons/avatar.png",
            },
            name: userInfo.first_name || "",
            twitter: userInfo.twitter || "",
            instagram: userInfo.instagram || "",
            followers: 0,
            following: 0,
        };
        return result;
    }, [
        userInfo.cover,
        userInfo.first_name,
        userInfo.instagram,
        userInfo.logo,
        userInfo.twitter,
    ]);

    // insert social media icons with links if user added this information in edit-profile
    // const insertTwitter = () => {
    //     if (userData.twitter.length > 0) {
    //         const twitterLink = `https://twitter.com/${userData.twitter}`;
    //         return (
    //             <a
    //                 href={twitterLink}
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="social-follw"
    //             >
    //                 <i className="feather-twitter" />
    //                 <span className="user-name"> {userData.twitter}</span>
    //             </a>
    //         );
    //     }
    // };

    // const insertInstagram = () => {
    //     if (userData.instagram.length > 0) {
    //         const instagramLink = `https://instagram.com/${userData.instagram}`;
    //         return (
    //             <a
    //                 href={instagramLink}
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="social-follw"
    //             >
    //                 <i className="feather-instagram" />
    //                 <span className="user-name"> {userData.instagram}</span>
    //             </a>
    //         );
    //     }
    // };

    const fetchFollow = async () => {
        const followInfo = await fetchFollowInfo(connectedWallet?.address);
        setFollow({
            from: followInfo.from.map((_data) => _data.to_address),
            to: followInfo.to.map((_data) => _data.from_address),
        });
    };
    useEffect(() => {
        (async () => {
            await fetchFollow();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <ShareModal
                show={isShareModalOpen}
                handleModal={shareModalHandler}
            />
            <FollowingModal
                show={isFollowingModalOpen}
                handleModal={handleFollowingModal}
                isFollowing={isFollowing}
                fetchFollow={fetchFollow}
                follow={follow}
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
                                        <div className="mb-1 d-flex justify-content-center gap-5">
                                            {userInfo.twitter && (
                                                <a
                                                    href={`https://twitter.com/${userInfo.twitter}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="social-follw"
                                                >
                                                    <i className="feather-twitter" />
                                                    <span className="user-name">
                                                        {userInfo.twitter}
                                                    </span>
                                                </a>
                                            )}
                                            {userInfo.instagram && (
                                                <a
                                                    href={`https://instagram.com/${userInfo.instagram}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="social-follw"
                                                >
                                                    <i className="feather-instagram" />
                                                    <span className="user-name">
                                                        {userInfo.instagram}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                        <div className="follow-area">
                                            <div
                                                className="follow followers"
                                                onClick={() => {
                                                    setIsFollowing(false);
                                                    handleFollowingModal();
                                                }}
                                            >
                                                <span>
                                                    {follow.to &&
                                                        follow.to.length}{" "}
                                                    <a className="color-body">
                                                        followers
                                                    </a>
                                                </span>
                                            </div>
                                            <div
                                                className="follow following"
                                                onClick={() => {
                                                    setIsFollowing(true);
                                                    handleFollowingModal();
                                                }}
                                            >
                                                <span>
                                                    {follow.from &&
                                                        follow.from.length}{" "}
                                                    <a className="color-body">
                                                        following
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="author-button-area">
                                            {/* <span className="btn at-follw follow-button">
                                                <i className="feather-user-plus" />
                                                Follow
                                            </span> */}
                                            {/* <button
                                                type="button"
                                                className="btn at-follw share-button"
                                                onClick={shareModalHandler}
                                            >
                                                <i className="feather-share-2" />
                                            </button> */}

                                            {/* <div className="count at-follw">
                                                <ShareDropdown isOwner />
                                            </div> */}
                                            <Anchor
                                                path="/edit-profile"
                                                className="btn at-follw follow-button edit-btn"
                                            >
                                                <i className="feather feather-edit" />
                                            </Anchor>
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

AuthorIntroArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};
AuthorIntroArea.defaultProps = {
    space: 1,
};

export default AuthorIntroArea;
