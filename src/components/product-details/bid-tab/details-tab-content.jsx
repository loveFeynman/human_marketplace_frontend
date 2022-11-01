/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-01";
import { IDType, ImageType } from "@utils/types";
import { getImageFromHash } from "@utils/ipfs";

const DetailsTabContent = ({ token_uri, ownerInfo }) => {
    // const [attributes, setAttributes] = useState([]);
    const [tags, setTags] = useState([]);
    useEffect(() => {
        (async () => {
            const json = await fetch(token_uri);
            const { attributes } = await json.json();
            setTags(attributes);
        })();
    }, [token_uri]);
    return (
        <div className="rn-pd-bd-wrapper mt--20">
            <TopSeller
                name={ownerInfo.name || ownerInfo.wallet}
                // total_sale={ownerInfo.total_sale}
                slug={`/profile/${ownerInfo.wallet}`}
                image={{
                    src: getImageFromHash(ownerInfo.logo),
                    width: "44px",
                    height: "44px",
                }}
            />
            {tags && (
                <div className="rn-pd-sm-property-wrapper">
                    <h6 className="pd-property-title">Tags</h6>
                    <div className="catagory-wrapper">
                        {tags.map((tag) => (
                            <div
                                key={`${tag.id}-${Math.random()}`}
                                className="pd-property-inner"
                            >
                                <span className="color-body type">
                                    {tag.trait_type}
                                </span>
                                <span className="color-white value">
                                    {tag.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

DetailsTabContent.propTypes = {
    owner: PropTypes.shape({
        name: PropTypes.string,
        total_sale: PropTypes.number,
        slug: PropTypes.string,
        image: ImageType,
    }),
    properties: PropTypes.arrayOf(
        PropTypes.shape({
            id: IDType,
            type: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            id: IDType,
            type: PropTypes.string,
            value: PropTypes.string,
        })
    ),
};

export default DetailsTabContent;
