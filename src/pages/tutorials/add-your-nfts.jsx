/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
// import TutorialDetailsArea from "@containers/blog-details";
import clsx from "clsx";
// import Image from "next/image";
// import { ImageType } from "@utils/types";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const TutorialDetails = () => (
    <Wrapper>
        <SEO pageTitle="Add your NFTs" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="How to Add your NFTs"
                currentPage="Tutorials"
            />
            <div className="rn-blog-area rn-blog-details-default rn-section-gapTop">
                <div className="container">
                    <div className="row g-6">
                        <div className={clsx("blog-details-area")}>
                            <div className="news-details">
                                <h3 className="title pt--40">
                                    3. Add your NFT's
                                </h3>
                                <p className="pt--10">
                                    - Tap any of the Create buttons, from the
                                    top header or from the home page:
                                </p>
                                <img src="/images/tutorials/14.png" alt="14" />
                                <img src="/images/tutorials/15.png" alt="15" />
                                <p className="pt--10">
                                    - A “Create New NFT” page will be opened.
                                </p>
                                <img src="/images/tutorials/16.png" alt="16" />
                                <p className="pt--10">- Upload a file</p>
                                <img src="/images/tutorials/17.png" alt="17" />
                                <p className="pt--10">
                                    - Choose an existing collection (previously
                                    created)
                                </p>
                                <img src="/images/tutorials/18.png" alt="18" />
                                <p className="pt--10">
                                    - Fill in the necessary information
                                </p>
                                <img src="/images/tutorials/19.png" alt="19" />
                                <p className="pt--10">
                                    - Click on “Submit item”
                                </p>
                                <img src="/images/tutorials/20.png" alt="20" />
                                <p className="pt--10">
                                    - Approve the Keplr transaction request:
                                </p>
                                <img src="/images/tutorials/21.png" alt="21" />
                                <p className="pt--10">
                                    - Congratulations, your newly created NFT
                                    was added to your desired collection and can
                                    be now minted via the “Mint” page <br />
                                    You can also click on the “Preview” button
                                    in order to preview your NFT:
                                </p>
                                <img src="/images/tutorials/22.png" alt="22" />
                                <p className="pt--10">
                                    It will open the following view:
                                </p>
                                <img src="/images/tutorials/23.png" alt="23" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </Wrapper>
);

TutorialDetails.propTypes = {
    post: PropTypes.shape({}),
    categories: PropTypes.arrayOf(PropTypes.shape({})),
    recentPosts: PropTypes.arrayOf(PropTypes.shape({})),
    tags: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    relatedPosts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default TutorialDetails;
