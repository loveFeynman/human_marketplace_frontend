import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import AboutArea from "@containers/about/layout-02";
import QuoteArea from "@containers/quote-area";
import FunfactArea from "@containers/funfact";
import CTAArea from "@containers/cta";

// Demo data
// import aboutData from "../data/innerpages/about.json";
const aboutData = {
    section: "about-section",
    section_title: {
        title: "Direct Teams. <br> For Your Dadicated Dreams",
    },
    image: {
        src: "/images/bg/bg-image-22.jpg",
    },
    items: [
        {
            id: 1,
            title: "Why We Do This",
            description:
                "NFTs are virtual tokens that represent ownership of something inherently distinct and scarce, whether it be a physical or digital item, such as artwork, a soundtrack, a collectible, an in-game item or real estate. Unlike regular cryptocurrencies like bitcoin or fiat money like the U.S.",
            path: "/",
        },
        {
            id: 2,
            title: "Helping You <br/> Grow In Every Stage.",
            description:
                "NFTs are virtual tokens that represent ownership of something inherently distinct and scarce, whether it be a physical or digital item, such as artwork, a soundtrack, a collectible, an in-game item or real estate. Unlike regular cryptocurrencies like bitcoin or fiat money like the U.S.",
        },
    ],
};
const quoteData = {
    section: "quote-section",
    section_title: {
        title: "Create, Sell well & Collect your Wonderful NFTs at Nuron Very Fast",
    },
    texts: [
        {
            id: 1,
            content:
                "The NFTs is a one-trick pony that climbed the ladders of success in recent years. The growth NFTs is tremendous, and according to Pymnts.com, the total sales volume of NFTs has nearly crossed $2.5 billion in the last six months of 2021. Surprisingly, the total sales volume of NFTs was $13.7 million in 2020. On comparing both the values,",
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
        {
            id: 3,
            title: "Humans Earning",
            counter: 700,
        },
        {
            id: 4,
            title: "Level One Seller",
            counter: 900,
            suffix: "+",
        },
    ],
};
const ctaData = {
    section: "cta-section",
    headings: [
        {
            id: 1,
            content:
                "Discover Discover Discover rare digital art <br/> and collect NFTs",
        },
    ],
    texts: [
        {
            id: 1,
            content:
                "The NFTs is a one-trick pony that climbed the recent years. The growth of NFTs is tremendous, and according to Pymnts.com, the total sales volume",
        },
    ],
    buttons: [
        {
            id: 1,
            path: "/create-nft",
            content: "Create",
        },
        {
            id: 2,
            path: "/",
            content: "Contact Us",
            color: "primary-alta",
        },
    ],
    image: {
        src: "/images/bg/bg-image-6.jpg",
    },
};

const About = () => (
    <Wrapper>
        <SEO pageTitle="About" />
        <Header />
        <main id="main-content">
            <AboutArea data={aboutData} />
            <QuoteArea data={quoteData} />
            <FunfactArea data={funfactData} />
            <CTAArea data={ctaData} />
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
