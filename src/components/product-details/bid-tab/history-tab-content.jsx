import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-02";
import TopSellerArea from "@components/top-seller/layout-01";
import { getImageFromHash } from "@utils/ipfs";
import { IDType, ImageType } from "@utils/types";

const HistoryTabContent = ({ history, creatorInfo }) => {
    return (
        <div>
            <div style={{ padding: "20px 0" }}>
                Creator
                <TopSellerArea
                    name={creatorInfo.first_name || creatorInfo.wallet}
                    // total_sale={ownerInfo.total_sale}
                    slug={`/profile/${creatorInfo.wallet}`}
                    image={{
                        src: getImageFromHash(creatorInfo.logo),
                        width: "44px",
                        height: "44px",
                    }}
                />
            </div>
            {history?.map((item) => (
                <TopSeller
                    key={item.time}
                    name={item.name}
                    eth={item.amount.toString()}
                    path={item.slug}
                    time={item.time}
                    image={{ src: item.logo }}
                />
            ))}
        </div>
    );
};

HistoryTabContent.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            id: IDType,
            user: PropTypes.shape({
                name: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
                image: ImageType.isRequired,
            }),
            amount: PropTypes.number.isRequired,
        })
    ),
};

export default HistoryTabContent;
