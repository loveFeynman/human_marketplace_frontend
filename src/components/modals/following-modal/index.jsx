import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import clsx from "clsx";
import Button from "@ui/button";
import { useAxios } from "@hooks";
import Anchor from "@ui/anchor";
import Image from "next/image";
import { getImageFromHash } from "@utils/ipfs";
import { getReducedAddress } from "@utils/index";
import { useWalletManager } from "@noahsaso/cosmodal";

const FollowingModal = ({ show, handleModal, follow, isFollowing, fetchFollow }) => {
    const [users, setUsers] = useState([]);
    const [myFollow, setMyFollow] = useState({});
    const { fetchAllUsers, handleFollow, fetchFollowInfo } = useAxios();
    const { connectedWallet } = useWalletManager();

    const fetchMyFollow = async () => {
        if (connectedWallet?.address) {
            const followInfo = await fetchFollowInfo(connectedWallet?.address);
            setMyFollow({
                from: followInfo?.from?.map((_data) => _data.to_address),
                to: followInfo?.to?.map((_data) => _data.from_address),
            });
        }
    };

    useEffect(() => {
        (async () => {
            fetchMyFollow();
            const users = await fetchAllUsers();
            setUsers(users || []);
        })()
    }, [])

    const handleFollowClick = async ( userAddress ) => {
        await handleFollow(connectedWallet?.address, userAddress);
        fetchMyFollow();
        await fetchFollow();
    };

    return (
        <Modal
            className="rn-popup-modal report-modal-wrapper"
            show={show}
            onHide={handleModal}
            centered
        >
            {show && (
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleModal}
                >
                    <i className="feather-x" />
                </button>
            )}
            <Modal.Header className="report-modal-header">
                <h5 className="modal-title">{isFollowing? "Following" : "Followers"}</h5>
            </Modal.Header>
            <Modal.Body>
                <div
                className={clsx(
                    "rn-creators-area right-fix-notice creators",
                )}
            >
                <div className="rn-notification-wrapper creators">
                    {users.map((user, index) => {
                        const logoUrl = user.cover
                            ? getImageFromHash(user.cover)
                            : "/images/bg/bg-image-9.png";
                        // if (connectedWallet?.address === user.wallet) return null;
                        // if (isFollowing || (follow?.to || []).includes(user.wallet)) {
                        if ((follow?.[isFollowing? "from" : "to"] || []).includes(user.wallet)) {
                            if (!connectedWallet?.address && !(follow?.from || []).includes(user.wallet)) return null;
                            const isFollowingCrrUser = (myFollow?.from || []).includes(user.wallet);
                            return (
                                <div className={clsx("top-seller-inner-one")} key={user.hash || index}>
                                    <div className="top-seller-wrapper">
                                        <div className={clsx("thumbnail", "varified")}>
                                            <Image
                                                src={logoUrl}
                                                alt={user.hash}
                                                width={54}
                                                height={54}
                                                layout="fixed"
                                            />
                                        </div>
                                        <div className="top-seller-content following-user-info">
                                            <Anchor path={`/profile/${user.wallet}`}>
                                                <h6 className="name">{[user.first_name || "", user.last_name || ""].join(" ")}</h6>
                                            </Anchor>
                                            <span className="count-number">
                                                {/* {new Intl.NumberFormat("en-US", {
                                                    currency: "USD",
                                                }).format(total_sale)} */}
                                                {(connectedWallet?.address)? getReducedAddress(user.wallet) : user.wallet}
                                            </span>
                                        </div>
                                    </div>
                                    {connectedWallet?.address && connectedWallet?.address !== user.wallet && (
                                        <Button 
                                            className="following-button"
                                            color="primary-alta" 
                                            size="small" 
                                            onClick={() => {
                                                handleFollowClick(user.wallet)
                                            }}
                                        >
                                            <span className="not-hovering-span">{isFollowingCrrUser? "Following" : "Follow"}</span>
                                            <span className="hovering-span">{isFollowingCrrUser? "Unfollow" : "Follow"}</span>
                                        </Button>
                                    )}
                                </div>
                            )

                        }
                    })}
                </div>
            </div>
            </Modal.Body>
        </Modal>
    )
};

FollowingModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
};
export default FollowingModal;