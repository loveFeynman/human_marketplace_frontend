import PropTypes from "prop-types";
// import Image from "next/image";
import Button from "@ui/button";
import { useWalletManager } from "@noahsaso/cosmodal";
import { checkKeplr } from "src/context/WalletProvider";
import { HeadingType, TextType, ButtonType, ImageType } from "@utils/types";
import Product from "@components/product/layout-01";

const HeroArea = ({ data }) => {
    const { connect, connectedWallet } = useWalletManager();
    return (
        <div className="slider-style-5 rn-section-gapTop">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 order-2 order-lg-1 mt_md--30 mt_sm--30 pr--90">
                        {data?.headings[0]?.content && (
                            <h2
                                className="title"
                                // data-sal-delay="200"
                                // data-sal="slide-up"
                                // data-sal-duration="800"
                            >
                                {data.headings[0].content}
                            </h2>
                        )}
                        {data?.texts?.map((text) => (
                            <p
                                className="slide-disc"
                                // data-sal-delay="300"
                                // data-sal="slide-up"
                                // data-sal-duration="800"
                                key={text.id}
                            >
                                {text.content}
                            </p>
                        ))}
                        <div className="button-group">
                            {connectedWallet ? (
                                <Button path="/create-nft" color="primary-alta">
                                    Create
                                </Button>
                            ) : (
                                <Button
                                    onClick={async () => {
                                        connect();
                                        await checkKeplr();
                                    }}
                                >
                                    Get Started
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 order-1 order-lg-2">
                        <div className="row g-5">
                            {data?.products?.map((prod) => (
                                <div
                                    className="col-lg-6 col-md-6"
                                    key={prod.id}
                                >
                                    <Product
                                        overlay
                                        title={prod.title}
                                        slug={prod.slug}
                                        latestBid={prod.latestBid}
                                        price={prod.price}
                                        likeCount={prod.likeCount}
                                        auction_date={prod.auction_date}
                                        image={prod.images?.[0]}
                                        authors={prod.authors}
                                        bitCount={prod.bitCount}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* {data?.images?.[0]?.src && (
                            <div className="slider-thumbnail">
                                <Image
                                    src={data.images[0].src}
                                    alt={data.images[0]?.alt || "Slider Images"}
                                    width={585}
                                    height={593}
                                />
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

HeroArea.propTypes = {
    data: PropTypes.shape({
        headings: PropTypes.arrayOf(HeadingType),
        texts: PropTypes.arrayOf(TextType),
        buttons: PropTypes.arrayOf(ButtonType),
        images: PropTypes.arrayOf(ImageType),
    }),
};

export default HeroArea;
