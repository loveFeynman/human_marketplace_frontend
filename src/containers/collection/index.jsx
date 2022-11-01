import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Collection from "@components/collection";
import Pagination from "@components/pagination";
import { CollectionType } from "@utils/types";
import { useAppSelector } from "@app/hooks";

const POSTS_PER_PAGE = 8;

const CollectionArea = ({ className, space, id, data, showAll }) => {
    // const [collections, setCollections] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const collectionsInfo = useAppSelector((state) => state.collections);
    const myNfts = useAppSelector((state) => state.myNfts);

    const { totalNfts, last3Nfts } = useMemo(() => {
        const totalNftsResult = {};

        const last3NftsResult = {};
        Object.keys(marketplaceNfts).forEach((key) => {
            const crrCollectionInfo = collectionsInfo[key] || {};
            const crrNfts =
                showAll && crrCollectionInfo.userDefined
                    ? (marketplaceNfts[key] || []).concat(myNfts[key] || [])
                    : marketplaceNfts[key] || [];
            let count = 0;
            crrNfts.forEach((nft) => {
                const expiresAt = nft.expires_at
                    ? new Date(nft.expires_at)
                    : null;
                const expired =
                    expiresAt && Number(new Date()) - Number(expiresAt) > 0;
                if (!expiresAt || !expired) count += 1;
            });
            totalNftsResult[key] = count;
            last3NftsResult[key] = Array.from({ length: 3 }).map(
                (item, index) => ({
                    src:
                        crrNfts[index]?.image_url ||
                        "/images/collection/collection-sm-01.jpg",
                })
            );
        });
        return { totalNfts: totalNftsResult, last3Nfts: last3NftsResult };
    }, [collectionsInfo, marketplaceNfts, myNfts, showAll]);

    const displayCollections = (data.collections || []).filter(
        (collection) => showAll || totalNfts[collection.id] > 0
    );
    const numberOfPages = Math.ceil(displayCollections.length / POSTS_PER_PAGE);
    const paginationHandler = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    // const creatorHandler = useCallback(() => {
    //     setCollections(displayCollections.slice(start, start + POSTS_PER_PAGE));
    // }, [currentPage, displayCollections]);

    // useEffect(() => {
    //     creatorHandler();
    // }, [currentPage, creatorHandler]);

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
                    {displayCollections
                        .slice(start, start + POSTS_PER_PAGE)
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
                                    // thumbnails={collection.thumbnails}
                                    thumbnails={last3Nfts[collection.id]}
                                    profile_image={collection.profile_image}
                                />
                            </div>
                        ))}
                </div>
                {numberOfPages > 1 && (
                    <div className="row">
                        <div
                            className="col-lg-12"
                            // data-sal="slide-up"
                            // data-sal-delay="950"
                            // data-sal-duration="800"
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
    showAll: PropTypes.bool,
};
CollectionArea.defaultProps = {
    space: 1,
};

export default CollectionArea;
