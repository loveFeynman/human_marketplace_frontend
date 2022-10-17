import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Collection from "@components/collection";
import Pagination from "@components/pagination";
import { CollectionType } from "@utils/types";
import { useAppSelector } from "@app/hooks";

const POSTS_PER_PAGE = 8;

const CollectionArea = ({ className, space, id, data }) => {
    const [collections, setCollections] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const numberOfPages = Math.ceil(data.collections.length / POSTS_PER_PAGE);
    const paginationHandler = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const creatorHandler = useCallback(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        setCollections(data.collections.slice(start, start + POSTS_PER_PAGE));
    }, [currentPage, data.collections]);

    useEffect(() => {
        creatorHandler();
    }, [currentPage, creatorHandler]);

    const totalNfts = useMemo(() => {
        const result = {};
        Object.keys(marketplaceNfts).forEach((key) => {
            const crrNfts = marketplaceNfts[key] || [];
            let count = 0;
            crrNfts.forEach((nft) => {
                const expiresAt = nft.expires_at
                    ? new Date(nft.expires_at)
                    : null;
                const expired =
                    expiresAt && Number(new Date()) - Number(expiresAt) > 0;
                if (!expiresAt || !expired) count += 1;
            });
            result[key] = count;
        });
        return result;
    }, [marketplaceNfts]);
    return (
        <div
            className={clsx(
                "rn-collection-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
            id={id}
        >
            <div className="container">
                <div className="row g-5">
                    {collections
                        // .filter((collection) => totalNfts[collection.id] > 0)
                        .map((collection) => (
                            <div
                                key={collection.id}
                                className="col-lg-6 col-xl-3 col-md-6 col-sm-6 col-12"
                            >
                                <Collection
                                    id={collection.id}
                                    title={collection.title}
                                    // total_item={
                                    //     marketplaceNfts[collection.id]?.length || 0
                                    // }
                                    total_item={totalNfts[collection.id] || 0}
                                    path={collection.slug}
                                    image={collection.image}
                                    thumbnails={collection.thumbnails}
                                    profile_image={collection.profile_image}
                                />
                            </div>
                        ))}
                </div>
                {numberOfPages > 1 && (
                    <div className="row">
                        <div
                            className="col-lg-12"
                            data-sal="slide-up"
                            data-sal-delay="950"
                            data-sal-duration="800"
                        >
                            <Pagination
                                currentPage={currentPage}
                                numberOfPages={numberOfPages}
                                onClick={paginationHandler}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

CollectionArea.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    space: PropTypes.oneOf([1]),
    data: PropTypes.shape({
        collections: PropTypes.arrayOf(CollectionType),
    }),
};
CollectionArea.defaultProps = {
    space: 1,
};

export default CollectionArea;
