import { IconButton, InputAdornment, SxProps, TextField, Theme } from "@mui/material";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { Search } from "@mui/icons-material";

interface Props {
    setSearchTerm: Dispatch<SetStateAction<string>>,
    sx?: SxProps<Theme>;
    onBlur?: () => void,
    onFocus?: () => void,
}

const GlobalSearchBox = memo(({ setSearchTerm, sx, onBlur, onFocus }: Props) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(localSearchTerm, 450);

    useEffect(() => {
        setSearchTerm(debouncedSearchTerm ?? '');
    }, [debouncedSearchTerm, setSearchTerm]);

    return (
        <TextField
            sx={{
                width: '380px', ...sx,
                '& .MuiOutlinedInput-root': {
                    borderRadius: '48px',
                    paddingLeft: '8px',
                    backgroundColor: '#202029'
                }
            }}
            placeholder="Search"
            variant="outlined"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton>
                            <Search />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
});

export default GlobalSearchBox