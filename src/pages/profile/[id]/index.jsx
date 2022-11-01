import { useRouter } from "next/router";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import { useWalletManager } from "@noahsaso/cosmodal";
import UserIntroArea from "@containers/user-intro";
import UserProfileArea from "@containers/user-profile";
import AuthorIntroArea from "@containers/author-intro";
import AuthorProfileArea from "@containers/author-profile";

const Profile = () => {
    const router = useRouter();
    const { id: userAddress } = router.query;
    const { connectedWallet } = useWalletManager();
    return (
        <Wrapper>
            <SEO pageTitle="Profile" />
            <Header />
            <main id="main-content">
                {connectedWallet?.address === userAddress ? (
                    <>
                        <AuthorIntroArea />
                        <AuthorProfileArea />
                    </>
                ) : (
                    <>
                        <UserIntroArea />
                        <UserProfileArea />
                    </>
                )}
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Profile;
