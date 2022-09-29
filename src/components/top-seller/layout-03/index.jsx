import Image from "next/image";
import PropTypes from "prop-types";
import clsx from "clsx";
import Anchor from "@ui/anchor";

const TopSeller = ({
    tokenId,
    time,
    path,
    image,
    eth,
    isVarified,
    ...rest
}) => (
    <div
        style={{ cursor: "pointer" }}
        className="top-seller-inner-one"
        {...rest}
    >
        <div className="top-seller-wrapper">
            {image?.src && (
                <div className={clsx("thumbnail", isVarified && "varified")}>
                    <Anchor path={path}>
                        <Image
                            src={image.src}
                            alt={image?.alt || "Nft_Profile"}
                            width={image?.width || 50}
                            height={image?.height || 50}
                            layout="fixed"
                        />
                    </Anchor>
                </div>
            )}
            <div className="top-seller-content">
                <span>
                    {!!eth && (
                        <>
                            {eth} to {tokenId}
                        </>
                    )}
                </span>
                {time && <span className="count-number">{time}</span>}
            </div>
        </div>
    </div>
);

TopSeller.propTypes = {
    tokenId: PropTypes.string.isRequired,
    time: PropTypes.string,
    path: PropTypes.string,
    eth: PropTypes.string,
    image: PropTypes.shape({
        src: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
            .isRequired,
        alt: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    isVarified: PropTypes.bool,
};

export default TopSeller;
