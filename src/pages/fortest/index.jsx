// import { useState } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
// import Breadcrumb from "@components/breadcrumb";
// import ProductArea from "@containers/explore-product/layout-01";
// import NiceSelect from "@ui/nice-select";
// import { useAppSelector } from "@app/hooks";
// import { useRouter } from "next/router";
// import Button from "@ui/button";
// import { useContract } from "@hooks";
// import axios from "axios";
import NftItem from "@components/nft-item/testNftItem";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const productData = {
    id: "human1udfs22xpxle475m2nz7u47jfa3vngncdegmczwwdx00cmetypa3s3hmpkx",
    nft: [
        {
            bids: {
                max_bid: "0",
                max_bidder:
                    "human1elaymnd2epmfr498h2x9p2nezc4eklv95uv92u9csfs8wl75w7yqn3hmud",
            },
            collection: "SecondHumanCollection",
            expires_at: 1666980929892,
            funds_recipient: "human1m0qjv7m6dq06z09u3uv283c62dufl5cl62ch8r",
            image_url:
                "https://secretsteampunks.mypinata.cloud/ipfs/QmdkjgT5CYivvFkvSvUdFF7b4QaeBikBaAbfthTVgD8FdP/SteamPunk_Human_96.png",
            price: {
                denom: "uheart",
                amount: 1000000000,
            },
            sale_type: "auction",
            seller: "human1m0qjv7m6dq06z09u3uv283c62dufl5cl62ch8r",
            token_address:
                "human1udfs22xpxle475m2nz7u47jfa3vngncdegmczwwdx00cmetypa3s3hmpkx",
            token_id: "Human2.96",
            token_url:
                "https://secretsteampunks.mypinata.cloud/ipfs/QmS7MVPQ1JjP3oBV2AyHP8YfmYqXCNfzBVyF3HdTogy7YX/SteamPunk_Human_96.png",
        },
    ],
};

const Product = () => (
    <Wrapper>
        <SEO pageTitle="Marketplace" />
        <Header />
        <main id="main-content">
            <div className="row g-5" style={{ padding: "30px" }}>
                <div className="col-5 col-lg-4 col-md-6 col-sm-6 col-12">
                    <NftItem overlay item={productData.nft[0]} />
                </div>
            </div>
        </main>
        <Footer />
    </Wrapper>
);

export default Product;
