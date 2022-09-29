import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import UserIntroArea from "@containers/user-intro";
import UserProfileArea from "@containers/user-profile";

const Profile = () => (
    <Wrapper>
        <SEO pageTitle="Profile" />
        <Header />
        <main id="main-content">
            <UserIntroArea />
            <UserProfileArea />
        </main>
        <Footer />
    </Wrapper>
);

export default Profile;
