import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import TutorialDetailsArea from "@containers/blog-details";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const TutorialDetails = ({}) => (
    <Wrapper>
        <SEO pageTitle="Blog Details" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="Tutorials" currentPage="Tutorials" />
            <div className="rn-blog-area rn-blog-details-default rn-section-gapTop">
                <div className="container">
                    <div className="row g-6">
                        <TutorialDetailsArea />
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
