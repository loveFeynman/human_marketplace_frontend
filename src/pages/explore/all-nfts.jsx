import { useMemo } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/explore-product/layout-01";
import { useAppSelector } from "@app/hooks";
// import { useRouter } from "next/router";
// import { useWalletManager } from "@noahsaso/cosmodal";
// import Button from "@ui/button";
// import Anchor from "@ui/anchor";

// export async function getStaticProps() {
//     return { props: { className: "template-color-1" } };
// }

const Product = () => {
    // const router = useRouter();
    // const { connectedWallet } = useWalletManager();
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const myNfts = useAppSelector((state) => state.myNfts);
    // const collectionInfo = useAppSelector((state) => state.collections);

    const productData = useMemo(() => {
        let nft = [];
        Object.keys(marketplaceNfts).forEach((key) => {
            const crrMarketplaceNfts = marketplaceNfts[key];
            if (key !== "addresses" && crrMarketplaceNfts.length > 0) {
                nft = nft.concat(crrMarketplaceNfts);
            }
        });
        Object.keys(myNfts).forEach((key) => {
            const crrMyNfts = myNfts[key];
            if (key !== "addresses" && crrMyNfts.length > 0) {
                nft = nft.concat(crrMyNfts);
            }
        });
        return {
            id: "all nfts",
            nft,
        };
    }, [marketplaceNfts, myNfts]);

    return (
        <Wrapper>
            <SEO pageTitle="Explore NFTs" />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle="Explore All NFTs"
                    currentPage="Explore All NFTs"
                />
                <ProductArea data={{ products: productData }} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Product;
