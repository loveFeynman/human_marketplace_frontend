/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-02";
import { getImageFromHash } from "@utils/ipfs";
import { IDType, ImageType } from "@utils/types";
import Image from "next/image";
import clsx from "clsx";
import Anchor from "@ui/anchor";

const HistoryTabContent = ({ history, creatorInfo }) => {
    const getStandardTime = (time) => {
        const interval = Date.now() / 1000 - Number(time);
        if (interval < 3600) return `${(interval / 60).toFixed(0)} mins`;
        if (interval < 3600 * 24) {
            return `${(interval / 3600).toFixed(0)} hours`;
        }
        return `${(interval / 3600 / 24).toFixed(0)} days`;
    };
    // const getCorrectTime = (utcTime) => {
    //     const full_date = utcTime.split("T");
    //     const date = full_date[0].split("-");
    //     const time = full_date[1].split(":");
    //     const timeArray = [...date, ...time];
    //     const timestamp = new Date(
    //         timeArray[0],
    //         timeArray[1] - 1,
    //         timeArray[2],
    //         timeArray[3],
    //         timeArray[4]
    //     ).getTime();
    //     return getStandardTime(timestamp / 1000);
    // };
    return (
        <div>
            <div style={{ padding: "20px 0" }}>
                <div className="top-seller-inner-one">
                    <div className="top-seller-wrapper">
                        <div className={clsx("thumbnail")}>
                            <Anchor path={`/profile/${creatorInfo.wallet}`}>
                                <Image
                                    src={getImageFromHash(creatorInfo.logo)}
                                    alt="Nft_Profile"
                                    width={40}
                                    height={40}
                                    layout="fixed"
                                />
                            </Anchor>
                        </div>
                        <div className="top-seller-content">
                            <span>
                                Created by{" "}
                                <Anchor path={`/profile/${creatorInfo.wallet}`}>
                                    {creatorInfo.first_name ||
                                        creatorInfo.wallet}
                                </Anchor>
                                {/* <Anchor path={path}>{name}</Anchor> */}
                            </span>
                            <span className="count-number">
                                {getStandardTime(creatorInfo.time)} ago
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {history?.map((item) => (
                <TopSeller
                    key={item.time}
                    name={item.name}
                    eth={(item.amount / 1000000).toString()}
                    path={item.slug}
                    time={`${getStandardTime(item.time)} ago`}
                    image={{ src: item.logo, width: 40, height: 40 }}
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
