import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import Collection from "@components/collection";
import { SectionTitleType, CollectionType } from "@utils/types";
import { GetTopCollections } from "../hooks";

const TopCollectionArea = ({ className, id, space, data }) => {
    const collections = GetTopCollections();
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
                            data-sal-delay="150"
                            data-sal="slide-up"
                            data-sal-duration="800"
                        >
                            <Anchor
                                className="btn-transparent"
                                path="/collections"
                            >
                                VIEW ALL
                                <i className="feather feather-arrow-right" />
                            </Anchor>
                        </div>
                    </div>
                </div>
                {data?.collections && (
                    <div className="row g-5">
                        {collections.map((collection) => (
                            <div
                                key={collection.id}
                                className="col-lg-4 col-xl-3 col-md-6 col-sm-6 col-12"
                            >
                                <Collection
                                    title={collection.title}
                                    total_item={collection.total_item}
                                    path={collection.slug}
                                    image={collection.image}
                                    thumbnails={collection.thumbnails}
                                    profile_image={collection.profile_image}
                                />
                            </div>
                        ))}
                    </div>
                )}
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
