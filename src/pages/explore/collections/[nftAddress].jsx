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

// export async function getStaticProps() {
//     return { props: { className: "template-color-1" } };
// }

const Product = () => {
    const router = useRouter();
    const { nftAddress } = router.query;
    const { connectedWallet } = useWalletManager();
    const marketplaceNfts = useAppSelector(
        (state) => state.marketplaceNfts[nftAddress]
    );
    const myNfts = useAppSelector((state) => state.myNfts[nftAddress]);
    const collectionInfo = useAppSelector(
        (state) => state.collections[nftAddress]
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
                nft: collectionInfo?.userDefined
                    ? (marketplaceNfts || []).concat(myNfts || [])
                    : marketplaceNfts || [],
            }),
        [collectionInfo?.userDefined, marketplaceNfts, myNfts, nftAddress]
    );

    const { collectionTitle, isAvailableCreateNft, description } = useMemo(
        () => ({
            collectionTitle:
                collectionInfo?.collection_info?.title || "Collection",
            isAvailableCreateNft:
                collectionInfo?.userDefined &&
                collectionInfo?.minter === connectedWallet?.address,
            description: collectionInfo?.collection_info?.description || "",
        }),
        [collectionInfo, connectedWallet?.address]
    );

    return (
        <Wrapper>
            <SEO pageTitle={collectionTitle} />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle={collectionTitle}
                    currentPage={collectionTitle}
                    description={description}
                />
                {isAvailableCreateNft && (
                    <div className="ptb--30 container">
                        <Button>
                            <Anchor
                                path={`/create-nft?nftAddress=${collectionInfo.nftAddress}`}
                            >
                                {/* Create an Nft */}
                                Add a new Nft to this Collection
                            </Anchor>
                        </Button>
                    </div>
                )}
                <ProductArea data={{ products: productData }} hiddenExpired />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Product;
