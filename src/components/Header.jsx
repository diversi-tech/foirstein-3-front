
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import RoofingOutlinedIcon from '@mui/icons-material/RoofingOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { useNavigate } from 'react-router-dom';

function Header() {
  const baseUrl = "https://localhost:7297/api/";
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(baseUrl + `BorrowRequest`);
        const data = await res.json();
        const rows = extractRawData(data);
        setCount(rows.length);
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

  const handleNavigateToAbout = () => {
    navigate('/about');
  };

  return (

    <AppBar position="fixed" sx={{ backgroundImage: 'linear-gradient(to left, lightgrey, grey)', height: '15%' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={() => navigate('/studentRequest')}>
            <Badge badgeContent={count} color="error">
              <MailIcon sx={{ color: 'black' }} />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              variant="h6"
              noWrap
              onClick={handleNavigateToAbout}
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderRadius: '4px',
                },
                ml: 2, // מרחק משמאל
                mb: 1, // מרחק מלמטה
              }}
            >
              {"אודות"}
              <StickyNote2OutlinedIcon style={{ height: '1.3em', ml: '5px' }} />
            </Typography>
            <Typography
              variant="h6"
              noWrap
              onClick={handleNavigateToHome}
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderRadius: '4px',
                },
                ml: 2, // מרחק משמאל
                mb: 1, // מרחק מלמטה
              }}
            >
              {"בית"}
              <RoofingOutlinedIcon style={{ height: '1.3em', ml: '5px' }} />
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
