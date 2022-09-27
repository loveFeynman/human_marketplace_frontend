import PropTypes from "prop-types";
import Image from "next/image";
import Button from "@ui/button";
import { useWalletManager } from "@noahsaso/cosmodal";
import { checkKeplr } from "src/context/WalletProvider";
import { HeadingType, TextType, ButtonType, ImageType } from "@utils/types";

const HeroArea = ({ data }) => {
    const { connect, connectedWallet } = useWalletManager();
    return (
        <div className="slider-one rn-section-gapTop">
            <div className="container">
                <div className="row row-reverce-sm align-items-center">
                    <div className="col-lg-5 col-md-6 col-sm-12 mt_sm--50">
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
                    <div className="col-lg-5 col-md-6 col-sm-12 offset-lg-1">
                        {data?.images?.[0]?.src && (
                            <div className="slider-thumbnail">
                                <Image
                                    src={data.images[0].src}
                                    alt={data.images[0]?.alt || "Slider Images"}
                                    width={585}
                                    height={593}
                                />
                            </div>
                        )}
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
