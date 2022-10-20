import { useMemo } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/explore-product/layout-01";
import { useAppSelector } from "@app/hooks";
import { useRouter } from "next/router";
import { useWalletManager } from "@noahsaso/cosmodal";
import Button from "@ui/button";
import Anchor from "@ui/anchor";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Product = () => {
    const router = useRouter();
    const { nftAddress } = router.query;
    const { connectedWallet } = useWalletManager();
    const marketplaceNfts = useAppSelector(
        (state) => state.marketplaceNfts[nftAddress]
    );
    const myNfts = useAppSelector((state) => state.myNfts[nftAddress]);
    const collectionInfo = useAppSelector((state) => state.collections[nftAddress]);

    const productData = useMemo(
        () =>
            // if (!marketplaceNfts) return [];
            // return marketplaceNfts.map((nft) => ({
            //     id: nft.token_id,
            //     nft,
            // }));
            ({
                id: nftAddress || "nft marketplace",
                nft: collectionInfo.userDefined? (marketplaceNfts || []).concat(myNfts || []) : marketplaceNfts || [],
            }),
        [marketplaceNfts, nftAddress]
    );

    return (
        <Wrapper>
            <SEO pageTitle="Marketplace" />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle="Marketplace" currentPage="Marketplace" />
                {collectionInfo?.userDefined && collectionInfo?.minter === connectedWallet?.address && 
                    <div className="ptb--30 container">
                        <Button>
                            <Anchor path="/create-nft">
                                Create an Nft
                            </Anchor>
                        </Button>
                    </div>
                }
                <ProductArea data={{ products: productData }} hiddenExpired />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Product;
