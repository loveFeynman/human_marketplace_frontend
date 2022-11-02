import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ShareModal from "@components/modals/share-modal";
import ReportModal from "@components/modals/report-modal";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";

const ShareDropdown = ({ isOwner = false, isNft = false }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const handleShareModal = () => {
        setShowShareModal((prev) => !prev);
    };
    const handleReportModal = () => {
        setShowReportModal((prev) => !prev);
    };

    async function submitReport(values) {
        //let buttonText, setButtonText;
        //let disabled, setDisabled;
        handleReportModal(); //close modal after reporting
        //console.log(values);
        toast.success("Report sent"); //confirmation message - moved outside of try catch block for faster confirmation
        let config = {
            method: "post",
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
            headers: {
                "Content-Type": "application/json",
            },
            data: values,
        };
        //reset() //clear form
        try {
            //setButtonText("Sending...");
           // setDisabled((value) => !value);
            const response = await axios(config);
            //console.log("response = ", response);
            if (response.status == 200) {
               // setDisabled((value) => !value);
                //setButtonText("Report");
                console.log("email sent")
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
            //setDisabled((value) => !value);
            //setButtonText("Report");
        }
    }

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
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-flag"
                    >
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" y1="22" x2="4" y2="15"></line>
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
            <ShareModal isNft={isNft} show={showShareModal} handleModal={handleShareModal} />
            <ReportModal
                show={showReportModal}
                handleModal={handleReportModal}
                submitReport={submitReport}
            />
        </>
    );
};

export default ShareDropdown;
