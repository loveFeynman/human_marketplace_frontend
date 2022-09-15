import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import CreateNewArea from "@containers/create-new-collection";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => (
    <Wrapper>
        <SEO pageTitle="Create New Collection" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="Create New Collection" />
            <CreateNewArea isAdminPage />
        </main>
        <Footer />
    </Wrapper>
);

export default Home;
