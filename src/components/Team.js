import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LeagueTable from './LeagueTable';

const Team = () => {
  const [team, setTeam] = useState(null);
  const teamData = useParams();
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
  
        const response = await axios.get(`${baseUrl}/team/${teamData.name}`, {
          headers: headers
        });
  
        setTeam(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, [isAuthenticated, teamData.name]);

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex" }}>
<div>
  <h1>{team.name} - {team.sportName}</h1>
  <h2>League: {team.leagueName}</h2>
  <h3>Position: {team.position}</h3>
  <h3>Points: {team.points}</h3>
  <h2>Players</h2>
  <ul style={{ listStyleType: 'none', padding: 0, display: "flex" }}>
    {team.players && team.players.map((player, index) => (
      <li key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#f9f9f9', padding: '10px', borderBottom: '1px solid #ccc' }}>
        {index + 1}. {player.name} {player.surname} - {player.age} years old, {player.height} cm, {player.weight} kg, {player.nationality}
      </li>
    ))}
      </ul>
      </div>
      {team.leagueName && <LeagueTable isAuthenticated={isAuthenticated} token={token} baseUrl={baseUrl} leagueName={team.leagueName} />}
      </div>

  );
};

export default Team;
