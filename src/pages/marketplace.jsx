import { useMemo } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/explore-product/layout-01";
import { useAppSelector } from "@app/hooks";
import { useRouter } from "next/router";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Product = () => {
    const router = useRouter();
    const { nftAddress } = router.query;
    const marketplaceNfts = useAppSelector(
        (state) => state.marketplaceNfts[nftAddress]
    );

    const productData = useMemo(
        () =>
            // if (!marketplaceNfts) return [];
            // return marketplaceNfts.map((nft) => ({
            //     id: nft.token_id,
            //     nft,
            // }));
            ({
                id: nftAddress || "nft marketplace",
                nft: marketplaceNfts || [],
            }),
        [marketplaceNfts, nftAddress]
    );
    return (
        <Wrapper>
            <SEO pageTitle="Marketplace" />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle="Marketplace" currentPage="Marketplace" />
                <ProductArea data={{ products: productData }} hiddenExpired />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Product;
