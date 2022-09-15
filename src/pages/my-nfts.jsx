import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useWalletManager } from "@noahsaso/cosmodal";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/explore-product/layout-01";
import { useAppSelector } from "@app/hooks";
// import { CustomWalletContext } from "@context";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const MyNfts = () => {
    const [myNfts, setMyNfts] = useState({});
    const { connectedWallet } = useWalletManager();
    // const { connectedWallet } = useContext(CustomWalletContext);
    const router = useRouter();
    const collections = useAppSelector((state) => state.collections);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const myNftsFromStorage = useAppSelector((state) => state.myNfts);

    useEffect(() => {
        if (!connectedWallet) {
            router.push("/");
        }
    }, [connectedWallet, router]);
    useEffect(() => {
        if (!connectedWallet) return;
        Object.keys(collections).forEach(async (key) => {
            const nftList = [...(myNftsFromStorage[key] || [])];
            marketplaceNfts[key]?.forEach((item) => {
                if (item.seller === connectedWallet.address) {
                    nftList.push(item);
                }
            });
            setMyNfts((prev) => ({
                ...prev,
                [key]: nftList,
            }));
            // if (collection.userDefined) {
            //     const token_ids = [];
            //     const queries = queryResult?.tokens?.map((token_id) => {
            //         token_ids.push(token_id);
            //         return runQuery(collection.nftAddress, {
            //             nft_info: { token_id },
            //         });
            //     });
            //     Promise.all(queries).then((nftResults) => {
            //         const nftList = [];
            //         nftResults.forEach((nft, index) => {
            //             if (nft) {
            //                 nftList.push({
            //                     token_address: key,
            //                     token_id: token_ids[index],
            //                     collection:
            //                         collection.collection_info.title || "",
            //                     image_url: nft.extension?.image_url || "",
            //                     token_url: nft.token_uri || "",
            //                 });
            //             }
            //         });
            //         marketplaceNfts[key]?.forEach((item) => {
            //             if (item.seller === connectedWallet.address) {
            //                 nftList.push(item);
            //             }
            //         });
            //         setMyNfts((prev) => ({
            //             ...prev,
            //             [key]: nftList,
            //         }));
            //     });
            // } else {
            //     const nftList =
            //         queryResult.tokens.map((item) => {
            //             const tokenIdNumber = item.split(".").pop();
            //             const newItem = {
            //                 token_address: key,
            //                 token_id: item,
            //                 collection: collection.collection_info.title || "",
            // eslint-disable-next-line max-len
            //                 image_url: `${collection.mint_info?.base_image_uri}${tokenIdNumber}.png`,
            // eslint-disable-next-line max-len
            //                 token_url: `${collection.mint_info?.base_token_uri}${tokenIdNumber}.png`,
            //             };
            //             return newItem;
            //         }) || [];
            //     marketplaceNfts[key]?.forEach((item) => {
            //         if (item.seller === connectedWallet.address) {
            //             nftList.push(item);
            //         }
            //     });
            //     setMyNfts((prev) => ({
            //         ...prev,
            //         [key]: nftList,
            //     }));
            // }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections, connectedWallet]);

    const productData = useMemo(() => {
        let result = [];
        Object.keys(myNfts).forEach((key) => {
            const nfts = myNfts[key];
            result = result.concat(nfts);
        });
        return { id: "my-nft", nft: result };
    }, [myNfts]);
    return (
        <Wrapper>
            <SEO pageTitle="Marketplace" />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle="My NFTs" currentPage="My NFTs" />
                <ProductArea data={{ products: productData }} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default MyNfts;
