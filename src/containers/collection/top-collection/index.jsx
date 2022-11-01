import { useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import Collection from "@components/collection";
import { SectionTitleType, CollectionType } from "@utils/types";
import { useAppSelector } from "@app/hooks";
import { GetTopCollections } from "../hooks";

// eslint-disable-next-line no-unused-vars
const TopCollectionArea = ({ className, id, space, data }) => {
    const collections = GetTopCollections();
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const { totalNfts, last3Nfts } = useMemo(() => {
        const totalNftsResult = {};
        const last3NftsResult = {};
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
                <div className="row mb--50 align-items-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <SectionTitle
                            className="mb--0"
                            title="Top Collection"
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                        <div
                            className="view-more-btn text-start text-sm-end"
                            // data-sal-delay="150"
                            // data-sal="slide-up"
                            // data-sal-duration="800"
                        >
                            <Anchor
                                className="btn-transparent"
                                path="/explore/collections"
                            >
                                VIEW ALL
                                <i className="feather feather-arrow-right" />
                            </Anchor>
                        </div>
                    </div>
                </div>
                <div className="row g-5">
                    {collections
                        .filter((collection) => totalNfts[collection.id] > 0)
                        .slice(0, 4)
                        .map((collection) => (
                            <div
                                key={collection.id}
                                className="col-lg-4 col-xl-3 col-md-6 col-sm-6 col-12"
                            >
                                <Collection
                                    title={collection.title}
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
            </div>
        </div>
    );
};

TopCollectionArea.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: SectionTitleType,
        collections: PropTypes.arrayOf(CollectionType),
    }),
};
TopCollectionArea.defaultProps = {
    space: 1,
};

export default TopCollectionArea;
