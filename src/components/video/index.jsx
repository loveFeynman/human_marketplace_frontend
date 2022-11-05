/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";

const Video = (props) => {
    const { fit, size } = props;
    const [determinedSize, setDeterminedSize] = useState(false);
    const [style, setStyle] = useState({});
    const element = useRef(null);

    // useEffect(() => {
    //   if (fit) {
    //     handleResizeDocument();
    //     window.addEventListener("resize", handleResizeDocument);
    //   }
    //   return () => window.removeEventListener("resize", handleResizeDocument)
    // }, [])

    // const handleResizeDocument = () => {
    //   const crrWidth = element?.current?.clientWidth || 0;
    //   const crrHeight = element?.current?.clientHeight || 0;
    //   if (crrWidth && crrHeight) {

    //   }
    // }
    useEffect(() => {
        let result = {};
        setDeterminedSize(true);
        const videoWidth = element?.current?.offsetParent?.offsetWidth || 0;
        // const videoHeight = element?.current?.offsetParent?.offsetHeight || 0;
        if (fit && videoWidth) {
            result = {
                width: videoWidth,
                height: videoWidth,
                // marginLeft:
                //     videoHeight > videoWidth
                //         ? (videoHeight - videoWidth) / 2
                //         : 0,
            };
        }
        if (size) {
            result = {
                width: size.width,
                height: size.height,
            };
        }
        setStyle(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [element?.current, size]);
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return (
        <video
            style={{
                ...style,
                visibility: determinedSize ? "visible" : "hidden",
            }}
            ref={element}
            {...props}
        />
    );
};

Video.propTypes = {
    fit: PropTypes.bool,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }),
};

const areEqual = (prevProps, nextProps) => prevProps.src !== nextProps.src;

export default memo(Video, areEqual);
