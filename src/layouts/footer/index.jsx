import clsx from "clsx";
import PropTypes from "prop-types";
import { ItemType } from "@utils/types";
import SocialWidget from "@widgets/social-widget";

const SocialData = [
    {
        id: 1,
        icon: "feather-facebook",
        link: "https://facebook.com",
        title: "Facebook",
    },
    {
        id: 2,
        icon: "feather-twitter",
        link: "https://twitter.com",
        title: "Twitter",
    },
    {
        id: 3,
        icon: "feather-instagram",
        link: "https://instagram.com",
        title: "Instagram",
    },
    {
        id: 4,
        icon: "feather-linkedin",
        link: "https://linkedin.com",
        title: "linkedin",
    },
    {
        id: 5,
        icon: "feather-mail",
        link: "https://mail.com",
        title: "mail",
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

const Footer = () => (
    // { space, className, data }

    <div className="copy-right-one ptb--20 bg-color--1 mt--20">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="copyright-left">
                        <svg
                            width="347"
                            height="32"
                            viewBox="0 0 347 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.23407 4H0V28C1.40913 27.7914 2.82049 27.5897 4.23407 27.3949V19.6177C4.23407 17.038 5.96935 14.9115 8.46814 14.9115C10.724 14.9115 12.3552 16.2362 12.3552 19.3737V26.3548C13.7644 26.188 15.1758 26.028 16.5892 25.8748V19.3388C16.5892 14.284 14.4375 10.9722 9.57872 10.9722C7.63521 10.9722 5.76111 11.5648 4.23407 13.5519V4ZM44.2756 23.7757C42.8624 23.8372 41.451 23.9057 40.0415 23.9809V11.1814H43.9632L44.2756 13.273C45.1779 11.53 47.1561 10.9025 48.7873 10.9025C50.8349 10.9025 52.8825 11.7392 53.8543 14.1097C55.3813 11.6694 57.3595 10.9722 59.5807 10.9722C64.4395 10.9722 66.8341 13.9703 66.8341 19.1297V23.378C65.6381 23.3681 64.4408 23.3632 63.2424 23.3632C63.0283 23.3632 62.8141 23.3634 62.6001 23.3637V19.1297C62.6001 16.8637 61.663 14.9464 59.3724 14.9464C57.0819 14.9464 55.659 16.9335 55.659 19.1994V23.429C54.2459 23.4535 52.8345 23.4849 51.4249 23.5231V19.1994C51.4249 16.9335 50.2449 14.8767 47.9196 14.8767C45.6291 14.8767 44.2756 16.9335 44.2756 19.1994V23.7757ZM88.486 24.0948V11.2162H84.4255L84.2866 13.5868C83.3149 11.8786 81.1284 10.7979 78.8379 10.7979C73.8403 10.763 69.9186 13.8656 69.9186 19.792C69.9186 21.1501 70.1086 22.3614 70.461 23.4228C72.1544 23.4508 73.8453 23.4886 75.5338 23.5362C74.6765 22.6426 74.1527 21.3711 74.1527 19.792C74.1527 16.5151 76.4085 14.5977 79.2197 14.5977C84.4563 14.5977 85.5776 21.0353 82.5835 23.7921C84.5545 23.8797 86.522 23.9806 88.486 24.0948ZM95.8739 24.5877C94.476 24.4824 93.0762 24.3838 91.6746 24.2919V11.1813H95.4575L95.7351 13.517C97.4704 11.8088 99.2057 10.9373 101.357 10.9373C105.383 10.9373 108.611 13.9702 108.611 19.3737V25.7376C107.202 25.5892 105.79 25.4477 104.377 25.313V19.4085C104.377 16.794 102.954 14.8069 100.247 14.8069C97.6439 14.8069 95.8739 17.0031 95.8739 19.6177V24.5877ZM124.024 27.6431C119.741 27.0346 115.437 26.4894 111.114 26.0086C111.088 25.9818 111.062 25.9548 111.036 25.9276L113.118 22.8946C114.333 24.2542 117.109 25.2652 119.018 25.3001C120.615 25.3349 122.107 24.4983 122.107 23.2433C122.107 22.058 121.135 21.5699 118.706 21.4305C115.478 21.1865 111.626 20.0012 111.626 16.0967C111.626 12.1226 115.721 10.7282 118.845 10.7282C121.517 10.7282 123.53 11.2511 125.508 12.9941L123.148 15.783C121.933 14.6326 120.545 14.2491 118.914 14.2491C116.901 14.2491 115.791 14.8766 115.791 15.9573C115.791 17.0729 116.797 17.7004 118.983 17.8398C122.211 18.049 126.306 18.781 126.306 23.3478C126.306 25.0351 125.544 26.593 124.024 27.6431ZM36.5753 24.1799C34.69 24.2957 32.808 24.4237 30.9294 24.5638C31.842 23.6748 32.3759 22.365 32.3759 20.929V11.2162H36.5753V24.1799ZM25.5422 24.9996C23.8413 25.148 22.1432 25.3063 20.4481 25.4744C19.9274 24.2737 19.639 22.8312 19.639 21.173V11.2162H23.873V21.1382C23.873 22.7901 24.4411 24.1916 25.5422 24.9996Z"
                                fill="black"
                            />
                        </svg>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
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
