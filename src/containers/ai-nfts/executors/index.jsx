import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import Anchor from "@ui/anchor";
import Pagination from "@components/pagination";
import { IDType, ImageType } from "@utils/types";

const POSTS_PER_PAGE = 31;
const temp_data = [
    {
        id: 1,
        product: {
            title: "Secure 25",
            slug: "/collection",
            image: {
                src: "/images/portfolio/portfolio-05.jpg",
            },
        },
        volume: "7,50,000",
        "24h%": {
            charge: "310.63%",
            status: "-",
        },
        "7d%": {
            charge: "62.21%",
            status: "+",
        },
        floor_price: "33.02",
        owners: "3k",
        items: "10k",
    },
    {
        id: 2,
        product: {
            title: "Secure 25",
            slug: "/collection",
            image: {
                src: "/images/portfolio/portfolio-06.jpg",
            },
        },
        volume: "20,50,000",
        "24h%": {
            charge: "310.63%",
            status: "+",
        },
        "7d%": {
            charge: "62.21%",
            status: "-",
        },
        floor_price: "33.02",
        owners: "2.5k",
        items: "30k",
    },
    {
        id: 3,
        product: {
            title: "Secure 25",
            slug: "/collection",
            image: {
                src: "/images/portfolio/portfolio-07.jpg",
            },
        },
        volume: "11,50,000",
        "24h%": {
            charge: "560.63%",
            status: "+",
        },
        "7d%": {
            charge: "62.21%",
            status: "+",
        },
        floor_price: "33.02",
        owners: "3.6k",
        items: "230k",
    },
    {
        id: 4,
        product: {
            title: "Secure 25",
            slug: "/collection",
            image: {
                src: "/images/portfolio/portfolio-08.jpg",
            },
        },
        volume: "10,50,000",
        "24h%": {
            charge: "310.63%",
            status: "+",
        },
        "7d%": {
            charge: "22.21%",
            status: "-",
        },
        floor_price: "33.02",
        owners: "3.2k",
        items: "100k",
    },
    {
        id: 5,
        product: {
            title: "Secure 25",
            slug: "/collection",
            image: {
                src: "/images/portfolio/portfolio-01.jpg",
            },
        },
        volume: "9,50,000",
        "24h%": {
            charge: "310.63%",
            status: "-",
        },
        "7d%": {
            charge: "62.21%",
            status: "+",
        },
        floor_price: "300.02",
        owners: "33k",
        items: "50k",
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
    }, [currentPage, temp_data]);

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
                            <h3>The top NFTs on Nuron</h3>
                        </div>
                        <div className="box-table table-responsive">
                            <table className="table upcoming-projects">
                                <thead>
                                    <tr>
                                        <th>
                                            <span>SL</span>
                                        </th>
                                        <th>
                                            <span>Product</span>
                                        </th>
                                        <th>
                                            <span>Volume</span>
                                        </th>
                                        <th>
                                            <span>24h%</span>
                                        </th>
                                        <th>
                                            <span>7d%</span>
                                        </th>
                                        <th>
                                            <span>Floor Price</span>
                                        </th>
                                        <th>
                                            <span>Owners</span>
                                        </th>
                                        <th>
                                            <span>Items</span>
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
                                                <span>{index + 1}.</span>
                                            </td>
                                            <td>
                                                <div className="product-wrapper d-flex align-items-center">
                                                    {item?.product?.image
                                                        ?.src && (
                                                        <Anchor
                                                            path={
                                                                item.product
                                                                    .slug
                                                            }
                                                            className="thumbnail"
                                                        >
                                                            <Image
                                                                src={
                                                                    item.product
                                                                        .image
                                                                        .src
                                                                }
                                                                alt="Nft_Profile"
                                                                width={56}
                                                                height={56}
                                                                layout="fixed"
                                                            />
                                                        </Anchor>
                                                    )}

                                                    <span>
                                                        {item.product.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span>{item.volume}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={
                                                        item["24h%"].status ===
                                                        "-"
                                                            ? "color-danger"
                                                            : "color-green"
                                                    }
                                                >
                                                    {item["24h%"].status}
                                                    {item["24h%"].charge}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={
                                                        item["7d%"].status ===
                                                        "-"
                                                            ? "color-danger"
                                                            : "color-green"
                                                    }
                                                >
                                                    {item["7d%"].status}
                                                    {item["7d%"].charge}
                                                </span>
                                            </td>
                                            <td>
                                                <span>{item.floor_price}</span>
                                            </td>
                                            <td>
                                                <span>{item.owners}</span>
                                            </td>
                                            <td>
                                                <span>{item.items}</span>
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
