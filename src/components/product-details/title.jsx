/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import ShareModal from "@components/modals/share-modal";
import ReportModal from "@components/modals/report-modal";
// import ShareDropdown from "../share-dropdown";

const ProductTitle = ({ className, title, isOwner, isNft }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const shareModalHandler = () => setIsShareModalOpen((prev) => !prev);
    const handleReportModal = () => setShowReportModal((prev) => !prev);
    return (
        <>
            <ShareModal
                show={isShareModalOpen}
                handleModal={shareModalHandler}
                isNft={isNft}
            />
            <ReportModal
                show={showReportModal}
                handleModal={handleReportModal}
            />
            <div className={clsx("pd-title-area", className)}>
                <h4 className="title">{title}</h4>
                <div className="pd-react-area author-button-area">
                    {/* <div className="heart-count">
                        <i className="feather-heart" />
                        <span>{likeCount}</span>
                    </div> */}
                    {/* <div className="count">
                        <ShareDropdown isOwner={isOwner} isNft />
                    </div> */}
                    <button
                        type="button"
                        className="btn at-follw share-button"
                        onClick={shareModalHandler}
                    >
                        <i className="feather-share-2" />
                    </button>

                    {!isOwner && (
                        <button
                            type="button"
                            // className="btn-setting-text report-text"
                            className="btn at-follw"
                            onClick={handleReportModal}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-flag"
                            >
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" y1="22" x2="4" y2="15" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

ProductTitle.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    isOwner: PropTypes.bool,
    // likeCount: PropTypes.number,
};

// ProductTitle.defaultProps = {
//     likeCount: 0,
// };

export default ProductTitle;
