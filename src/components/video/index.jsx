
import PropTypes from "prop-types";
import { memo, useEffect, useMemo, useRef } from "react";

const Video = (props) => {
  const { fit } = props;
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

  const videoWidth = useMemo(() => element?.current?.offsetParent?.offsetWidth || 0, [element?.current]);
  const videoHeight = useMemo(() => element?.current?.offsetParent?.offsetHeight || 0, [element?.current]);

  return (
    <video 
      style={
        fit && videoWidth ? {
          width: videoWidth, 
          height: videoWidth, 
          marginLeft: videoHeight > videoWidth ? (videoHeight - videoWidth) / 2 : 0
        } : {}
      } 
      ref={element} 
      {...props} 
    />
  )
};

Video.propTypes = {
    fit: PropTypes.bool,
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.src !== nextProps.src
}

export default memo(Video, areEqual);
