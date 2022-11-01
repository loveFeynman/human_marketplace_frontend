import { useWalletManager } from "@noahsaso/cosmodal";
import Anchor from "@ui/anchor";
import Image from "next/image";
// import { CustomWalletContext } from "@context";
import { useAppSelector } from "@app/hooks";
import { getImageFromHash } from "@utils/ipfs";

const UserDropdown = () => {
    const { disconnect, connectedWallet } = useWalletManager();
    // const { connectedWallet, disconnect } = useContext(CustomWalletContext);
    const balance = useAppSelector((state) => state.balance);
    const userInfo = useAppSelector((state) => state.user.userInfo);

    return (
        <div className="icon-box">
            {/* <Anchor path="/author">
                <Image
                    src="/images/icons/boy-avater.png"
                    alt="Images"
                    layout="fixed"
                    width={38}
                    height={38}
                />
            </Anchor> */}
            <Image
                src={
                    userInfo.logo
                        ? getImageFromHash(userInfo.logo)
                        : "/images/icons/avatar.png"
                }
                alt="Images"
                layout="fixed"
                width={38}
                height={38}
            />
            <div className="rn-dropdown">
                <div className="rn-inner-top">
                    <h4 className="title">
                        {connectedWallet.name}
                        {/* <Anchor path="/product">Christopher William</Anchor> */}
                    </h4>
                    {/* <span>
                    <Anchor path="/product">Set Display Name</Anchor>
                </span> */}
                </div>
                <div className="rn-product-inner">
                    <ul className="product-list">
                        <li className="single-product-list">
                            <div className="thumbnail">
                                {/* <Anchor path="/product">
                                    <Image
                                        src="/images/portfolio/portfolio-07.jpg"
                                        alt="Nft Product Images"
                                        layout="fixed"
                                        width={50}
                                        height={50}
                                    />
                                </Anchor> */}
                                <Image
                                    src={
                                        userInfo.logo
                                            ? getImageFromHash(userInfo.logo)
                                            : "/images/icons/avatar.png"
                                    }
                                    alt="Nft Product Images"
                                    layout="fixed"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="content">
                                <h6 className="title">
                                    {/* <Anchor path="/product">Balance</Anchor> */}
                                    Balance
                                </h6>
                                <span className="price">
                                    {`${balance.amount || "0"} $HEART`}
                                </span>
                            </div>
                            <div className="button" />
                        </li>
                        {/* <li className="single-product-list">
                            <div className="thumbnail">
                                <Anchor path="/product">
                                    <Image
                                        src="/images/portfolio/portfolio-01.jpg"
                                        alt="Nft Product Images"
                                        layout="fixed"
                                        width={50}
                                        height={50}
                                    />
                                </Anchor>
                            </div>
                            <div className="content">
                                <h6 className="title">
                                    <Anchor path="/product">Balance</Anchor>
                                </h6>
                                <span className="price">25 ETH</span>
                            </div>
                            <div className="button" />
                        </li> */}
                    </ul>
                </div>
                {/* <div className="add-fund-button mt--20 pb--20">
                    <Anchor
                        className="btn btn-primary-alta w-100"
                        path="/connect"
                    >
                        Add Your More Funds
                    </Anchor>
                </div> */}
                <ul className="list-inner">
                    <li>
                        <Anchor path="/profile/my-collections">
                            My Collections
                        </Anchor>
                    </li>
                    <li>
                        <Anchor path={`/profile/${connectedWallet?.address}`}>
                            My Profile
                        </Anchor>
                    </li>
                    {/* <li>
                        <Anchor path="/my-nfts">My Nfts</Anchor>
                    </li> */}
                    <li>
                        <button type="button" onClick={disconnect}>
                            Disconnect
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserDropdown;
