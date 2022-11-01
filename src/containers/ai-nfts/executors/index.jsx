import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
// import Image from "next/image";
// import Anchor from "@ui/anchor";
import Pagination from "@components/pagination";
// import { IDType, ImageType } from "@utils/types";
import Button from "@ui/button";

const POSTS_PER_PAGE = 31;
const temp_data = [
    {
        id: 1,
        volume: "222k",
        queue: "4",
        price: "72615",
        floor_time: "10.2s",
    },
    {
        id: 2,
        volume: "22k",
        queue: "3",
        price: "1215",
        floor_time: "10s",
    },
    {
        id: 3,
        volume: "432k",
        queue: "4",
        price: "42323",
        floor_time: "8.4s",
    },
    {
        id: 4,
        volume: "784k",
        queue: "2",
        price: "93821",
        floor_time: "6.5s",
    },
    {
        id: 5,
        volume: "873k",
        queue: "1",
        price: "39821",
        floor_time: "13.4s",
    },
];
const RankingArea = ({ className, space }) => {
    const [ranking, setRanking] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const numberOfPages = Math.ceil(temp_data.length / POSTS_PER_PAGE);
    const paginationHandler = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const rankingHandler = useCallback(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        setRanking(temp_data.slice(start, start + POSTS_PER_PAGE));
    }, [currentPage]);

    useEffect(() => {
        rankingHandler();
    }, [currentPage, rankingHandler]);

    return (
        <div
            className={clsx(
                "rn-upcoming-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="table-title-area d-flex">
                            <i className="feather-briefcase" />
                            <h3>Select Executor</h3>
                        </div>
                        <div className="box-table table-responsive">
                            <table className="table upcoming-projects">
                                <thead>
                                    <tr>
                                        <th>
                                            <span>EXECUTOR</span>
                                        </th>
                                        <th>
                                            <span>EXEC COUNT</span>
                                        </th>
                                        <th>
                                            <span>PRICE</span>
                                        </th>
                                        <th>
                                            <span>AVERAGE EXEC TIME</span>
                                        </th>
                                        <th>
                                            <span>IN QUEUE</span>
                                        </th>
                                        <th>
                                            <span />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="ranking">
                                    {ranking?.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={
                                                index % 2 === 0
                                                    ? "color-light"
                                                    : ""
                                            }
                                        >
                                            <td>
                                                <span>
                                                    Executor name{index + 1}.
                                                </span>
                                            </td>
                                            <td>
                                                <span>{item.volume}</span>
                                            </td>
                                            <td>
                                                <span>{item.price}</span>
                                            </td>
                                            <td>
                                                <span>{item.floor_time}</span>
                                            </td>
                                            <td>
                                                <span>{item.queue}</span>
                                            </td>
                                            <td>
                                                <Button
                                                    path={`/ai-nft/transaction?id=${item.id}&volume=${item.volume}&price=${item.price}&floor_time=${item.floor_time}&queue=${item.queue}`}
                                                    className="ai-execute-button"
                                                >
                                                    Use
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            numberOfPages={numberOfPages}
                            onClick={paginationHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

RankingArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};
RankingArea.defaultProps = {
    space: 1,
};

export default RankingArea;
