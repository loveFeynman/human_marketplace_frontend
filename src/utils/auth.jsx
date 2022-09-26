import { useWalletManager } from "@noahsaso/cosmodal";
import { useRouter } from "next/router";

const withAuth = (Component) => {
    const Auth = () => {
        const { connectedWallet } = useWalletManager();
        const router = useRouter();

        // If user is not logged in, return login component
        if (!connectedWallet) {
            router.push("/");
            return null;
        }
        return <Component />;

        // If user is logged in, return original component
    };

    return Auth;
};

export default withAuth;
