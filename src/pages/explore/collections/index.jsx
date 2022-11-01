import { useState, useEffect } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import FilterButtons from "@components/filter-buttons";
import CollectionArea from "@containers/collection";
import { useAppSelector } from "@app/hooks";
import { GetTopCollections } from "@containers/collection/hooks";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Collection = () => {
    const collections = useAppSelector((state) => state.collections);
    const topCollections = GetTopCollections();
    const filters = ["lowest", "highest"];
    const [sortedData, setSortedData] = useState([]);
    const [sortKey, setSortKey] = useState("highest");
    useEffect(() => {
        const result = [];
        Object.keys(collections).forEach((key) => {
            const collection = collections[key];
            const totalItem = Number.isNaN(
                Number(collection.mint_info?.total_supply)
            )
                ? 0
                : Number(collection.mint_info?.total_supply);
            const tradingVolume =
                topCollections.find((_item) => _item.id === key)
                    ?.tradingVolume || 0;
            if (key !== "addresses") {
                result.push({
                    id: key,
                    title: collection.collection_info?.title || "",
                    slug: `/explore/collections/${key}`,
                    total_item: totalItem,
                    tradingVolume,
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
        if (sortKey === "highest") {
            setSortedData(
                result.sort((a, b) => a.tradingVolume - b.tradingVolume)
            );
        } else {
            setSortedData(
                result.sort((a, b) => b.tradingVolume - a.tradingVolume)
            );
        }
    }, [collections, sortKey, topCollections]);

    const filterHandler = async (filterKey) => {
        setSortKey(filterKey);
    };
    return (
        <Wrapper>
            <SEO pageTitle="Explore Collections" />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle="Explore Collections"
                    currentPage="Explore Collections"
                />
                <div className="container mt--20">
                    <FilterButtons
                        buttons={filters}
                        filterHandler={filterHandler}
                        allShow={false}
                    />
                </div>

                <CollectionArea data={{ collections: sortedData }} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Collection;
