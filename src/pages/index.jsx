import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import ServiceArea from "@containers/services/layout-01";
import HeroArea from "@containers/hero/layout-01";
import TopSellerArea from "@containers/top-seller";
import LiveExploreArea from "@containers/live-explore";
import NewestItmesArea from "@containers/product/new-item";
import CollectionArea from "@containers/collection/top-collection";
import ExploreProductArea from "@containers/explore-product/layout-02";

// Demo Data
import collectionsData from "../data/collections.json";

const data = {
    section: "service-section",
    section_title: {
        title: "Create and sell your NFTs",
    },
    items: [
        {
            id: 1,
            title: "Set up your wallet",
            path: "/tutorials/set-up-your-wallet",
            subtitle: "STEP 1",
            description:
                "The procedure for setting up your wallet differs based on the wallet, however for this example, we'll go through the steps of creating a Keplr wallet.",
            images: [
                {
                    src: "/images/icons/shape-7.png",
                },
            ],
        },
        {
            id: 2,
            title: "Create your collection",
            path: "/tutorials/create-your-collection",
            subtitle: "STEP 2",
            description:
                "Creating a collection on our platform is simple and straightforward. You only need to determine the purpose and royalty rate of your collection and add your NFT's.",
            images: [
                {
                    src: "/images/icons/shape-1.png",
                },
            ],
        },
        {
            id: 3,
            title: "Add your NFTs",
            path: "/tutorials/add-your-nfts",
            subtitle: "STEP 3",
            description:
                "To add an NFT, you'll need a crypto wallet to generate and mint your NFT. This provides an unchangeable record of legitimacy and ownership.",
            images: [
                {
                    src: "/images/icons/shape-5.png",
                },
            ],
        },
        {
            id: 4,
            title: "Sell Your NFTs",
            path: "/tutorials/sell-your-nfts",
            subtitle: "STEP 4",
            description:
                "Selling an NFT on our platform is quick and straightforward. Anyone who has an NFT, whether the inventor or the person who most recently collected it, can sell it for sale.",
            images: [
                {
                    src: "/images/icons/shape-6.png",
                },
            ],
        },
    ],
};
const heroData = {
    section: "hero-section",
    headings: [
        {
            id: 1,
            content: "Explore Your Dedicated Dreams.",
        },
    ],
    texts: [
        {
            id: 1,
            content:
                "Your imagination is what makes you unique. Use our AI technology to share with the world your dreams and artistic vision. Digitize your way of living!",
        },
    ],
    buttons: [
        {
            id: 1,
            content: "Get Started",
            path: "/collections",
        },
        {
            id: 2,
            color: "primary-alta",
            content: "Create",
            path: "/create-nft",
        },
    ],
};
export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => (
    <Wrapper>
        <SEO pageTitle="Home" />
        <Header />
        <div id="main-content">
            <HeroArea data={{ ...heroData }} />
            <ServiceArea data={data} />
            <LiveExploreArea />
            <NewestItmesArea />
            <ExploreProductArea />
            <TopSellerArea />
            <CollectionArea
                data={{
                    collections: collectionsData.slice(0, 4),
                }}
            />
        </div>
        <Footer />
    </Wrapper>
);

export default Home;
