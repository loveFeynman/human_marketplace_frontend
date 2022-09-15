import PropTypes from "prop-types";
import clsx from "clsx";

const Sticky = ({ children, className, top, style }) => (
    <div className={clsx("widge-wrapper", className)} style={{ ...style, top }}>
        {children}
    </div>
);

Sticky.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    top: PropTypes.string,
    style: PropTypes.shape({}),
};

Sticky.defaultProps = {
    top: "100px",
};

export default Sticky;
