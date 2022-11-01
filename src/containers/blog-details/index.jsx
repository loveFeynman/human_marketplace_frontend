/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import clsx from "clsx";
// import Image from "next/image";
import { ImageType } from "@utils/types";

const BlogDetailsArea = ({ className }) => (
    <div className={clsx("blog-details-area", className)}>
        <div className="blog-content-top">
            <h2 className="title">Tutorials:</h2>
        </div>
        <div className="news-details">
            <h3 className="title">1. Set up your wallet.</h3>
            <p className="pt--10">
                Humans Marketplace uses Keplr, an open-source browser extension
                wallet for the Cosmos interchain ecosystem. <br />
                All Keplr transactions are signed offline on your device,
                meaning that all your private keys are encrypted and securely
                stored on your computer. <br />
                To set up your Keplr wallet: <br />- Download the addon from the
                browser&apos;s application store <br />
                - Install the Keplr extension <br />- Click on the installed
                Keplr extension that will prompt the following page in your
                browser:
            </p>
            <img src="/images/tutorials/1.png" alt="1" />
            <p className="pt--10">
                - Either Create a new account or Import an existing account with
                the mnemonic phrase you got from the previous step of creating
                an account.
                <br /> <br />
                NOTE: The wallet is currently not fully connected to the Humans
                Marketplace network, so you’ll have to follow the extra step
                below.
            </p>
            <h4>Link Keplr to the Humans network</h4>
            <p className="pt--10">
                - Open the Humans Marketplace <br /> - Click on “Wallet” or
                click the Get Started button
            </p>
            <img src="/images/tutorials/2.png" alt="2" />
            <p className="pt--10">
                - Click on the “Keplr Wallet” button at the top of the screen
                (used for login):
            </p>
            <img src="/images/tutorials/3.png" alt="3" />
            <p className="pt--10">- Input your password:</p>
            <img src="/images/tutorials/4.png" alt="4" />
            <p className="pt--10">
                - A pop-out window will ask you for permission to add a new
                network to Keplr and also give access – it will look like this:
            </p>
            <img src="/images/tutorials/5.png" alt="5" />
            <p className="pt--10">
                - After you approve both screens, you need to open the extension
                and click on the network name at the top (the default is Cosmos
                Hub). From there, a menu with all the networks will open, scroll
                down and select Humans Network. <br />
                After that, Keplr will visualize the correct information about
                your account. The address displayed will be your Humans native
                wallet address.
            </p>
            <img src="/images/tutorials/6.png" alt="6" />
            <p className="pt--10">
                - Once you have set up and linked your Keplr wallet to the
                Humans network, you can now perform token interactions on the
                Humans network, including staking to earn rewards and getting
                involved in shaping our network’s future by participating in
                network governance, voting on active proposals and deploying
                smart contracts.
            </p>
            <h4>Resources</h4>
            <a
                href="https://medium.com/chainapsis/how-to-use-keplr-wallet-40afc80907f6"
                target="__blank"
            >
                <p className="pt--5">
                    {" "}
                    - Complete guide on how to use the Keplr Wallet
                </p>
            </a>
            <a
                href="https://www.cudos.org/blog/how-to-create-a-keplr-wallet-a-complete-step-by-step-guide/"
                target="__blank"
            >
                <p className="pt--5">
                    - How to create a Keplr wallet — a complete step-by-step
                    guide
                </p>
            </a>

            <a href="https://docs.keplr.app/" target="__blank">
                <p className="pt--5">- Keplr Documentation</p>
            </a>

            <a
                href="https://medium.com/everett-protocol/introducing-keplr-an-interchain-wallet-for-cosmos-applications-a260aac64eaa"
                target="__blank"
            >
                <p className="pt--5 pb--10">
                    - Introducing Keplr: an Interchain Wallet for Cosmos
                    Applications
                </p>
            </a>
            <br />
            <h3 className="title">2. Create your collection</h3>
            <p className="pt--10">
                - Hover over your profile picture and open the following menu:
            </p>
            <img src="/images/tutorials/7.png" alt="7" />
            <p className="pt--10">
                - From here, click on “My Collections”. It will open “Our
                Collections” screen:
            </p>
            <img src="/images/tutorials/8.png" alt="8" />
            <p className="pt--10">- Click on “Create a Collection” button</p>
            <img src="/images/tutorials/9.png" alt="9" />
            <p className="pt--10">
                - Now the collection creation page will be opened, like so:
            </p>
            <img src="/images/tutorials/10.png" alt="10" />
            <p className="pt--10">
                - Fill in the form with the necessary information.
            </p>
            <img src="/images/tutorials/11.png" alt="11" />
            <p className="pt--10">
                - Click the “Create Collection” button <br /> - Approve the
                Keplr transaction request, in order to successfully create the
                collection, like
            </p>
            <img src="/images/tutorials/12.png" alt="12" />
            <p className="pt--10">
                A new collection is created and you can see it when you go to
                the explore page.
            </p>
            <img src="/images/tutorials/13.png" alt="13" />
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <h3 className="title pt--40">3. Add your NFT's</h3>
            <p className="pt--10">
                - Tap any of the Create buttons, from the top header or from the
                home page:
            </p>
            <img src="/images/tutorials/14.png" alt="14" />
            <img src="/images/tutorials/15.png" alt="15" />
            <p className="pt--10">- A “Create New NFT” page will be opened.</p>
            <img src="/images/tutorials/16.png" alt="16" />
            <p className="pt--10">- Upload a file</p>
            <img src="/images/tutorials/17.png" alt="17" />
            <p className="pt--10">
                - Choose an existing collection (previously created)
            </p>
            <img src="/images/tutorials/18.png" alt="18" />
            <p className="pt--10">- Fill in the necessary information</p>
            <img src="/images/tutorials/19.png" alt="19" />
            <p className="pt--10">- Click on “Submit item”</p>
            <img src="/images/tutorials/20.png" alt="20" />
            <p className="pt--10">- Approve the Keplr transaction request:</p>
            <img src="/images/tutorials/21.png" alt="21" />
            <p className="pt--10">
                - Congratulations, your newly created NFT was added to your
                desired collection and can be now minted via the “Mint” page{" "}
                <br />
                You can also click on the “Preview” button in order to preview
                your NFT:
            </p>
            <img src="/images/tutorials/22.png" alt="22" />
            <p className="pt--10">It will open the following view:</p>
            <img src="/images/tutorials/23.png" alt="23" />
            <h3 className="title pt--40">4. Sell Your NFTs</h3>
            <p className="pt--10">
                - In order to sell your NFTs, you need to follow the previous
                steps (Create a collection and Create NFT) and start minting.
            </p>
            <h4>1) Buy & Sell</h4>
            <h5>(1)Sell</h5>
            <p className="pt--10">
                In this section, we will see how users can put NFTs on sale.{" "}
                <br />- Hover the mouse cursor over the image of your NFT. You
                can see the “Sell” button appear on it.
            </p>
            <img src="/images/tutorials/24.png" alt="24" />
            <p className="pt--10">- Click the “Sell” button</p>
            <img src="/images/tutorials/25.png" alt="25" />
            <p className="pt--10">
                - Input a price at which you want to sell your NFT and decide
                whether to put it on sale or on auction by checking the
                “Auction” checkbox. In this case, confirm that it is unchecked.{" "}
                <br /> - Set the expiration time. After this period, the NFT on
                the marketplace will disappear, and other users cannot buy it.
                <br /> - Click the “Sell” button and approve the transaction.
            </p>
            <img src="/images/tutorials/26.png" alt="26" />
            <p className="pt--10">
                If your NFT is not sold, you can withdraw your NFT at any time:
                <br />- Go to the “On Sale” page and place your mouse cursor on
                the image of your NFT which was put on sale.
            </p>
            <img src="/images/tutorials/27.png" alt="27" />
            <p className="pt--10">- Click the “Withdraw” button</p>
            <img src="/images/tutorials/28.png" alt="28" />
            <p className="pt--10">- Approve the transaction.</p>
            <img src="/images/tutorials/29.png" alt="29" />
            <p className="pt--10">
                Now your NFT is withdrawn from the “On Sale” page and is located
                on the “Owned” page.
            </p>
            <img src="/images/tutorials/30.png" alt="30" />
            <img src="/images/tutorials/31.png" className="pt--20" alt="31" />
            <h5 className="pt--40">(2)Buy</h5>
            <p className="pt--10">
                In this section, we will see how users buy NFTs on the
                marketplace. <br />- Go to the “Explore” page.
            </p>
            <img src="/images/tutorials/32.png" alt="32" />
            <p className="pt--10">
                - Click the collection from which you want to buy NFTs. In this
                example, click the “Human” collection.
            </p>
            <img src="/images/tutorials/33.png" alt="33" />
            <p className="pt--10">
                Now you can see NFTs on sale inside that collection.
                <br />
                - Move your mouse cursor over the image of the NFT you want to
                buy and click the “Buy” button. <br />
                If the NFT is on the auction, you will see the “Set a bid”
                button. You can use the “Filter” function to see only the NFTs
                that are on sale.
            </p>
            <img src="/images/tutorials/34.png" alt="34" />
            <p className="pt--10">
                - Confirm the price of the NFT and click the “Buy” button.
            </p>
            <img src="/images/tutorials/35.png" alt="35" />
            <p className="pt--10">
                - If the transaction is successful, you can find the NFT on the
                “My Profile” page. Now you become the owner of that NFT.
            </p>
            <img
                src="/images/tutorials/36.png"
                className="pt--20 pr--20"
                alt="36"
            />
            <img src="/images/tutorials/37.png" alt="37" />
            <h4 className="pt--40">2) Auction </h4>
            <h5>(1)How to put NFTs on auction</h5>
            <p className="pt--10">
                - Follow the above steps but remember to check the “Auction”
                button this time. <br />- Set the lowest bid price and
                expiration time.
            </p>
            <img src="/images/tutorials/38.png" alt="38" />
            <p className="pt--10">
                - Click the “Sell” button and approve the transaction. Go to the
                “On Sale” page.
            </p>
            <img src="/images/tutorials/39.png" alt="39" />
            <p className="pt--10">
                The seller cannot cancel the auction once it gets started.
            </p>
            <img src="/images/tutorials/40.png" alt="40" />
            <p className="pt--10">
                After the auction expires, you can accept the highest bid
                request. <br />
                Then, your NFT will be transferred to the highest bidder, and
                you will receive the HEART tokens. <br />
                - Go to the detail page by clicking the image of the NFT.
                <br />- Click the “Accept Bid” button and approve the
                transaction.
            </p>
            <img src="/images/tutorials/41.png" alt="41" />
            <img src="/images/tutorials/42.png" className="pt--20" alt="42" />
            <h5 className="pt--40">(2)Bid</h5>
            <p className="pt--10">
                Bidders need to set a bid price within the expiration time at a
                higher price than previous ones. <br />- Go to the “Explore”
                page and click the collection from which you want to buy NFTs.
            </p>
            <img src="/images/tutorials/43.png" alt="43" />
            <p className="pt--10">- Click the “Set a bid” button.</p>
            <img src="/images/tutorials/44.png" alt="44" />
            <p className="pt--10">
                You can see the minimum price and the address of the seller
                under the image of the NFT. You can also go to the detail page
                by clicking the image of the NFT.
                <br /> - Click the “Set a bid” button to execute the
                transaction.
            </p>
            <img src="/images/tutorials/45.png" alt="45" />
            <p className="pt--10">
                Once the user bids, he/she cannot cancel it. <br />
                You can see the bid history and the status of the auction by
                visiting the “My Bids” tab on the “My Profile” page.
            </p>
            <img src="/images/tutorials/46.png" alt="46" />
            <p className="pt--10">
                You can also go to the detail page by clicking the image of the
                NFT.
            </p>
            <img src="/images/tutorials/47.png" alt="47" />
            <p className="pt--10">
                On the detail page, you can see the bid history. <br />
                You can bid again at a higher price than the previous bid.
            </p>
            <img src="/images/tutorials/48.png" alt="48" />
            <p className="pt--10">
                If a bidder offers a higher bid price than yours, you will
                receive the HEARTS you locked in the marketplace back. You can
                bid again at a higher price.
            </p>
            <p className="pt--10">
                If you have the highest bid price at the end of an auction, and
                the owner of the NFT accepts it after the expiration time, you
                will receive that NFT.
            </p>
        </div>
    </div>
);

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
