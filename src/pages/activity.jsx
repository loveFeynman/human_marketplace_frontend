import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import ActivityArea from "@containers/activity";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}
const Home = () => (
    <Wrapper>
        <SEO pageTitle="Acivity" />
        <Header />
        <main id="main-content">
            <ActivityArea />
        </main>
        <Footer />
    </Wrapper>
);

export default Home;
