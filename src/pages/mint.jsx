import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/product";
import { useAppSelector } from "@app/hooks";
import { ChainConfig } from "@constant";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const RandomMint = () => {
    const collections = useAppSelector((state) => state.collections);
    const productData = [];
    Object.keys(collections).forEach((key) => {
        const collection = collections[key];
        if (!collection.userDefined) {
            const image_url = collection?.collection_info?.background_url;
            productData.push({
                id: key,
                title: collection.collection_info?.title || "",
                price: {
                    public: {
                        amount: collection.mint_info?.public_price?.amount,
                        currency: ChainConfig.microDenom,
                    },
                    private: {
                        amount: collection.mint_info?.private_price?.amount,
                        currency: ChainConfig.microDenom,
                    },
                },
                images: [
                    {
                        src: image_url.includes("background_url")
                            ? "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png"
                            : image_url,
                    },
                ],
                contractAddress: collection.minter,
                total_supply: collection.mint_info?.total_supply,
            });
        }
    });
    return (
        <Wrapper>
            <SEO pageTitle="Mint" />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle="Mint" currentPage="Mint" />
                <ProductArea
                    data={{
                        // section_title: {
                        //     title: "OUR All NFT'S",
                        // },
                        products: productData,
                        // notifications: notificationData,
                        // creators: sellerData,
                    }}
                />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default RandomMint;
