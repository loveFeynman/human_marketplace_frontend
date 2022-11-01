import { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useClickAway } from "react-use";

const NiceSelect = ({
    options,
    defaultCurrent,
    placeholder,
    className,
    onChange,
    name,
}) => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(options[defaultCurrent]);
    useEffect(() => {
        options.forEach((_option, index) => {
            if (_option.value === defaultCurrent) {
                setCurrent(options[index]);
            }
        });
    }, [defaultCurrent, options]);
    const onClose = useCallback(() => {
        setOpen(false);
    }, []);
    const ref = useRef(null);

    useClickAway(ref, onClose);

    const currentHandler = (item, e) => {
        setCurrent(item);
        onChange(item, name, e);
        onClose();
    };

    return (
        <div
            className={clsx("nice-select", className, open && "open")}
            role="button"
            tabIndex={0}
            onClick={() => setOpen((prev) => !prev)}
            onKeyPress={(e) => e}
            ref={ref}
        >
            <span className="current">{current?.text || placeholder}</span>
            <ul
                className="list"
                role="menubar"
                onClick={(e) => e.stopPropagation()}
                onKeyPress={(e) => e.stopPropagation()}
            >
                {options?.map((item) => (
                    <li
                        key={item.value}
                        data-value={item.value}
                        className={clsx(
                            "option",
                            item.value === current?.value && "selected focus"
                        )}
                        role="menuitem"
                        onClick={(e) => currentHandler(item, e)}
                        onKeyPress={(e) => e}
                    >
                        {item.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};
NiceSelect.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            text: PropTypes.string,
        }).isRequired
    ).isRequired,
    defaultCurrent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
};

NiceSelect.displayName = "NiceSelect";

export default NiceSelect;
