import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import AiExecutorArea from "@containers/ai-nfts/executors";

const Profile = () => (
    <Wrapper>
        <SEO pageTitle="Profile" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="AI NFTs " currentPage="AI NFTs" />
            <AiExecutorArea />
        </main>
        <Footer />
    </Wrapper>
);

export default Profile;
