import { useState } from "react";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Button from "@ui/button";
import { useRouter } from "next/router";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const AiTransaction = () => {
    const router = useRouter();
    const { volume, queue, floor_time, price, id } = router.query;
    const [success, setSuccess] = useState(false);
    const handlePay = async () => {
        setSuccess(true);
    };
    return (
        <Wrapper>
            <SEO pageTitle="AI NFTs" />
            <Header />
            <main id="main-content">
                <div className="ai-transaction-style-one">
                    <div className="ai-transaction-header">Transaction</div>
                    {!success ? (
                        <div className="ai-transaction-content">
                            <h1>Executor name {id}</h1>
                            <span>In queue: {queue}</span>
                            <div className="flex-between">
                                <div>Execution count</div>
                                <span>{volume}</span>
                            </div>
                            <div className="flex-between">
                                <div>Average execution time</div>
                                <span>{floor_time}</span>
                            </div>
                            <div className="flex-between">
                                <div>Price</div>
                                <span>{price}</span>
                            </div>
                            <Button fullwidth onClick={handlePay}>
                                Pay
                            </Button>
                        </div>
                    ) : (
                        <div className="ai-transaction-content">
                            <h1 className="color-green">
                                Transaction confirmed
                            </h1>
                            <div className="success-row">
                                <div>Payed</div>
                                <span>72615 $HEART</span>
                            </div>
                            <div className="success-row">
                                <div>Tx</div>
                                <span>
                                    0xf16e9b0d03470827a95cdfd0cb8a8a3b46969k91
                                </span>
                            </div>
                            <div className="success-row">
                                <div>Signature</div>
                                <span>
                                    0x4d250e359144acec57995340a1cb84d2345d05c907d3623de...
                                </span>
                            </div>
                            <Button fullwidth>To AI NFT</Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </Wrapper>
    );
};

export default AiTransaction;
