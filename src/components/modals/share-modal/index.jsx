/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import { useMemo, useRef } from "react";
import ReactDOM from "react-dom";

// import { usePath } from "@hooks";
const facebookSharer = "https://www.facebook.com/sharer/sharer.php?u=";
const twitterSharer = "https://twitter.com/intent/tweet?url=";
const linkedinSharer = "https://www.linkedin.com/sharing/share-offsite/?url=";

const ShareModal = ({ show, handleModal, isNft }) => {
    const router = useRouter();
    const link = useMemo(() => {
        const origin =
            typeof window !== "undefined" && window.location.origin
                ? window.location.origin
                : "";
        const path = origin.replace(/^https?:\/\//, "") + router.asPath;
        return path;
    }, [router]);
    const ref = useRef(null);

    function copyLink(param) {
        navigator.clipboard.writeText(param);
        const copyMessage = `Copied: ${param}`;
        ReactDOM.render(copyMessage, ref.current);
    }
    return (
        <Modal
            className="rn-popup-modal share-modal-wrapper"
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

            <Modal.Header className="share-area">
                <h5 className="modal-title">
                    {`Share this ${isNft ? "NFT" : "Profile"}`}
                </h5>
            </Modal.Header>
            <Modal.Body>
                <ul className="social-share-default">
                    <li>
                        <a href={facebookSharer + link} target="__blank">
                            <span className="icon">
                                <i className="feather-facebook" />
                            </span>
                            <span className="text">facebook</span>
                        </a>
                    </li>
                    <li>
                        <a href={twitterSharer + link} target="__blank">
                            <span className="icon">
                                <i className="feather-twitter" />
                            </span>
                            <span className="text">twitter</span>
                        </a>
                    </li>
                    <li>
                        <a href={linkedinSharer + link} target="__blank">
                            <span className="icon">
                                <i className="feather-linkedin" />
                            </span>
                            <span className="text">linkedin</span>
                        </a>
                    </li>
                    <li onClick={() => copyLink(link)}>
                        <a target="__blank" role="button">
                            <span className="icon">
                                <i className="feather-link" />
                            </span>
                            <span className="text">copy link</span>
                        </a>
                    </li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <div className="mx-auto text-break" ref={ref} id="messageDiv" />
            </Modal.Footer>
        </Modal>
    );
};

ShareModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
    isNft: PropTypes.bool,
};
export default ShareModal;
