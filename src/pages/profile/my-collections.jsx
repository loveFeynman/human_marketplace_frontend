import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import CollectionArea from "@containers/collection";
import { useAppSelector } from "@app/hooks";
import { useMemo } from "react";
import { useWalletManager } from "@noahsaso/cosmodal";
import Button from "@ui/button";
import Anchor from "@ui/anchor";
import withAuth from "@utils/auth";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const MyCollections = () => {
    const collections = useAppSelector((state) => state.collections);
    const { connectedWallet } = useWalletManager();
    const collectionsData = useMemo(() => {
        const result = [];
        Object.keys(collections).forEach((key) => {
            const collection = collections[key];
            const totalItem = Number.isNaN(
                Number(collection.mint_info?.total_supply)
            )
                ? 0
                : Number(collection.mint_info?.total_supply);
            if (
                key !== "addresses" &&
                collection.minter === connectedWallet?.address
            ) {
                result.push({
                    id: key,
                    title: collection.collection_info?.title || "",
                    // slug: `/marketplace?nftAddress=${key}`,
                    slug: `/explore/collections/${key}`,
                    total_item: totalItem,
                    image: {
                        src:
                            collection.collection_info?.background_url ||
                            "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_301.png",
                        // src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_301.png",
                    },
                    thumbnails: [
                        {
                            src: "/images/collection/collection-sm-01.jpg",
                        },
                        {
                            src: "/images/collection/collection-sm-02.jpg",
                        },
                        {
                            src: "/images/collection/collection-sm-03.jpg",
                        },
                    ],
                    profile_image: {
                        src:
                            collection.collection_info?.logo_url ||
                            "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png",
                        // src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png",
                    },
                });
            }
        });
        return result;
    }, [collections, connectedWallet]);
    return (
        <Wrapper>
            <SEO pageTitle="My Collections" />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle="My Collections"
                    currentPage="My Collections"
                />
                <div className="ptb--30 container d-flex justify-content-center">
                    <Button>
                        <Anchor path="/create-collection">
                            Create a Collection
                        </Anchor>
                    </Button>
                </div>
                <CollectionArea
                    showAll
                    data={{ collections: collectionsData }}
                />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default withAuth(MyCollections);
