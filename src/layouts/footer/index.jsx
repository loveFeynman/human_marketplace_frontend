// import clsx from "clsx";
import PropTypes from "prop-types";
import { ItemType } from "@utils/types";
import SocialWidget from "@widgets/social-widget";
import FooterLinkWidget from "@widgets/footer-link-widget";

const SocialData = [
    {
        id: 1,
        icon: "feather-facebook",
        link: "https://www.facebook.com/humansdotai",
        title: "Facebook",
    },
    {
        id: 2,
        icon: "feather-twitter",
        link: "https://twitter.com/humansdotai",
        title: "Twitter",
    },
    {
        id: 3,
        icon: "feather-instagram",
        link: "https://www.instagram.com/humansdotai/",
        title: "Instagram",
    },
    {
        id: 4,
        icon: "feather-linkedin",
        link: "https://www.linkedin.com/company/humansdotai/",
        title: "linkedin",
    },
];

const OtherData = [
    {
        id: 0,
        title: "Summary",
        link: "https://devnet-explorer.humans.zone/devnet",
    },
    {
        id: 1,
        title: "Blocks",
        link: "https://devnet-explorer.humans.zone/devnet/blocks",
    },
    {
        id: 2,
        title: "Staking",
        link: "https://devnet-explorer.humans.zone/devnet/staking",
    },
    {
        id: 3,
        title: "Governance",
        link: "https://devnet-explorer.humans.zone/devnet/governance",
    },
    {
        id: 4,
        title: "Uptime",
        link: "https://devnet-explorer.humans.zone/devnet/uptime",
    },
];
const footerData = {
    "footer-link-widget": {
        menu: [
            {
                id: 1,
                text: "Terms",
                path: "/terms-of-use",
            },
            {
                id: 2,
                text: "Privacy Policy",
                path: "/privacy-policy",
            },
        ],
    },
    copyright_text: "Copyright © 2022 Humans Token AG. All rights reserved.",
};
const Footer = () => (
    // { space, className, data }
    <div className="copy-right-one ptb--20 bg-color--1 mt--20">
        {/* <div className="plr--20"> */}
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-8 col-md-12 col-sm-12">
                    <div className="copyright-left">
                        <span>{footerData.copyright_text}</span>
                        <FooterLinkWidget
                            data={footerData["footer-link-widget"]}
                        />
                    </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                    <div className="copyright-right">
                        <SocialWidget socials={SocialData} others={OtherData} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

Footer.propTypes = {
    // space: PropTypes.oneOf([1, 2, 3]),
    // className: PropTypes.string,
    data: PropTypes.shape({
        items: PropTypes.arrayOf(ItemType),
    }),
};

// Footer.defaultProps = {
//     space: 1,
// };

export default Footer;
