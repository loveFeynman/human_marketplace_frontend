/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
// import CreateYourApplicationArea from "@containers/blog-details";
import clsx from "clsx";
// import Image from "next/image";
// import { ImageType } from "@utils/types";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const CreateYourApplication = () => (
    <Wrapper>
        <SEO pageTitle="Create your collection" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="How to Create your collection"
                currentPage="Tutorials"
            />
            <div className="rn-blog-area rn-blog-details-default rn-section-gapTop">
                <div className="container">
                    <div className="row g-6">
                        <div className={clsx("blog-details-area")}>
                            <div className="news-details">
                                <h3 className="title">
                                    2. Create your collection
                                </h3>
                                <p className="pt--10">
                                    - Hover over your profile picture and open
                                    the following menu:
                                </p>
                                <img src="/images/tutorials/7.png" alt="7" />
                                <p className="pt--10">
                                    - From here, click on “My Collections”. It
                                    will open “Our Collections” screen:
                                </p>
                                <img src="/images/tutorials/8.png" alt="8" />
                                <p className="pt--10">
                                    - Click on “Create a Collection” button
                                </p>
                                <img src="/images/tutorials/9.png" alt="9" />
                                <p className="pt--10">
                                    - Now the collection creation page will be
                                    opened, like so:
                                </p>
                                <img src="/images/tutorials/10.png" alt="10" />
                                <p className="pt--10">
                                    - Fill in the form with the necessary
                                    information.
                                </p>
                                <img src="/images/tutorials/11.png" alt="11" />
                                <p className="pt--10">
                                    - Click the “Create Collection” button{" "}
                                    <br /> - Approve the Keplr transaction
                                    request, in order to successfully create the
                                    collection, like
                                </p>
                                <img src="/images/tutorials/12.png" alt="12" />
                                <p className="pt--10">
                                    A new collection is created and you can see
                                    it when you go to the explore page.
                                </p>
                                <img src="/images/tutorials/13.png" alt="13" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </Wrapper>
);

CreateYourApplication.propTypes = {
    post: PropTypes.shape({}),
    categories: PropTypes.arrayOf(PropTypes.shape({})),
    recentPosts: PropTypes.arrayOf(PropTypes.shape({})),
    tags: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    relatedPosts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default CreateYourApplication;
