/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import clsx from "clsx";
// import Image from "next/image";
// import { ImageType } from "@utils/types";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const AddYourNfts = () => (
    <Wrapper>
        <SEO pageTitle="Set up your wallet" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="How to set up your wallet"
                currentPage="Tutorials"
            />
            <div className="rn-blog-area rn-blog-details-default rn-section-gapTop">
                <div className="container">
                    <div className="row g-6">
                        <div className={clsx("blog-details-area")}>
                            {/* <div className="blog-content-top">
                                <h2 className="title">Tutorials:</h2>
                            </div> */}
                            <div className="news-details">
                                <h3 className="title">
                                    1. Set up your wallet.
                                </h3>
                                <p className="pt--10">
                                    Humans Marketplace uses Keplr, an
                                    open-source browser extension wallet for the
                                    Cosmos interchain ecosystem. <br />
                                    All Keplr transactions are signed offline on
                                    your device, meaning that all your private
                                    keys are encrypted and securely stored on
                                    your computer. <br />
                                    To set up your Keplr wallet: <br />-
                                    Download the addon from the browser&apos;s
                                    application store <br />
                                    - Install the Keplr extension <br />- Click
                                    on the installed Keplr extension that will
                                    prompt the following page in your browser:
                                </p>
                                <img src="/images/tutorials/1.png" alt="1" />
                                <p className="pt--10">
                                    - Either Create a new account or Import an
                                    existing account with the mnemonic phrase
                                    you got from the previous step of creating
                                    an account.
                                    <br /> <br />
                                    NOTE: The wallet is currently not fully
                                    connected to the Humans Marketplace network,
                                    so you’ll have to follow the extra step
                                    below.
                                </p>
                                <h4>Link Keplr to the Humans network</h4>
                                <p className="pt--10">
                                    - Open the Humans Marketplace <br /> - Click
                                    on “Wallet” or click the Get Started button
                                </p>
                                <img src="/images/tutorials/2.png" alt="2" />
                                <p className="pt--10">
                                    - Click on the “Keplr Wallet” button at the
                                    top of the screen (used for login):
                                </p>
                                <img src="/images/tutorials/3.png" alt="3" />
                                <p className="pt--10">- Input your password:</p>
                                <img src="/images/tutorials/4.png" alt="4" />
                                <p className="pt--10">
                                    - A pop-out window will ask you for
                                    permission to add a new network to Keplr and
                                    also give access – it will look like this:
                                </p>
                                <img src="/images/tutorials/5.png" alt="5" />
                                <p className="pt--10">
                                    - After you approve both screens, you need
                                    to open the extension and click on the
                                    network name at the top (the default is
                                    Cosmos Hub). From there, a menu with all the
                                    networks will open, scroll down and select
                                    Humans Network. <br />
                                    After that, Keplr will visualize the correct
                                    information about your account. The address
                                    displayed will be your Humans native wallet
                                    address.
                                </p>
                                <img src="/images/tutorials/6.png" alt="6" />
                                <p className="pt--10">
                                    - Once you have set up and linked your Keplr
                                    wallet to the Humans network, you can now
                                    perform token interactions on the Humans
                                    network, including staking to earn rewards
                                    and getting involved in shaping our
                                    network’s future by participating in network
                                    governance, voting on active proposals and
                                    deploying smart contracts.
                                </p>
                                <h4>Resources</h4>
                                <a
                                    href="https://medium.com/chainapsis/how-to-use-keplr-wallet-40afc80907f6"
                                    target="__blank"
                                >
                                    <p className="pt--5">
                                        {" "}
                                        - Complete guide on how to use the Keplr
                                        Wallet
                                    </p>
                                </a>
                                <a
                                    href="https://www.cudos.org/blog/how-to-create-a-keplr-wallet-a-complete-step-by-step-guide/"
                                    target="__blank"
                                >
                                    <p className="pt--5">
                                        - How to create a Keplr wallet — a
                                        complete step-by-step guide
                                    </p>
                                </a>

                                <a
                                    href="https://docs.keplr.app/"
                                    target="__blank"
                                >
                                    <p className="pt--5">
                                        - Keplr Documentation
                                    </p>
                                </a>

                                <a
                                    href="https://medium.com/everett-protocol/introducing-keplr-an-interchain-wallet-for-cosmos-applications-a260aac64eaa"
                                    target="__blank"
                                >
                                    <p className="pt--5 pb--10">
                                        - Introducing Keplr: an Interchain
                                        Wallet for Cosmos Applications
                                    </p>
                                </a>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </Wrapper>
);

AddYourNfts.propTypes = {
    post: PropTypes.shape({}),
    categories: PropTypes.arrayOf(PropTypes.shape({})),
    recentPosts: PropTypes.arrayOf(PropTypes.shape({})),
    tags: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    relatedPosts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default AddYourNfts;
