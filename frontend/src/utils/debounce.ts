import { useEffect } from "react";

// Run a callback after a value stops changing for `delay` ms.
export function useDebounceEffect(
    value: unknown,
    callback: () => void,
    delay = 300
) {
    useEffect(() => {
        const handler = setTimeout(() => {
            callback();
        }, delay);

        return () => clearTimeout(handler); // cancel previous timer
    }, [value, delay, callback]);
}
