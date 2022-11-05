import PropTypes from "prop-types";
import NftItem from "@components/nft-item";
import { ProductType } from "@utils/types";
import { memo } from "react";

const MyBids = ({ bids }) => (
    <>
        {bids.map((prod) => (
            <div
                key={`${prod.token_id}-${Number(new Date())}`}
                className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
            >
                <NftItem overlay item={prod} />
            </div>
        ))}
    </>
);

MyBids.propTypes = {
    bids: PropTypes.arrayOf(ProductType),
};

export default memo(MyBids);
