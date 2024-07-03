import React, { useState } from 'react';
import books from '../assets/books.png'
import { Button, Menu, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Import the arrow icon
import Typography from '@mui/material/Typography';
import { FaHandPointDown } from "react-icons/fa";

const peachPink = '#FFD1DC';
const textColor = '#000000';

const ImageHomePage = () => { 

  const navigate = useNavigate();
  const [anchorElBorrowRequest, setAnchorElBorrowRequest] = useState(null);
  const [anchorElItemRequest, setAnchorElItemRequest] = useState(null);
  const handleMouseEnterBorrowRequest = (event) => {
    setAnchorElBorrowRequest(event.currentTarget);
  }

  const handleMouseLeaveBorrowRequest = () => {
    setAnchorElBorrowRequest(null);
  }
  const handleMouseEnterItemRequest = (event) => {
    setAnchorElItemRequest(event.currentTarget);
  }

  const handleMouseLeaveItemRequest = () => {
    setAnchorElItemRequest(null);
  }
  const handleClickBorrowRequests = (route) => {
    navigate(`${route}`)
    setAnchorElBorrowRequest(null);
  }
  const handleClickItemsRequests = (route) => {
    navigate(`${route}`)
    setAnchorElItemRequest(null);
  }
 
  return (
    <div style={{ marginTop: '7%' }}>
      <img
        src={books}
        alt="Local"
        style={{ width: '100%', height: 'auto' }}
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mt={2} // מרווח עליון
        mb={2} // מרווח תחתון
      >
        <Typography variant="h6" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
          בחרי את הניתוב שלך
          <FaHandPointDown sx={{ ml: 1 }} style={{ marginLeft: '8px' }} />
        </Typography>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          width="100%" // Adjust this width as necessary
          mt={4} // מרווח עליון
          mb={2} // מרווח תחתון
        >
          <div onMouseLeave={handleMouseLeaveBorrowRequest}>
            <Button
              onMouseEnter={handleMouseEnterBorrowRequest}
              variant="contained"
              sx={{
                backgroundColor: peachPink,
                color: textColor,
                '&:hover': {
                  backgroundColor: '#FFC0CB' // צבע ריחוף (ורוד בהיר)
                }
              }}
            >
              {"ניהול בקשות"}
            </Button>
            <Menu
              anchorEl={anchorElBorrowRequest}
              open={Boolean(anchorElBorrowRequest)}
              onClose={handleMouseLeaveBorrowRequest}
              MenuListProps={{ onMouseLeave: handleMouseLeaveBorrowRequest }}
              autoFocus={false}
            >
              <div dir="rtl">
                <MenuItem onClick={() => handleClickBorrowRequests('/studentRequest')}>{"בקשות שממתינות לאישור"}</MenuItem>
                <MenuItem onClick={() => handleClickBorrowRequests('/afterHandle')}>{"בקשות לאחר טיפול"}</MenuItem>
              </div>
            </Menu>
          </div>
          <Button
            variant="contained"
            sx={{
              backgroundColor: peachPink,
              color: textColor,
              '&:hover': {
                backgroundColor: '#FFC0CB' // צבע ריחוף (ורוד בהיר)
              }
            }}
            onClick={() => navigate('/tag-list')}>
            ניהול ועריכת תגיות
          </Button>
          <div onMouseLeave={handleMouseLeaveItemRequest}>
            <Button
              onMouseEnter={handleMouseEnterItemRequest}
              variant="contained"
              sx={{
                backgroundColor: peachPink,
                color: textColor,
                '&:hover': {
                  backgroundColor: '#FFC0CB' // צבע ריחוף (ורוד בהיר)
                }
              }}
            >
              {"ניהול פריטים"}
            </Button>
            <Menu
              anchorEl={anchorElItemRequest}
              open={Boolean(anchorElItemRequest)}
              onClose={handleMouseLeaveItemRequest}
              MenuListProps={{ onMouseLeave: handleMouseLeaveItemRequest }}
              autoFocus={false}
            >
              <div dir="rtl">
                <MenuItem onClick={() => handleClickItemsRequests('/items')}>{"כל הפריטים"}</MenuItem>
                <MenuItem onClick={() => handleClickItemsRequests('/itemsPendingApproval')}>{"פריטים שממתינים לאישור"}</MenuItem>
              </div>
            </Menu>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default ImageHomePage;
