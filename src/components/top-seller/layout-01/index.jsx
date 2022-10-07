import { useWalletManager } from "@noahsaso/cosmodal";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import Button from "@ui/button";

const TopSeller = ({
    name,
    total_sale,
    image,
    slug,
    className,
    isVarified,
    followBtn,
}) => {
    const { connectedWallet } = useWalletManager();
    const path =
        slug.split("/")[2] === connectedWallet?.address ? "/profile" : slug;
    return (
        <div className={clsx("top-seller-inner-one", className)}>
            <div className="top-seller-wrapper">
                <div className={clsx("thumbnail", isVarified && "varified")}>
                    <Anchor path={path}>
                        <Image
                            src={image.src}
                            alt={image?.alt || name}
                            width={image?.width || 54}
                            height={image?.height || 54}
                            layout="fixed"
                        />
                    </Anchor>
                </div>
                <div className="top-seller-content">
                    <Anchor path={path}>
                        <h6 className="name">{name}</h6>
                    </Anchor>
                    {total_sale && (
                        <span className="count-number">
                            {new Intl.NumberFormat("en-US", {
                                currency: "USD",
                            }).format(total_sale)}
                        </span>
                    )}
                </div>
            </div>
            {followBtn && (
                <Button path={path} color="primary-alta" size="small">
                    Follow
                </Button>
            )}
        </div>
    );
};

TopSeller.propTypes = {
    name: PropTypes.string.isRequired,
    total_sale: PropTypes.number,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    className: PropTypes.string,
    isVarified: PropTypes.bool,
    followBtn: PropTypes.bool,
};

export default TopSeller;
