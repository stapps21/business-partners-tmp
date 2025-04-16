import useLocalStorage from "./useLocalStorage";

type ToggleFunction = (value?: boolean) => void;

const useToggle = (key: string, initValue: boolean): [boolean, ToggleFunction] => {
    const [value, setValue] = useLocalStorage<boolean>(key, initValue);

    const toggle: ToggleFunction = (value?: boolean) => {
        setValue((prev: boolean) => {
            return typeof value === "boolean" ? value : !prev;
        });
    };

    return [value, toggle];
};

export default useToggle;
