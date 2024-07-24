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
          textAlign: 'right',
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
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
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                מרחבית - מרחב התוכן של בית יעקב
              </Typography>
              <Typography variant="body1">
                <IconButton color="inherit">
                  <EmailIcon />
                </IconButton>
                cc@hby.org.il
                <br />
                <IconButton color="inherit">
                  <PhoneIcon />
                </IconButton>
                טלפון: 08-9147130
                <br />
                <IconButton color="inherit">
                  <FaxIcon />
                </IconButton>
                פקס: 08-9147103
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                קישורים מהירים
              </Typography>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="none"
                sx={{ display: 'block', marginBottom: theme.spacing(1), display: 'flex', alignItems: 'center' }}
              >
                <HomeIcon sx={{ marginRight: theme.spacing(1) }} />
                דף הבית
              </Link>
              <Link
                component={RouterLink}
                to="/login"
                color="inherit"
                underline="none"
                sx={{ display: 'block', marginBottom: theme.spacing(1), display: 'flex', alignItems: 'center' }}
              >
                <LoginIcon sx={{ marginRight: theme.spacing(1) }} />
                התחברות
              </Link>
              <Link
                component={RouterLink}
                to="/search"
                color="inherit"
                underline="none"
                sx={{ display: 'block', marginBottom: theme.spacing(1), display: 'flex', alignItems: 'center' }}
              >
                <SearchIcon sx={{ marginRight: theme.spacing(1) }} />
                חיפוש
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center" fontSize={18} sx={{ color: '#FFD700' }}>
                מרחבית - מרחב התוכן של בית יעקב
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
