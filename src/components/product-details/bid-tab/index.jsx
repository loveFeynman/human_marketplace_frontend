/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import clsx from "clsx";
import TabContainer from "react-bootstrap/TabContainer";
import TabContent from "react-bootstrap/TabContent";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";
import BidsTabContent from "./bids-tab-content";
import DetailsTabContent from "./details-tab-content";
import HistoryTabContent from "./history-tab-content";

const BidTab = ({
    className,
    bids,
    history,
    token_uri,
    ownerInfo,
    creatorInfo,
    created_at,
}) => (
    <TabContainer defaultActiveKey="nav-home">
        <div className={clsx("tab-wrapper-one", className)}>
            <nav className="tab-button-one">
                <Nav as="div" className="nav-tabs">
                    <Nav.Link as="button" eventKey="nav-home">
                        Bids
                    </Nav.Link>
                    <Nav.Link as="button" eventKey="nav-profile">
                        Details
                    </Nav.Link>
                    <Nav.Link as="button" eventKey="nav-contact">
                        History
                    </Nav.Link>
                </Nav>
            </nav>
            <TabContent className="rn-bid-content">
                <TabPane eventKey="nav-home">
                    <BidsTabContent bids={bids} />
                </TabPane>
                <TabPane eventKey="nav-profile">
                    <DetailsTabContent
                        token_uri={token_uri}
                        ownerInfo={ownerInfo}
                    />
                </TabPane>
                <TabPane eventKey="nav-contact">
                    <HistoryTabContent
                        history={history}
                        creatorInfo={{ ...creatorInfo, time: created_at }}
                    />
                </TabPane>
            </TabContent>
        </div>
    </TabContainer>
);

BidTab.propTypes = {
    className: PropTypes.string,
    bids: PropTypes.arrayOf(PropTypes.shape({})),
    // owner: PropTypes.shape({}),
    // properties: PropTypes.arrayOf(PropTypes.shape({})),
    // tags: PropTypes.arrayOf(PropTypes.shape({})),
    history: PropTypes.arrayOf(PropTypes.shape({})),
};

export default BidTab;
