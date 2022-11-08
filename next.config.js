const path = require("path");

module.exports = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_URL,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "./src/assets/scss")],
    },
    images: {
        domains: ["secretsteampunks.mypinata.cloud"],
        // loader: "imgix",
        // path: "https://secretsteampunks.mypinata.cloud/",
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // eslint-disable-next-line no-param-reassign
        config.ignoreWarnings = [
            {
                message:
                    /(magic-sdk|@walletconnect\/web3-provider|@web3auth\/web3auth)/,
            },
        ];
        return config;
    },
};
