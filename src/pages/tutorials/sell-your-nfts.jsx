/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
// import SellYourNftArea from "@containers/blog-details";
import clsx from "clsx";
// import Image from "next/image";
// import { ImageType } from "@utils/types";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const SellYourNft = () => (
    <Wrapper>
        <SEO pageTitle="Sell your NFTs" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="How to Sell your NFTs"
                currentPage="Tutorials"
            />
            <div className="rn-blog-area rn-blog-details-default rn-section-gapTop">
                <div className="container">
                    <div className="row g-6">
                        <div className={clsx("blog-details-area")}>
                            <div className="news-details">
                                <h3 className="title pt--40">
                                    4. Sell Your NFTs
                                </h3>
                                <p className="pt--10">
                                    - In order to sell your NFTs, you need to
                                    follow the previous steps (Create a
                                    collection and Create NFT) and start
                                    minting.
                                </p>
                                <h4>1) Buy & Sell</h4>
                                <h5>(1)Sell</h5>
                                <p className="pt--10">
                                    In this section, we will see how users can
                                    put NFTs on sale. <br />- Hover the mouse
                                    cursor over the image of your NFT. You can
                                    see the “Sell” button appear on it.
                                </p>
                                <img src="/images/tutorials/24.png" alt="24" />
                                <p className="pt--10">
                                    - Click the “Sell” button
                                </p>
                                <img src="/images/tutorials/25.png" alt="25" />
                                <p className="pt--10">
                                    - Input a price at which you want to sell
                                    your NFT and decide whether to put it on
                                    sale or on auction by checking the “Auction”
                                    checkbox. In this case, confirm that it is
                                    unchecked. <br /> - Set the expiration time.
                                    After this period, the NFT on the
                                    marketplace will disappear, and other users
                                    cannot buy it.
                                    <br /> - Click the “Sell” button and approve
                                    the transaction.
                                </p>
                                <img src="/images/tutorials/26.png" alt="26" />
                                <p className="pt--10">
                                    If your NFT is not sold, you can withdraw
                                    your NFT at any time:
                                    <br />- Go to the “On Sale” page and place
                                    your mouse cursor on the image of your NFT
                                    which was put on sale.
                                </p>
                                <img src="/images/tutorials/27.png" alt="27" />
                                <p className="pt--10">
                                    - Click the “Withdraw” button
                                </p>
                                <img src="/images/tutorials/28.png" alt="28" />
                                <p className="pt--10">
                                    - Approve the transaction.
                                </p>
                                <img src="/images/tutorials/29.png" alt="29" />
                                <p className="pt--10">
                                    Now your NFT is withdrawn from the “On Sale”
                                    page and is located on the “Owned” page.
                                </p>
                                <img src="/images/tutorials/30.png" alt="30" />
                                <img
                                    src="/images/tutorials/31.png"
                                    className="pt--20"
                                    alt="31"
                                />
                                <h5 className="pt--40">(2)Buy</h5>
                                <p className="pt--10">
                                    In this section, we will see how users buy
                                    NFTs on the marketplace. <br />- Go to the
                                    “Explore” page.
                                </p>
                                <img src="/images/tutorials/32.png" alt="32" />
                                <p className="pt--10">
                                    - Click the collection from which you want
                                    to buy NFTs. In this example, click the
                                    “Human” collection.
                                </p>
                                <img src="/images/tutorials/33.png" alt="33" />
                                <p className="pt--10">
                                    Now you can see NFTs on sale inside that
                                    collection.
                                    <br />
                                    - Move your mouse cursor over the image of
                                    the NFT you want to buy and click the “Buy”
                                    button. <br />
                                    If the NFT is on the auction, you will see
                                    the “Set a bid” button. You can use the
                                    “Filter” function to see only the NFTs that
                                    are on sale.
                                </p>
                                <img src="/images/tutorials/34.png" alt="34" />
                                <p className="pt--10">
                                    - Confirm the price of the NFT and click the
                                    “Buy” button.
                                </p>
                                <img src="/images/tutorials/35.png" alt="35" />
                                <p className="pt--10">
                                    - If the transaction is successful, you can
                                    find the NFT on the “My Profile” page. Now
                                    you become the owner of that NFT.
                                </p>
                                <img
                                    src="/images/tutorials/36.png"
                                    className="pt--20 pr--20"
                                    alt="36"
                                />
                                <img src="/images/tutorials/37.png" alt="37" />
                                <h4 className="pt--40">2) Auction </h4>
                                <h5>(1)How to put NFTs on auction</h5>
                                <p className="pt--10">
                                    - Follow the above steps but remember to
                                    check the “Auction” button this time. <br />
                                    - Set the lowest bid price and expiration
                                    time.
                                </p>
                                <img src="/images/tutorials/38.png" alt="38" />
                                <p className="pt--10">
                                    - Click the “Sell” button and approve the
                                    transaction. Go to the “On Sale” page.
                                </p>
                                <img src="/images/tutorials/39.png" alt="39" />
                                <p className="pt--10">
                                    The seller cannot cancel the auction once it
                                    gets started.
                                </p>
                                <img src="/images/tutorials/40.png" alt="40" />
                                <p className="pt--10">
                                    After the auction expires, you can accept
                                    the highest bid request. <br />
                                    Then, your NFT will be transferred to the
                                    highest bidder, and you will receive the
                                    HEART tokens. <br />
                                    - Go to the detail page by clicking the
                                    image of the NFT.
                                    <br />- Click the “Accept Bid” button and
                                    approve the transaction.
                                </p>
                                <img src="/images/tutorials/41.png" alt="41" />
                                <img
                                    src="/images/tutorials/42.png"
                                    className="pt--20"
                                    alt="42"
                                />
                                <h5 className="pt--40">(2)Bid</h5>
                                <p className="pt--10">
                                    Bidders need to set a bid price within the
                                    expiration time at a higher price than
                                    previous ones. <br />- Go to the “Explore”
                                    page and click the collection from which you
                                    want to buy NFTs.
                                </p>
                                <img src="/images/tutorials/43.png" alt="43" />
                                <p className="pt--10">
                                    - Click the “Set a bid” button.
                                </p>
                                <img src="/images/tutorials/44.png" alt="44" />
                                <p className="pt--10">
                                    You can see the minimum price and the
                                    address of the seller under the image of the
                                    NFT. You can also go to the detail page by
                                    clicking the image of the NFT.
                                    <br /> - Click the “Set a bid” button to
                                    execute the transaction.
                                </p>
                                <img src="/images/tutorials/45.png" alt="45" />
                                <p className="pt--10">
                                    Once the user bids, he/she cannot cancel it.{" "}
                                    <br />
                                    You can see the bid history and the status
                                    of the auction by visiting the “My Bids” tab
                                    on the “My Profile” page.
                                </p>
                                <img src="/images/tutorials/46.png" alt="46" />
                                <p className="pt--10">
                                    You can also go to the detail page by
                                    clicking the image of the NFT.
                                </p>
                                <img src="/images/tutorials/47.png" alt="47" />
                                <p className="pt--10">
                                    On the detail page, you can see the bid
                                    history. <br />
                                    You can bid again at a higher price than the
                                    previous bid.
                                </p>
                                <img src="/images/tutorials/48.png" alt="48" />
                                <p className="pt--10">
                                    If a bidder offers a higher bid price than
                                    yours, you will receive the HEARTS you
                                    locked in the marketplace back. You can bid
                                    again at a higher price.
                                </p>
                                <p className="pt--10">
                                    If you have the highest bid price at the end
                                    of an auction, and the owner of the NFT
                                    accepts it after the expiration time, you
                                    will receive that NFT.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </Wrapper>
);

SellYourNft.propTypes = {
    post: PropTypes.shape({}),
    categories: PropTypes.arrayOf(PropTypes.shape({})),
    recentPosts: PropTypes.arrayOf(PropTypes.shape({})),
    tags: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    relatedPosts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SellYourNft;
