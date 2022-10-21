import PropTypes from "prop-types";
import clsx from "clsx";
import TabContent from "react-bootstrap/TabContent";
import TabContainer from "react-bootstrap/TabContainer";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";
// import NotificationArea from "@containers/notification";
// import CreatorArea from "@containers/creator/layout-02";
import {
    RandomMintData,
    SectionTitleType,
    // NotifactionType,
    // SellerType,
} from "@utils/types";
// import { shuffleArray } from "@utils/methods";
import MintItem from "@components/mint-item";

const ProductArea = ({ className, space, data }) => (
    <div
        className={clsx(
            "rn-product-area",
            space === 1 && "rn-section-gapTop",
            className
        )}
    >
        <div className="container">
            <div className="row g-5">
                <div className="col-lg-12 custom-product-col">
                    {data?.section_title && (
                        <h2 className="text-left mb--50">
                            {data.section_title.title}
                        </h2>
                    )}

                    <TabContainer defaultActiveKey="nav-all">
                        <Nav className="product-tab-nav">
                            <div className="nav">
                                <Nav.Link as="button" eventKey="nav-all">
                                    All
                                </Nav.Link>
                                <Nav.Link as="button" eventKey="nav-live">
                                    Live
                                </Nav.Link>
                                {/* <Nav.Link as="button" eventKey="nav-scheduled">
                                    Scheduled
                                </Nav.Link> */}
                                {/* <Nav.Link as="button" eventKey="nav-sold-out">
                                    Sold Out
                                </Nav.Link> */}
                            </div>
                        </Nav>
                        <TabContent>
                            <TabPane
                                eventKey="nav-all"
                                className="lg-product_tab-pane"
                            >
                                {data?.products?.map((prod) => (
                                    <MintItem
                                        key={prod.id || prod.token_id}
                                        title={prod.title}
                                        // slug={prod.slug}
                                        // latestBid={prod.latestBid}
                                        price={prod.price}
                                        // likeCount={prod.likeCount}
                                        // auction_date={prod.auction_date}
                                        image={prod.images?.[0]}
                                        // authors={prod.authors}
                                        // bitCount={prod.bitCount}
                                        contractAddress={prod.contractAddress}
                                        filter="all"
                                        total_supply={prod.total_supply}
                                    />
                                ))}
                            </TabPane>
                            <TabPane
                                eventKey="nav-live"
                                className="lg-product_tab-pane"
                            >
                                {data?.products?.map((prod) => (
                                    <MintItem
                                        key={prod.id}
                                        title={prod.title}
                                        // slug={prod.slug}
                                        // latestBid={prod.latestBid}
                                        price={prod.price}
                                        // likeCount={prod.likeCount}
                                        // auction_date={prod.auction_date}
                                        image={prod.images?.[0]}
                                        // authors={prod.authors}
                                        // bitCount={prod.bitCount}
                                        contractAddress={prod.contractAddress}
                                        total_supply={prod.total_supply}
                                        filter="live"
                                    />
                                ))}
                            </TabPane>
                            <TabPane
                                eventKey="nav-sold-out"
                                className="lg-product_tab-pane"
                            />
                        </TabContent>
                    </TabContainer>
                </div>
                {/* <div className="col-lg-4 custom-product-col">
                    <div
                        className="header-right-fixed position-sticky product-notify-wrapper
                        rbt-sticky-top-adjust-four mt--95 mt_md--20 mt_sm--15"
                        style={{ top: "90px" }}
                    >
                        <NotificationArea
                            data={{ notifications: data.notifications }}
                        />
                        <CreatorArea data={{ creators: data.creators }} />
                    </div>
                </div> */}
            </div>
        </div>
    </div>
);

ProductArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: SectionTitleType,
        products: PropTypes.arrayOf(RandomMintData),
        // notifications: PropTypes.arrayOf(NotifactionType),
        // creators: PropTypes.arrayOf(SellerType),
    }),
};

ProductArea.defaultProps = {
    space: 1,
};

export default ProductArea;
