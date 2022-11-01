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
export const useIsBrowserTabActive = () => {
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
    const [secondInterval, setSecondInterval] = useState(0);
    const isBrowserTabActiveRef = useIsBrowserTabActive();
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isBrowserTabActiveRef.current) {
                setValue((prev) => prev + 1);
            }
        }, REFRESH_INTERVAL);
        const fastInterval = setInterval(async () => {
            if (isBrowserTabActiveRef.current) {
                setSecondInterval((prev) => prev + 1);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
            clearInterval(fastInterval);
        };
    }, [isBrowserTabActiveRef]);

    const refreshAll = useCallback(() => {
        setValue((prev) => prev + 1);
    }, []);

    return (
        <RefreshContext.Provider
            value={useMemo(
                () => ({ second: secondInterval, value, refreshAll }),
                [value, refreshAll, secondInterval]
            )}
        >
            {children}
        </RefreshContext.Provider>
    );
};

RefreshContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { RefreshContext, RefreshContextProvider };
