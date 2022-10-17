import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
//import { usePath } from "@hooks";

function getPath() {
    const router = useRouter()
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';
    const path = origin.replace(/^https?:\/\//, '') + router.asPath
    return path
}

const facebookSharer = 'https://www.facebook.com/sharer/sharer.php?u=';
const twitterSharer = 'https://twitter.com/intent/tweet?url=';
const linkedinSharer = 'https://www.linkedin.com/sharing/share-offsite/?url=';
const ShareModal = ({ show, handleModal }) => (
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
            <h5 className="modal-title">Share this NFT</h5>
        </Modal.Header>
        <Modal.Body>
            <ul className="social-share-default">
                <li>
                    <a
                        href={facebookSharer+getPath()}
                        target="__blank"
                    >
                        <span className="icon">
                            <i className="feather-facebook" />
                        </span>
                        <span className="text">facebook</span>
                    </a>
                </li>
                <li>
                    <a href={twitterSharer+getPath()} target="__blank">
                        <span className="icon">
                            <i className="feather-twitter" />
                        </span>
                        <span className="text">twitter</span>
                    </a>
                </li>
                <li>
                    <a
                        href={linkedinSharer+getPath()}
                        target="__blank"
                    >
                        <span className="icon">
                            <i className="feather-linkedin" />
                        </span>
                        <span className="text">linkedin</span>
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.instagram.com/humansdotai/"
                        target="__blank"
                    >
                        <span className="icon">
                            <i className="feather-instagram" />
                        </span>
                        <span className="text">instagram</span>
                    </a>
                </li>
            </ul>
        </Modal.Body>
    </Modal>
);

ShareModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
};
export default ShareModal;