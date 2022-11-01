/* eslint-disable react/prop-types */
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ShareModal from "@components/modals/share-modal";
import ReportModal from "@components/modals/report-modal";

const ShareDropdown = ({ isOwner = false, isNft = false }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const handleShareModal = () => {
        setShowShareModal((prev) => !prev);
    };
    const handleReportModal = () => {
        setShowReportModal((prev) => !prev);
    };
    return (
        <>
            <Dropdown className="share-btn share-btn-activation">
                <Dropdown.Toggle className="icon" variant="link" bsPrefix="p-0">
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
                </Dropdown.Toggle>

                <Dropdown.Menu className="share-btn-setting" align="end">
                    {/* {isOwner && ( */}
                    <button
                        type="button"
                        className="btn-setting-text share-text"
                        onClick={handleShareModal}
                    >
                        Share
                    </button>
                    {/* )} */}
                    {!isOwner && (
                        <button
                            type="button"
                            className="btn-setting-text report-text"
                            onClick={handleReportModal}
                        >
                            Report
                        </button>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <ShareModal
                isNft={isNft}
                show={showShareModal}
                handleModal={handleShareModal}
            />
            <ReportModal
                show={showReportModal}
                handleModal={handleReportModal}
            />
        </>
    );
};

export default ShareDropdown;
