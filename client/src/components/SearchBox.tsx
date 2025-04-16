import { IconButton, InputAdornment, SxProps, TextField, Theme } from "@mui/material";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { Search } from "@mui/icons-material";

interface Props {
    setSearchTerm: Dispatch<SetStateAction<string>>,
    sx?: SxProps<Theme>;
}

const SearchBox = memo(({ setSearchTerm, sx }: Props) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(localSearchTerm, 450);

    useEffect(() => {
        setSearchTerm(debouncedSearchTerm ?? '');
    }, [debouncedSearchTerm, setSearchTerm]);

    return (
        <TextField
            sx={{ width: '380px', ...sx }}
            placeholder="Search"
            variant="outlined"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
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

export default SearchBox