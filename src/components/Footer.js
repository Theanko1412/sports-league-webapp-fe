import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);
  const history = useNavigate();

  const handleLoginClick = () => {
    if (isAuthenticated && isHovered) {
      logout({ returnTo: window.location.origin });
    } else if (!isAuthenticated) {
      loginWithRedirect();
    }
  };

  const buttonLabel = () => {
    if (isAuthenticated) {
      return isHovered ? 'Logout' : user.nickname;
    }
    return 'Login';
  };

  const navigateToHome = () => {
    history('/');
  };

  return (
    <AppBar position="fixed" style={{ top: 'auto', bottom: 0}}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={navigateToHome}>
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Sports-League-Webapp
        </Typography>
        <Button 
          color="inherit"
          onClick={handleLoginClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width: '200px', textAlign: 'center' }}
        >
          {buttonLabel()}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
