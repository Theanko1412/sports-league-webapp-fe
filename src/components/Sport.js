import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Table, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useAuth } from './AuthContext';

const Sport = () => {
  const [sport, setSport] = useState(null);
  const sportData = useParams();
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const { isAuthenticated, accessToken, isLoading, user } = useAuth();
  const storedData = JSON.parse(localStorage.getItem(`@@auth0spajs@@::${process.env.REACT_APP_AUTH0_CLIENTID}::${process.env.REACT_APP_AUTH0_AUDIENCE}::openid profile email offline_access`));
  const token = storedData?.body?.access_token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let headers = {};
  
        if (isAuthenticated) {
          headers['Authorization'] = `Bearer ${token}`;
        }
  
        const response = await axios.get(`${baseUrl}/sport/${sportData.name}`, {
          headers: headers
        });
  
        setSport(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, [isAuthenticated, sportData.name]);

  if (!sport) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{sport.name}</h1>
      <h2>Leagues</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
  {sport.league.map((league, index) => (
    <li key={league.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#f9f9f9', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <strong>{index + 1}. League Name:</strong> {league.name}
    </li>
  ))}
</ul>
      <h2>Points</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
  <li style={{ backgroundColor: '#f2f2f2', padding: '10px', borderBottom: '1px solid #ccc' }}>
    <strong>Win Points:</strong> {sport.winPoints}
  </li>
  <li style={{ backgroundColor: '#f9f9f9', padding: '10px', borderBottom: '1px solid #ccc' }}>
    <strong>Draw Points:</strong> {sport.drawPoints}
  </li>
  <li style={{ backgroundColor: '#f2f2f2', padding: '10px' }}>
    <strong>Lose Points:</strong> {sport.losePoints}
  </li>
</ul>

    </div>
  );
};

export default Sport;
