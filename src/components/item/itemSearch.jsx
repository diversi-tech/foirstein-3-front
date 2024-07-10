import React from 'react';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
const ItemSearch = ({ onSearch }) => {
    const handleInputChange = (event) => {
        onSearch(event.target.value);
    };

    return (
        <TextField
            label={<SearchIcon/>}
            variant="outlined"
            onChange={handleInputChange}
        />
    );
};

export default ItemSearch;
