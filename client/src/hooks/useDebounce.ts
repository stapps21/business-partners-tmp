import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay: number): T | undefined => {
    // State for the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>();

    useEffect(() => {
        // Set up a timeout to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if the value changes (also on component unmount)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
