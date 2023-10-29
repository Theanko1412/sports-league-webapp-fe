import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Leagues from './components/Leagues';
import League from './components/League';
import Team from './components/Team';
import Teams from './components/Teams';
import { AuthProvider } from './components/AuthContext';
import { useAuth } from './components/AuthContext';
import Sports from './components/Sports';
import Sport from './components/Sport';
import Schedules from './components/Schedules';
import Players from './components/Players';

const providerConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENTID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirectUri: window.location.origin,
  useRefreshTokens: true,
  cacheLocation: "localstorage"
};

function App() {

  const PrivateWrapper = ({ children, ...rest }) => {
    const { isAuthenticated, accessToken, isLoading } = useAuth();
  
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!isAuthenticated) {
      return <div>Redirecting...</div>;
    }
  
    return React.cloneElement(children, { ...rest });
  };
  
  return (
    <Router>
      <div>
        <Header />
      </div>
      <div style={{ paddingBottom: '80px' }}>
        <Routes>
          <Route path="/" element={<Leagues />} />
          <Route path="/league" element={<Leagues />} />
          <Route path="/league/:name" element={<League />} />
          <Route path="/team" element={<Teams />} />
          <Route path="/team/:name" element={<Team />} />
          <Route path="/sport" element={<Sports />} />
          <Route path="/sport/:name" element={<Sport />} />
          <Route path="/schedule" element={<Schedules />} />
          <Route path="/player" element={<Players />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
  
}

export default () => (
  <Auth0Provider {...providerConfig}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Auth0Provider>
);
