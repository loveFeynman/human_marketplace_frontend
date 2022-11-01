/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import Anchor from "@ui/anchor";
// import CountdownTimer from "@ui/countdown/layout-01";
// import ClientAvatar from "@ui/client-avatar";
// import ShareDropdown from "@components/share-dropdown";
// import ProductBid from "@components/product-bid";
import Button from "@ui/button";
import { ImageType } from "@utils/types";
// import PlaceBidModal from "@components/modals/placebid-modal";

const Product = ({
    overlay,
    title,
    slug,
    latestBid,
    price,
    likeCount,
    auction_date,
    image,
    bitCount,
    authors,
    placeBid,
    disableShareDropdown,
}) => (
    <div className={clsx("ai-product-style-one")}>
        <div className="card-thumbnail">
            <Anchor path={`/ai-nft/${slug}`}>
                <Image
                    src={image.src}
                    alt={image?.alt || "NFT_portfolio"}
                    width={533}
                    height={533}
                />
            </Anchor>
            <div className="ai-nft-title">
                <h1>AI NFT Name 1</h1>
                <p>This is a short description of the AI NFT</p>
            </div>
        </div>
        <div className="ai-product-content">
            <p>
                This can be a much longer description of the AI NFT.Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
            </p>
        </div>
        <div className="ai-product-info-wrapper">
            <div className="ai-product-info">Execution count: 24k</div>
            <div className="ai-product-info">Execution count: 24k</div>
            <div className="ai-product-info">Execution count: 24k</div>
        </div>
        <Button path={`/ai-nft/${slug}`} className="ai-execute-button">
            Execute
        </Button>
    </div>
);

Product.propTypes = {
    overlay: PropTypes.bool,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    latestBid: PropTypes.string.isRequired,
    price: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
    }).isRequired,
    likeCount: PropTypes.number.isRequired,
    auction_date: PropTypes.string,
    image: ImageType.isRequired,
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            image: ImageType.isRequired,
        })
    ),
    bitCount: PropTypes.number,
    placeBid: PropTypes.bool,
    disableShareDropdown: PropTypes.bool,
};

Product.defaultProps = {
    overlay: false,
};

export default Product;
