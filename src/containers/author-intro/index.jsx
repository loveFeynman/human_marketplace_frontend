import ShareModal from "@components/modals/share-modal";
import ShareDropdown from "@components/share-dropdown";
import { useWalletManager } from "@noahsaso/cosmodal";
import Anchor from "@ui/anchor";
import clsx from "clsx";
import Image from "next/image";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useAppSelector } from "@app/hooks";
import { getImageFromHash } from "@utils/ipfs";

const AuthorIntroArea = ({ className, space }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { connectedWallet } = useWalletManager();
    const shareModalHandler = () => setIsShareModalOpen((prev) => !prev);
    const userInfo = useAppSelector((state) => state.user.userInfo);

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
            name: connectedWallet?.name || "",
            followers: 0,
            following: 0,
        };
        return result;
    }, [connectedWallet, userInfo.cover, userInfo.logo]);

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
                                        <a
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="social-follw"
                                        >
                                            <i className="feather-twitter" />
                                            <span className="user-name">
                                                {userData.twitter}
                                            </span>
                                        </a>
                                        <div className="follow-area">
                                            <div className="follow followers">
                                                <span>
                                                    {userData.followers}{" "}
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
                                                    {userData.following}{" "}
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
                                            {/* <span className="btn at-follw follow-button">
                                                <i className="feather-user-plus" />
                                                Follow
                                            </span> */}
                                            <button
                                                type="button"
                                                className="btn at-follw share-button"
                                                onClick={shareModalHandler}
                                            >
                                                <i className="feather-share-2" />
                                            </button>

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
