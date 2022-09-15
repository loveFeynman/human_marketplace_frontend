import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import NftPreviewProduct from "@components/nft-preview-produc";

const NftPreviewModal = ({ show, handleModal, data }) => (
    <Modal
        className="rn-popup-modal upload-modal-wrapper"
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
        <Modal.Body>
            <NftPreviewProduct
                overlay
                disableShareDropdown
                title={data.token_id}
                slug="/product"
                latestBid="6/30"
                image={{ src: URL.createObjectURL(data.image) }}
                metadata={data.metadata}
            />
        </Modal.Body>
    </Modal>
);

NftPreviewModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
    data: PropTypes.shape({
        token_id: PropTypes.string.isRequired,
        image: PropTypes.shape({}).isRequired,
        metadata: PropTypes.shape({}).isRequired,
    }),
};
export default NftPreviewModal;
