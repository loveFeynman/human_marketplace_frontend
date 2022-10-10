import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import AiNftsArea from "@containers/ai-nfts";

import productData from "../../data/products-02.json";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const AiNft = () => {
    const liveAuctionData = productData
        .filter(
            (prod) =>
                prod?.auction_date && new Date() <= new Date(prod?.auction_date)
        )
        .slice(0, 5);
    return (
        <Wrapper>
            <SEO pageTitle="AI NFTs" />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle="AI NFTs" currentPage="AI NFTs" />
                <AiNftsArea
                    data={{
                        products: liveAuctionData,
                    }}
                />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default AiNft;
