import useLocalStorage from "./useLocalStorage";

const useInput = (key: string, initValue: string): [string, (() => void), { onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; value: string }] => {
    const [value, setValue] = useLocalStorage(key, initValue);

    const reset = () => setValue(initValue);

    const attributeObj = {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const target = e.target as HTMLTextAreaElement;
            setValue(target.value);
        }
    }

    return [value, reset, attributeObj];
}

export default useInput