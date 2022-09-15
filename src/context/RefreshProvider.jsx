import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import PropTypes from "prop-types";

const REFRESH_INTERVAL = 1000 * 10;

const RefreshContext = React.createContext({
    value: 0,
    refreshAll: () => {},
});

// Check if the tab is active in the user browser
const useIsBrowserTabActive = () => {
    const isBrowserTabActiveRef = useRef(true);

    useEffect(() => {
        const onVisibilityChange = () => {
            isBrowserTabActiveRef.current = !document.hidden;
        };

        window.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    return isBrowserTabActiveRef;
};

const RefreshContextProvider = ({ children }) => {
    const [value, setValue] = useState(0);
    const isBrowserTabActiveRef = useIsBrowserTabActive();
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isBrowserTabActiveRef.current) {
                setValue((prev) => prev + 1);
            }
        }, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [isBrowserTabActiveRef]);

    const refreshAll = useCallback(() => {
        setValue((prev) => prev + 1);
    }, []);

    return (
        <RefreshContext.Provider
            value={useMemo(() => ({ value, refreshAll }), [value, refreshAll])}
        >
            {children}
        </RefreshContext.Provider>
    );
};

RefreshContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { RefreshContext, RefreshContextProvider };
