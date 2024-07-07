import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import { useNavigate } from 'react-router-dom';
// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
// import { IconButton } from '@mui/icons-material';



function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

   const handleNavigateToHome = () => {
    navigate('/');
   };
   const handleNavigateToAbout = () => {
    navigate('/about'); 
  };
  const handleNavigateToAnotherPage = () => {
    navigate('/another-page'); 
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white',height:'15%' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <MarkEmailUnreadOutlinedIcon  sx={{ color: 'black' ,margin:4 }}  onClick={handleNavigateToAnotherPage}/>
         
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={handleNavigateToAbout}
            sx={{
              mr: 8,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)', // צבע ריחוף של MenuItem
                borderRadius: '4px', // גבול עגול כמו ב-MenuItem
              },
            }}
          >
          אודות
          </Typography>
          {/* again */}
               <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={handleNavigateToHome}
            // href="#app-bar-with-responsive-menu"
            sx={{
              mr: 8,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)', // צבע ריחוף של MenuItem
                borderRadius: '4px', // גבול עגול כמו ב-MenuItem
              },
            }}
          >
            בית
          </Typography>
        
          {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
