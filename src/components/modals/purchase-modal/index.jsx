import { useRef, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";
import { useAppSelector } from "@app/hooks";

const PurchaseModal = ({
    show,
    handleModal,
    generalOptions,
    amountOptions,
    handleClickConfirm,
}) => {
    const [amount, setAmount] = useState();
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [isPendingTx, setIsPendingTx] = useState(false);
    const datePickerEl = useRef(null);
    const balance = useAppSelector((state) => state.balance);

    const handleChangeAmount = (e) => {
        if (amountOptions?.disabled) return;
        const { value } = e.target;
        setAmount(value);
    };
    const handleChangeCheckbox = (e) => {
        const { checked } = e.target;
        setCheckboxChecked(checked);
    };
    const handleConfirm = async () => {
        if (handleClickConfirm) {
            const expireDate = datePickerEl?.current?.value
                ? new Date(datePickerEl?.current?.value)
                : new Date();
            const now = new Date();
            const diff = (expireDate - now) / 1000;
            setIsPendingTx(true);
            handleClickConfirm(
                amountOptions?.disabled
                    ? amountOptions?.defaultAmount
                    : amount || amountOptions?.defaultAmount,
                { isAuction: checkboxChecked, expire: diff },
                () => {
                    setIsPendingTx(false);
                }
            );
        }
    };

    return (
        <Modal
            className="rn-popup-modal placebid-modal-wrapper"
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
            <Modal.Header>
                <h3 className="modal-title">{generalOptions.title}</h3>
            </Modal.Header>
            <Modal.Body>
                {generalOptions.description && (
                    <p>{generalOptions.description}</p>
                )}
                <div className="placebid-form-box">
                    {generalOptions.amountDescription && (
                        <h5 className="title">
                            {generalOptions.amountDescription}
                        </h5>
                    )}
                    <div className="bid-content">
                        <div className="bid-content-top">
                            <div className="bid-content-left">
                                <input
                                    type="text"
                                    defaultValue={amountOptions?.defaultAmount}
                                    disabled={amountOptions?.disabled}
                                    onChange={handleChangeAmount}
                                />
                                {/* <span>{amountOptions?.denom || "uheart"}</span> */}
                                <span>$HEART</span>
                            </div>
                        </div>

                        <div className="bid-content-mid">
                            <div className="bid-content-left">
                                <span>Your Balance</span>
                                <span>Service fee</span>
                                <span>Total bid amount</span>
                            </div>
                            <div className="bid-content-right">
                                <span>
                                    {`${balance.amount || ""} $HEART`}
                                    {/* {`${balance.amount || ""} ${
                                        balance.denom || ""
                                    }`} */}
                                </span>
                                <span>0 $HEART</span>
                                <span>
                                    {`${
                                        amount || amountOptions?.defaultAmount
                                    } $HEART`}
                                </span>
                            </div>
                        </div>
                        {generalOptions.isSelling && (
                            <div
                                style={{ alignItems: "center" }}
                                className="bid-content-mid"
                            >
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={checkboxChecked}
                                        className="rn-check-box-input"
                                        onChange={handleChangeCheckbox}
                                        id="auction-checkbox"
                                    />
                                    <label
                                        className="rn-check-box-label"
                                        htmlFor="auction-checkbox"
                                    >
                                        Auction
                                    </label>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <label
                                        className="rn-check-box-label"
                                        htmlFor="expire-date"
                                    >
                                        Expire Date
                                    </label>
                                    <input
                                        style={{ width: "max-content" }}
                                        ref={datePickerEl}
                                        type="datetime-local"
                                        id="expire-date"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bit-continue-button">
                        <Button
                            size="medium"
                            fullwidth
                            onClick={handleConfirm}
                            disabled={isPendingTx}
                        >
                            {generalOptions.buttonString}
                        </Button>
                        <Button
                            color="primary-alta"
                            size="medium"
                            className="mt--10"
                            onClick={handleModal}
                            disabled={isPendingTx}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

PurchaseModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
    generalOptions: PropTypes.shape({
        title: PropTypes.string.isRequired,
        buttonString: PropTypes.string.isRequired,
        isSelling: PropTypes.bool,
        description: PropTypes.string,
        amountDescription: PropTypes.string,
    }).isRequired,
    amountOptions: PropTypes.shape({
        defaultAmount: PropTypes.number,
        minAmount: PropTypes.number,
        denom: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
    }),
    handleClickConfirm: PropTypes.func,
};
export default PurchaseModal;
