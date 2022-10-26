import { memo } from "react";

const Video = (props) => (
  <video {...props} />
);

const areEqual = (prevProps, nextProps) => {
  return prevProps.src !== nextProps.src
}

export default memo(Video, areEqual);
