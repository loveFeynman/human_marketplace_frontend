import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import CreateNewArea from "@containers/create-new";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => (
    <Wrapper>
        <SEO pageTitle="Create New NFT" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="Create New NFT" />
            <CreateNewArea />
        </main>
        <Footer />
    </Wrapper>
);

export default Home;
