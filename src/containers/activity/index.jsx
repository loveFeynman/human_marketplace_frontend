import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Activity from "@components/activity";
// import Sticky from "@ui/sticky";
import { IDType, ImageType } from "@utils/types";
import { useAxios } from "@hooks";
// import { flatDeep } from "@utils/methods";
import { getFullName, getReducedAddress } from "@utils/index";
import { getImageFromHash } from "@utils/ipfs";
// import TopSeller from "@components/top-seller/layout-02";

const ActivityArea = ({ space, className }) => {
    const [history, setHistory] = useState([]);
    // const marketFilters = ["Sales", "Followers", "Following", "Live Auction"];
    const { getHistoricalData, fetchUserInfo } = useAxios();
    useEffect(() => {
        (async () => {
            const data = await getHistoricalData();
            const avatars = await Promise.all(
                data.map(async (element) => {
                    const result = await fetchUserInfo(element.buyer);
                    return result;
                })
            );
            setHistory(
                data.map((_data, index) => ({
                    ..._data,
                    author: {
                        logo: avatars[index].logo
                            ? getImageFromHash(avatars[index].logo)
                            : "/images/client/client-2.png",
                        name:
                            getFullName(
                                avatars[index].first_name,
                                avatars[index].last_name
                            ) || getReducedAddress(_data.buyer),
                        slug: `/profile/${_data.buyer}`,
                    },
                }))
            );
        })();
    });
    // const filterHandler = (filter) => {
    //     const newActivities = data?.activities.filter((activity) =>
    //         activity.marketFilters.includes(filter)
    //     );
    //     setActivities(newActivities);
    // };

    return (
        <div
            className={clsx(
                "rn-activity-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row mb--30">
                    <h3 className="title">All following Activity</h3>
                </div>
                <div className="row g-6 activity-direction">
                    <div className="col-lg-8 col-sm-12 mb_dec--15">
                        {/* {history?.map((item) => (
                            <TopSeller
                                key={item.time}
                                name={item.name}
                                eth={(item.amount / 1000000).toString()}
                                path={item.slug}
                                time={`${getCorrectTime(item.time)} ago`}
                                image={{
                                    src: item.logo,
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        ))} */}
                        {history?.map((item) => (
                            <Activity
                                key={item.time}
                                time={item.time}
                                token_id={item.tokenId}
                                collection={item.collection}
                                author={item.author}
                                buyer={item.buyer}
                                action={item.action}
                                price={item.price}
                                // status={item.status}
                            />
                        ))}
                    </div>
                    {/* <div className="col-lg-4">
                        <div className="filter-wrapper">
                            <Sticky top="100px">
                                <div className="widge-wrapper rbt-sticky-top-adjust">
                                    <div className="inner">
                                        <h3>Market filter</h3>
                                        <div className="sing-filter">
                                            {marketFilters?.map((item) => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() =>
                                                        filterHandler(item)
                                                    }
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="inner">
                                        <h3>Filter by users</h3>
                                        <div className="sing-filter">
                                            {userFilters?.map((item) => (
                                                <button
                                                    key={item}
                                                    onClick={() =>
                                                        filterHandler(item)
                                                    }
                                                    type="button"
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Sticky>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

ActivityArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    data: PropTypes.shape({
        activities: PropTypes.arrayOf(
            PropTypes.shape({
                id: IDType,
                title: PropTypes.string,
                slug: PropTypes.string,
                description: PropTypes.string,
                date: PropTypes.string,
                time: PropTypes.string,
                author: PropTypes.shape({
                    name: PropTypes.string,
                    slug: PropTypes.string,
                }),
                image: ImageType,
                status: PropTypes.oneOf(["follow", "sale", "like", "offer"]),
                marketFilters: PropTypes.arrayOf(PropTypes.string),
                userFilters: PropTypes.arrayOf(PropTypes.string),
            })
        ),
    }),
};

ActivityArea.defaultProps = {
    space: 1,
};

export default ActivityArea;
