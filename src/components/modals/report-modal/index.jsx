import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";
// import { useState, useRef } from "react";
import ReportForm from "./form";

const ReportModal = ({ show, handleModal }) => (
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
            <ReportForm />
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
);

ReportModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
};
export default ReportModal;
