// Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer() {
  

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // White-transparent background
        textAlign: 'center',
        padding: '10px 0',
      }}
    >
      {/* <Typography variant="body2" color="textSecondary" align="center">
      מרחבית - הספרייה הפדגוגית של בית יעקב <CopyrightIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />
      </Typography> */}
    </Box>
  );
}
