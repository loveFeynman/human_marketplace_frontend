import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import { ImageType } from "@utils/types";

const BlogDetailsArea = ({ className }) => {
    return (
        <div className={clsx("blog-details-area", className)}>
            <div className="blog-content-top">
                <h2 className="title">Tutorials:</h2>
            </div>
            <div className="news-details">
                <h3 className="title">1. Set up your wallet.</h3>
                <p>
                    Humans Marketplace uses Keplr, an open-source browser
                    extension wallet for the Cosmos interchain ecosystem. <br />
                    All Keplr transactions are signed offline on your device,
                    meaning that all your private keys are encrypted and
                    securely stored on your computer. <br />
                    To set up your Keplr wallet: <br />- Download the addon from
                    the browser’s application store <br />
                    - Install the Keplr extension <br />- Click on the installed
                    Keplr extension that will prompt the following page in your
                    browser:
                </p>
            </div>
        </div>
    );
};

BlogDetailsArea.propTypes = {
    className: PropTypes.string,
    post: PropTypes.shape({
        title: PropTypes.string,
        date: PropTypes.string,
        image: ImageType,
        content: PropTypes.string,
    }),
};

export default BlogDetailsArea;
