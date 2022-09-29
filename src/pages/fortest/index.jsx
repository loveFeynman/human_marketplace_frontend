import { useState } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
// import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/explore-product/layout-01";
import NiceSelect from "@ui/nice-select";
// import { useAppSelector } from "@app/hooks";
// import { useRouter } from "next/router";
import Button from "@ui/button";
import { useContract } from "@hooks";

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

const Product = () => {
    const { runExecute } = useContract();
    const [option, setOption] = useState("option1");
    const handleChangeCollection = (item, name) => {
        console.log("select option: ", item, name);
        // setValue(name, item.value);
        setOption(item.value);
    };
    const handleSubmit = async () => {
        const result = await runExecute(
            "human15fxl9g5pfjdhfqtmspmhpwtlxhfkwh9l2yk2uj926qqvg3gsfkuqwct4x8",
            {
                execute_algorithm: {
                    msg: {
                        provider_id: "1",
                        nft_addr:
                            "human1e8z2wjelypwxw5sey62jvwjyup88w55q3h6m0x8jtwjf6sx5c7ystheysl",
                        token_id: "nft1",
                    },
                },
            },
            {
                funds: "1",
                denom: "uheart",
            }
        );

        console.log("result: ", result);
    };
    return (
        <Wrapper>
            <SEO pageTitle="Marketplace" />
            <Header />
            <main id="main-content">
                <ProductArea data={{ products: productData }} hiddenExpired />
                <div
                    className="container container-no-max-width"
                    style={{ width: "1400px" }}
                >
                    <div
                        style={{
                            columnGap: "40px",
                            alignItems: "center",
                            display: "flex",
                        }}
                    >
                        <NiceSelect
                            options={[
                                { value: "option1", text: "Submit1" },
                                { value: "option2", text: "Submit2" },
                                { value: "option3", text: "Submit3" },
                            ]}
                            placeholder="Select Option"
                            onChange={handleChangeCollection}
                            name="option"
                            defaultCurrent={option}
                        />
                        <Button onClick={handleSubmit} type="submit">
                            {option}
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Product;
