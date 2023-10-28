import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LeagueTable from './LeagueTable';

const League = ({ match }) => {
  const [league, setLeague] = useState(null);
  const [positions, setPositions] = useState([]);
  const leagueData = useParams();
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

        const response = await axios.get(`${baseUrl}/league/${leagueData.name}`, {
          headers: headers
        });
        
        setLeague(response.data);

        const positionResponse = await axios.get(`${baseUrl}/league/table/${response.data.id}`, {
          headers: headers
        });
        setPositions(positionResponse.data.sort((a, b) => a.position - b.position));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [isAuthenticated, leagueData.name]);

  if (!league) {
    return <div>Loading...</div>;
  }

  return (
<div style={{ display: "flex" }}>
  <div>
    <h1>{league.name} ({league.sportName})</h1>
    <h2>Teams</h2>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {league.teams && league.teams.map((team, teamIndex) => (
        <li key={teamIndex} style={{ backgroundColor: teamIndex % 2 === 0 ? '#f2f2f2' : '#f9f9f9', padding: '10px', borderBottom: '1px solid #ccc' }}>
          <h3>{teamIndex + 1}. {team.name}</h3>
          <h4>Players</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {team.players && team.players.map((player, playerIndex) => (
              <li key={playerIndex} style={{ backgroundColor: playerIndex % 2 === 0 ? '#fff' : '#eee', padding: '5px', borderBottom: '1px solid #ddd' }}>
                {playerIndex + 1}. {player.name} {player.surname} - {player.age} years old
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
      </div>
        <LeagueTable isAuthenticated={isAuthenticated} token={token} baseUrl={baseUrl} leagueName={leagueData.name} />
    </div>
  );
};

export default League;
