import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeagueTable = ({ isAuthenticated, token, baseUrl, leagueName }) => {
  const [league, setLeague] = useState(null);
  const [positions, setPositions] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
      try {
        let headers = {};
        if (isAuthenticated) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(`${baseUrl}/league/${leagueName}`, {
          headers: headers,
        });

        setLeague(response.data);

        const positionResponse = await axios.get(`${baseUrl}/league/table/${response.data.id}`, {
          headers: headers,
        });
        setPositions(positionResponse.data.sort((a, b) => a.position - b.position));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [isAuthenticated, leagueName]);

  return (
     <div>
        <div style={{ margin: '100px' }}>
        <h2>Positions</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Position</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{pos.position}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{pos.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{pos.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    </div>
  );
};

export default LeagueTable;
