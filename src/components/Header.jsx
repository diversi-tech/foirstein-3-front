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
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Tooltip from '@mui/material/Tooltip';
import { toJS } from 'mobx'
import requestStore from '../store/studentsRequest-store';
import itemStore from '../store/item-store';
import { observer } from 'mobx-react-lite'; 

const Header = observer(() => {;
  const [requestsCount, setRequestsCount] = React.useState(0);
  const [itemsCount,setItemsCount]=React.useState(0)

 React.useEffect(()=>{
  try{
    const countRequests=toJS(requestStore.getRequest).length
    setRequestsCount(countRequests)
    const countItems=toJS(itemStore.getPendingList).length
   setItemsCount(countItems)
  }
 catch(error)
 {
  console.error("Failed to fetch data:", error);
 }
 },[requestStore.getRequest, itemStore.getPendingList])

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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Tooltip title="בקשות שמחכות לאישור" arrow>
                <IconButton size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={() => navigate('/studentRequest')}>
                  <Badge badgeContent={requestsCount} color="primary">
                    <MailIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title="פריטים שמחכים לאישור" arrow>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={() => navigate('/itemsPendingApproval')}
                >
                  <Badge badgeContent={itemsCount} color="warning">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',marginTop:'1%'}}>
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
              <StickyNote2OutlinedIcon style={{ height: '1em', verticalAlign: 'middle', ml: '5px' }} />
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
              <RoofingOutlinedIcon style={{ height: '1em', verticalAlign: 'middle', ml: '5px' }} />
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;