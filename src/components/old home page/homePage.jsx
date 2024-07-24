import React, { useState } from 'react';
import books from '../assets/books.png';
// import books1 from '../assets/books1.jpg';
// import books2 from '../assets/books2.jpg';
import { Button, Menu, MenuItem, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'; // Import the Carousel component
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
    navigate(`${route}`);
    setAnchorElBorrowRequest(null);
  }

  const handleClickItemsRequests = (route) => {
    navigate(`${route}`);
    setAnchorElItemRequest(null);
  }

  const carouselImages = [
    { url: books, caption: 'ספרים' },
    { url: books, caption: 'ספרים 1' },
    { url: books, caption: 'ספרים 2' },
  ];

  return (
    <div style={{ marginTop: '7%', textAlign: 'center' }}>
      <Carousel
        autoPlay={true}
        animation="slide"
        navButtonsAlwaysVisible={true}
        indicators={false}
        timeout={500} // Adjust timeout as needed
        swipe={true} // Enable swiping on mobile devices
      >
        {carouselImages.map((image, index) => (
          <Paper key={index}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              style={{ position: 'relative', width: '100%', height: 'auto' }}
            >
              <Typography
                variant="h3"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  width:'70%',
                  padding: '20px',
                  borderRadius: '15px',
                }}
              >
                {"ברוכות הבאות לאזור האישי של צוות הספרניות"}
              </Typography>
              <Typography
                variant="h5"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  marginTop: '6%',
                }}
              >
                {".כאן תוכלי לנהל את פעילותך באחריות וביעילות"}
                <br />
                {"!תודה על תרומתך לספריה שלנו"}
              </Typography>
              <img src={image.url} alt={image.caption} style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Paper>
        ))}
      </Carousel>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mt={2}
        mb={2}
      >
        <Typography variant="h6" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
          בחרי את הניתוב שלך
          <FaHandPointDown sx={{ ml: 1 }} style={{ marginLeft: '8px' }} />
        </Typography>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          width="100%"
          mt={4}
          mb={2}
        >
          <div onMouseLeave={handleMouseLeaveBorrowRequest}>
            <Button
              onMouseEnter={handleMouseEnterBorrowRequest}
              variant="contained"
              sx={{
                backgroundColor: peachPink,
                color: textColor,
                '&:hover': {
                  backgroundColor: '#FFC0CB'
                }
              }}
              onClick={() => handleClickBorrowRequests('/studentRequest')}>
              בקשות שממתינות לאישור
            </Button>
          </div>
          <Button
            variant="contained"
            sx={{
              backgroundColor: peachPink,
              color: textColor,
              '&:hover': {
                backgroundColor: '#FFC0CB'
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
                  backgroundColor: '#FFC0CB'
                }
              }}
            >
              ניהול פריטים
            </Button>
            <Menu
              anchorEl={anchorElItemRequest}
              open={Boolean(anchorElItemRequest)}
              onClose={handleMouseLeaveItemRequest}
              MenuListProps={{ onMouseLeave: handleMouseLeaveItemRequest }}
              autoFocus={false}
            >
              <div dir="rtl">
                <MenuItem onClick={() => handleClickItemsRequests('/items')}>
                  כל הפריטים
                </MenuItem>
                <MenuItem onClick={() => handleClickItemsRequests('/itemsPendingApproval')}>
                  פריטים שממתינים לאישור
                </MenuItem>
              </div>
            </Menu>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default ImageHomePage;
