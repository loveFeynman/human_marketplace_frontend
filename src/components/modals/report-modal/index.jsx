import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";

const getPath = () => {
    const router = useRouter();
    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";
    const path = origin + router.asPath;
    return path;
};


let thisPageURL;
//let buttonText, setButtonText;
//let disabled, setDisabled;
//let show, setShow;
let register, handleSubmit, formState, errors, reset;

const ReportModal = ({ show, handleModal, submitReport }) => (
    (thisPageURL = getPath()),
    //([buttonText, setButtonText] = useState("Report")),
    //([disabled, setDisabled] = useState(false)),
    ({
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()),
    (
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
                <h5 className="modal-title">Report this item</h5>
            </Modal.Header>
            <Modal.Body>
                <form
                    className="nuron-information"
                    onSubmit={handleSubmit(submitReport)}
                >
                    <input
                        type="hidden"
                        value={thisPageURL}
                        {...register("reportedNFT")}
                    />
                    <div className="report-form-box">
                        <div className="mb-4">
                            <label
                                htmlFor="contact-name"
                                className="form-label"
                            >
                                Your Name
                            </label>
                            <input
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: "Please enter your name",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Please enter your full name",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Name is too long",
                                    },
                                })}
                                id="contact-name"
                                type="text"
                                placeholder=""
                                className={`${
                                    errors.name ? ` border-danger ` : null
                                }`}
                            />
                            <span className="text-danger">
                                {errors?.name?.message}
                            </span>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Email" className="form-label">
                                Your Email
                            </label>
                            <input
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Please enter your email",
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "Your email is too short",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Email address too long",
                                    },
                                })}
                                id="Email"
                                type="text"
                                placeholder=""
                                className={`${
                                    errors.email ? ` border-danger ` : null
                                }`}
                            />
                            <span className="text-danger">
                                {errors?.email?.message}
                            </span>
                        </div>
                        <div>
                            <label
                                htmlFor="reportMessage"
                                className="form-label"
                            >
                                Why are you reporting?
                            </label>
                            <textarea
                                {...register("reportMessage", {
                                    required: {
                                        value: true,
                                        message: "Please enter a message",
                                    },
                                    minLength: {
                                        value: 8,
                                        message: "Your message is too short",
                                    },
                                    maxLength: {
                                        value: 1000,
                                        message:
                                            "Your message cannot be longer than 1000 characters",
                                    },
                                })}
                                id="report-message"
                                placeholder="Describe why you think this item should be removed from
                marketplace"
                                className={`${
                                    errors.reportMessage
                                        ? `border-2 border-danger `
                                        : null
                                } mb-0`}
                            />
                            <span className="text-danger">
                                {errors?.reportMessage?.message}
                            </span>
                        </div>

                        <div className="report-button">
                            <Button
                                type="submit"
                                size="medium"
                                className="mb-3 mt-5 w-100"
                            >
                                Report
                            </Button>
                        </div>
                    </div>
                </form>
                <Button
                    color="primary-alta"
                    size="medium"
                    className="w-100"
                    onClick={handleModal}
                >
                    Cancel
                </Button>
            </Modal.Body>
        </Modal>
    ),
);

ReportModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
};
export default ReportModal;
