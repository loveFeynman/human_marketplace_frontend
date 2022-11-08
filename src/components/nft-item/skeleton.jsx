/* eslint-disable indent */
import clsx from "clsx";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

const NftItemSkeleton = () => (
    <div className={clsx("product-style-one with-placeBid skeleton")}>
        <div className="card-thumbnail">
            <Image
                src="/images/portfolio/lg/ImageSkeleton.jpg"
                alt=""
                width={533}
                height={533}
            />
        </div>
        <Skeleton style={{ marginTop: 30, marginBottom: 10 }} width="100%" />
        <span className="product-name">
            <Skeleton width="100%" />
        </span>
        <div className="latest-bid">
            <Skeleton width="100%" />
        </div>
        <div className="latest-bid">
            <Skeleton width="100%" />
        </div>
        <Skeleton style={{ marginTop: 10 }} width="100%" />
    </div>
);

NftItemSkeleton.propTypes = {};

NftItemSkeleton.defaultProps = {};

export default NftItemSkeleton;
