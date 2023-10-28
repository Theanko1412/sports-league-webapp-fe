import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from './AuthContext';


const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [sports, setSports] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const { isAuthenticated, accessToken, isLoading, user } = useAuth();
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const storedData = JSON.parse(localStorage.getItem(`@@auth0spajs@@::${process.env.REACT_APP_AUTH0_CLIENTID}::${process.env.REACT_APP_AUTH0_AUDIENCE}::openid profile email offline_access`));
 const token = storedData?.body?.access_token;
  const headers = {
     'Content-Type': 'application/json'
  };

  if (isAuthenticated) {
     headers['Authorization'] = `Bearer ${token}`;
   }
   
   useEffect(() => {
      if (currentPlayer.leagueId) {
        const selectedLeague = leagues.find(league => league.id === currentPlayer.leagueId);
        setCurrentPlayer({ ...currentPlayer, sportId: selectedLeague?.sportId });
      }
    }, [currentPlayer.leagueId, leagues]);
  
    useEffect(() => {
      if (currentPlayer.teamId) {
        const selectedTeam = teams.find(team => team.id === currentPlayer.teamId);
        setCurrentPlayer({ ...currentPlayer, sportId: selectedTeam?.sportId, leagueId: selectedTeam?.leagueId });
      }
    }, [currentPlayer.teamId, teams]);

   useEffect(() => {
      if (isAuthenticated) {
         axios.get(`${baseUrl}/team`, { headers }).then(response => {
            setTeams(response.data);
            setFilteredTeams(response.data);
         });
         axios.get(`${baseUrl}/league`, { headers }).then(response => {
            setLeagues(response.data);
            setFilteredLeagues(response.data);
         });
         axios.get(`${baseUrl}/sport`, { headers }).then(response => setSports(response.data));
      }
    axios.get(`${baseUrl}/player`, { headers }).then(response => setPlayers(response.data));
  }, []);

  const openDialog = (player = {}) => {
    setCurrentPlayer(player);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };


  const handleSave = () => {
     axios.post(`${baseUrl}/player`, currentPlayer, {
       headers: headers
     }).then(response => {
       setPlayers([...players, response.data]);
     });
   closeDialog();
 };
 
   
   const handleChange = (e) => {
      const { name, value } = e.target;
      const updatedPlayer = { ...currentPlayer, [name]: value };
      setCurrentPlayer(updatedPlayer);
    
      if (name === 'sportId') {
        if (value) {
          setFilteredLeagues(leagues.filter(league => league.sportId === value));
          setFilteredTeams(teams.filter(team => team.sportId === value));
        } else {
          setFilteredLeagues(leagues);
          setFilteredTeams(teams);
        }
      }
    
      if (name === 'leagueId') {
        const selectedLeague = leagues.find(league => league.id === value);
        if (selectedLeague) {
          updatedPlayer.sportId = selectedLeague.sportId;
        }
      }
    
      if (name === 'teamId') {
        const selectedTeam = teams.find(team => team.id === value);
        if (selectedTeam) {
          updatedPlayer.sportId = selectedTeam.sportId;
          updatedPlayer.leagueId = selectedTeam.leagueId;
        }
      }
    };
    
    

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Name</th>
            <th style={{ textAlign: 'center' }}>Team</th>
                 <th style={{ textAlign: 'center' }}>Nationality</th>
                 {isAuthenticated && (
                    <th style={{ textAlign: 'center' }}>Actions</th>
                    )}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td style={{ textAlign: 'center' }}>{player.name} {player.surname}</td>
              <td style={{ textAlign: 'center' }}>{player.teamName}</td>
              <td style={{ textAlign: 'center' }}>{player.nationality}</td>
                <td style={{ textAlign: 'center' }}>
                   {isAuthenticated && user.sub === player.admin && (
                     <>
                <Button onClick={() => openDialog(player)}>Edit</Button>
                <Button> Delete</Button>
                </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
        { isAuthenticated && (
         <Button variant="contained" color="primary" onClick={() => openDialog()}>
  Add New Player
</Button>

         ) }
          </div>

      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{currentPlayer.id ? 'Edit Player' : 'New Player'}</DialogTitle>
        <DialogContent>
        <TextField 
  name="id" 
  label="ID" 
  value={currentPlayer.id || ''} 
  onChange={handleChange} 
  fullWidth 
/>
<TextField 
  name="name" 
  label="Name" 
  value={currentPlayer.name || ''} 
  onChange={handleChange} 
  fullWidth 
/>
<TextField 
  name="surname" 
  label="Surname" 
  value={currentPlayer.surname || ''} 
  onChange={handleChange} 
  fullWidth 
/>
<TextField 
  name="age" 
  label="Age" 
  type="number"
  value={currentPlayer.age || ''} 
  onChange={handleChange} 
  fullWidth 
/>
<TextField 
  name="height" 
  label="Height (cm)" 
  type="number"
  value={currentPlayer.height || ''} 
  onChange={handleChange} 
  fullWidth 
/>
<TextField 
  name="weight" 
  label="Weight (kg)" 
  type="number"
  value={currentPlayer.weight || ''} 
  onChange={handleChange} 
  fullWidth 
/>
<TextField 
  name="nationality" 
  label="Nationality" 
  value={currentPlayer.nationality || ''} 
  onChange={handleChange} 
  fullWidth 
/>

<FormControl fullWidth>
          <InputLabel id="sport-label">Sport</InputLabel>
          <Select name="sportId" value={currentPlayer.sportId || ''} onChange={handleChange}>
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
              
        <FormControl fullWidth>
          <InputLabel id="league-label">League</InputLabel>
          <Select name="leagueId" value={currentPlayer.leagueId || ''} onChange={handleChange}>
            {filteredLeagues.map((league) => (
              <MenuItem key={league.id} value={league.id}>
                {league.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl fullWidth>
          <InputLabel id="team-label">Team</InputLabel>
          <Select name="teamId" value={currentPlayer.teamId || ''} onChange={handleChange}>
            {filteredTeams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlayerManagement;
