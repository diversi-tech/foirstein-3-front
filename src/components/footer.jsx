import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import theme from '../theme';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Print';

const Footer = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        component="footer"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.secondary,
          padding: theme.spacing(4),
          marginTop: theme.spacing(8),
          fontFamily: 'Rubik',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* לוגו */}
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="../../../assets/pic/logo.png"
                  alt="Logo"
                  style={{ maxWidth: '100%', maxHeight: '80px' }}
                />
              </Box>
            </Grid>

            {/* כתובת */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                סמינר הליכות בית יעקב
              </Typography>
              <Typography variant="body1">
                רח' נתיבות המשפט 111
                <br />
                מודיעין עילית
              </Typography>
            </Grid>

            {/* קישורים מהירים */}
            <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="none"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row-reverse', // Icons on the left
                  marginBottom: theme.spacing(2), // Increased margin
                }}
              >
              
                דף הבית
              </Link>
              <Link
                component={RouterLink}
                to="/login"
                color="inherit"
                underline="none"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row-reverse', // Icons on the left
                  marginBottom: theme.spacing(2), // Increased margin
                }}
              >
              
                התחברות
              </Link>
              <Link
                component={RouterLink}
                to="/search"
                color="inherit"
                underline="none"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row-reverse', // Icons on the left
                  marginBottom: theme.spacing(2), // Increased margin
                }}
              >
               
                חיפוש
              </Link>
            </Grid>

            {/* מייל, פקס וטלפון */}
            <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>

              <Typography variant="body1">
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: theme.spacing(2), flexDirection: 'row-reverse' }}>
                  <EmailIcon sx={{ marginLeft: theme.spacing(1) }} />
                  <Link href="mailto:cc@hby.org.il" color="inherit" underline="none">
                    cc@hby.org.il
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: theme.spacing(2), flexDirection: 'row-reverse' }}>
                  <PhoneIcon sx={{ marginLeft: theme.spacing(1) }} />
                  <Typography sx={{ marginLeft: theme.spacing(1) }}>
                    טלפון: 08-9147130
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}>
                  <FaxIcon sx={{ marginLeft: theme.spacing(1) }} />
                  <Typography sx={{ marginLeft: theme.spacing(1) }}>
                    פקס: 08-9147103
                  </Typography>
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
