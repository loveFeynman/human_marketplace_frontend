import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import AboutArea from "@containers/about/layout-02";
import QuoteArea from "@containers/quote-area";
import FunfactArea from "@containers/funfact";
// import CTAArea from "@containers/cta";

// Demo data
// import aboutData from "../data/innerpages/about.json";
const aboutData = {
    section: "about-section",
    section_title: {
        title: "About us",
    },
    image: {
        src: "/images/bg/bg-image-22.jpg",
    },
    items: [
        {
            id: 1,
            title: "Why We Do This",
            description:
                "NFTs are a new medium of expression that gives you the freedom to unleash your imagination in the real world and get remunerated for it. Our technology enables everyone to scale their artistic potential. We give you the digital paintbrush to create your unique NFT collection!",
            // path: "/",
        },
        {
            id: 2,
            title: "Helping You <br/> Grow In Every Stage.",
            description:
                "Whether you are an artist, business or NFT enthusiast, we help you achieve your goals with our streamlined interface and innovative technology. You no longer need to be a tech wizard to mint your own NFTs.",
        },
    ],
};
const quoteData = {
    section: "quote-section",
    section_title: {
        title: "Create, Sell & Collect your NFTs at the touch of a button",
    },
    texts: [
        {
            id: 1,
            content:
                "Minting, buying and selling NFTs has never been easier. We put the power of creation at your fingertips, enabling you to join the booming NFT economy powered by AIs.",
        },
    ],
};
const funfactData = {
    section: "funfact-section",
    section_title: {
        title: "Humans Statistics",
    },
    funfacts: [
        {
            id: 1,
            title: "Humans All NFT's",
            counter: 100,
        },
        {
            id: 2,
            title: "All Creators",
            counter: 500,
            suffix: "+",
        },
    ],
};

const About = () => (
    <Wrapper>
        <SEO pageTitle="About us" />
        <Header />
        <main id="main-content">
            <AboutArea data={aboutData} />
            <QuoteArea data={quoteData} />
            <FunfactArea data={funfactData} />
            {/* <CTAArea data={ctaData} /> */}
        </main>
        <Footer />
    </Wrapper>
);

export async function getStaticProps() {
    return {
        props: {
            className: "template-color-1",
        },
    };
}

About.propTypes = {};

export default About;
