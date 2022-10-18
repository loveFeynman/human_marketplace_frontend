import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import ReactDOM from "react-dom";
import { useRef } from "react";

//import { usePath } from "@hooks";

const getPath = () => {
    const router = useRouter();
    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";
    const path = origin.replace(/^https?:\/\//, "") + router.asPath;
    return path;
};

function copyLink(link) {
    navigator.clipboard.writeText(link);
    const copyMessage = "Copied: " + link;
    ReactDOM.render(copyMessage, ref.current);
}

let link = "";
let ref = "";
const facebookSharer = "https://www.facebook.com/sharer/sharer.php?u=";
const twitterSharer = "https://twitter.com/intent/tweet?url=";
const linkedinSharer = "https://www.linkedin.com/sharing/share-offsite/?url=";

const ShareModal = ({ show, handleModal }) => (
    (link = getPath()),
    (ref = useRef(null)),
    (
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
                <div class="mx-auto" ref={ref} id="messageDiv"></div>
            </Modal.Footer>
        </Modal>
    )
);

ShareModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
};
export default ShareModal;
