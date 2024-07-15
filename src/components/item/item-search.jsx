import React, { useState } from "react";
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ItemSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <TextField
      label="חיפוש פריטים"
      variant="outlined"
      value={searchTerm}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        ),
    }}
    />
  );
};

export default ItemSearch;