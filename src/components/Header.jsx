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
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import RoofingOutlinedIcon from '@mui/icons-material/RoofingOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
function Header() {
  
  const baseUrl = "https://localhost:7297/api/";
  const [count, setCount] = React.useState(0)
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
    React.useEffect(() => {
      const fetchRequest = async () => {
        try {
          const res = await fetch(baseUrl + `BorrowRequest`);
          let data = await res.json();
          const rows = extractRawData(data);
          console.log("count: "+rows.length)
          setCount(rows.length)
          console.log(rows, "useEffect");
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
      fetchRequest();
    }, []);
    function extractRawData(proxyObject) {
      if (proxyObject && proxyObject.data) {
        console.log("Extracting data from proxy object:", proxyObject.data);
        return proxyObject.data;
      } else {
        console.log("Returning original object as it's not a proxy:", proxyObject);
        return proxyObject;
      }
    }

  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
  };
  const handleNavigateToAnotherPage = () => {
    navigate('/another-page');
  };


  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', height: '15%' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <MarkEmailUnreadOutlinedIcon  sx={{ color: 'black' ,margin:4 }}  onClick={handleNavigateToAnotherPage}/> */}
          <Tooltip title="בקשות שמחכות לאישור" arrow>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={() => { navigate('/studentRequest') }}>
            <Badge badgeContent={count} color="error">
              <MailIcon sx={{ color: 'GrayText' }} />
            </Badge>
          </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
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
              {"אודות"}
              <StickyNote2OutlinedIcon style={{ height: '1.3em', marginLeft: '5px' }}/>
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
               {"בית"}
              <RoofingOutlinedIcon style={{ height: '1.3em', marginLeft: '5px' }}/>          
            </Typography>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
