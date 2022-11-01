/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Range } from "react-range";
import PropTypes from "prop-types";
import Button from "@ui/button";
import SliderTrack from "./slider-track";
import SliderThumb from "./slider-thumb";

const STEP = 1;
const MIN = 0;
const MAX = 100;

const InputRange = ({ values, onChange, hideButton, max }) => {
    const renderTrack = (props) => (
        <SliderTrack {...props} min={MIN} max={MAX} values={values} />
    );

    const priceRange = useMemo(
        () => [
            ((max || 1) * (values[0] || 0)) / 100,
            ((max || 1) * (values[1] || 100)) / 100,
        ],
        [values, max]
    );
    return (
        <div className="input-range">
            <Range
                step={STEP}
                min={MIN}
                max={MAX}
                values={values}
                onChange={(vals) => onChange(vals)}
                renderTrack={renderTrack}
                renderThumb={SliderThumb}
            />
            <div className="slider__range--output">
                <div className="price__output--wrap">
                    <div className="price--output">
                        <span>Price :</span>
                        <span className="output-label">
                            {priceRange[0]} $Heart - {priceRange[1]} $Heart
                        </span>
                    </div>
                    {hideButton === false && (
                        <div className="price--filter">
                            <Button size="small" path="#!">
                                Filter
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

InputRange.propTypes = {
    values: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    hideButton: PropTypes.bool,
    max: PropTypes.number,
};

InputRange.defaultProps = {
    hideButton: false,
};

export default InputRange;
