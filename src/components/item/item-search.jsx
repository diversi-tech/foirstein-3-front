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
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon sx={{ color: 'gray' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#FFFFFF', // צבע המסגרת
          },
          '&:hover fieldset': {
            borderColor: '#FFFFFF', // צבע המסגרת כאשר מרחפים
          },
          '&.Mui-focused fieldset': {
            borderColor: '#FFD700', // צבע המסגרת כאשר ממוקדים
          },
        },
        '& .MuiInputLabel-root': {
          color: '#FFFFFF', // צבע התווית
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#FFD700', // צבע התווית כאשר ממוקדים
        },
        '& .MuiInputBase-input': {
          color: '#dcdcdc', // צבע הכיתוב בתוך האינפוט
        }
      }}
    />
  );
};

export default ItemSearch;
