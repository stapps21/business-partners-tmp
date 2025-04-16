import { useEffect, useState } from "react";

type SetStateAction<S> = S | ((prevState: S) => S);

const getLocalValue = <T>(key: string, initValue: T | (() => T)): T => {
    // SSR Next.js
    if (typeof window === "undefined") return initValue instanceof Function ? initValue() : initValue;

    // If a value is already stored
    const localValue = JSON.parse(localStorage.getItem(key) || "null");
    if (localValue) return localValue;

    // Return result of a function
    if (initValue instanceof Function) return initValue();

    return initValue;
};

const useLocalStorage = <T>(key: string, initValue: T | (() => T)): [T, (value: SetStateAction<T>) => void] => {
    const [value, setValue] = useState<T>(() => {
        return getLocalValue<T>(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
