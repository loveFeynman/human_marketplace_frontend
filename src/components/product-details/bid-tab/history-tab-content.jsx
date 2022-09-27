import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-02";
import { IDType, ImageType } from "@utils/types";

const HistoryTabContent = ({ history }) => (
    <div>
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
