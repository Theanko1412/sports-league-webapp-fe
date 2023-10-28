import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from './AuthContext';


const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [open, setOpen] = useState(false);
   const [openDelete, setOpenDelete] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [allSports, setAllSports] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const { isAuthenticated, accessToken, isLoading, user } = useAuth();


  const [currentLeague, setCurrentLeague] = useState({});
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
    if (isAuthenticated) {
      if (currentLeague.sportName) {
        setFilteredTeams(allTeams.filter(team => team.sportName === currentLeague.sportName && team.leagueId === null));
      } else {
        setFilteredTeams(allTeams);
      }
    }
  }, [currentLeague.sportName, allTeams]);
  
  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${baseUrl}/sport`, {
        headers: headers
      }).then(response => {
        setAllSports(response.data);
      });
    }
}, []);
   
   useEffect(() => {
     axios.get(`${baseUrl}/team`, {
        headers: headers
    }).then(response => {
        setAllTeams(response.data);
      });
  }, []);
   
  useEffect(() => {
    axios.get(`${baseUrl}/league`, {
      headers: headers
    }).then(response => {
      setLeagues(response.data);
    });    
  }, []);

  const openDialog = (league = {}) => {
    setCurrentLeague(league);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const openDeleteDialog = (league) => {
    setCurrentLeague(league);
    setOpenDelete(true);
  };

  const closeDeleteDialog = () => {
    setOpenDelete(false);
  };

  const handleChange = (e) => {
    setCurrentLeague({ ...currentLeague, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const selectedTeams = currentLeague.teams?.map((teamId) => {
        const { id, name } = allTeams.find((team) => team.id === teamId);
        return { id, name };
      });
  
      const updatedLeague = { ...currentLeague, teams: selectedTeams };
  
      if (updatedLeague.id) {
        await axios.patch(`${baseUrl}/league/${updatedLeague.id}`, updatedLeague,
          {
            headers: headers
          }).then(response => {
            setLeagues(leagues.map((league) => league.id === updatedLeague.id ? updatedLeague : league));
          });
      } else {
        await axios.post(`${baseUrl}/league`, updatedLeague,
          {
            headers: headers
          }).then(response => {
            setLeagues([...leagues, response.data]);
          });
      }
      
      axios.get(`${baseUrl}/league`, {
        headers: headers
      }).then(response => {
        setLeagues(response.data);
      });
  
      closeDialog();
    } catch (error) {
      console.error("Error saving league: ", error);
    }
  };
  

  const handleDelete = () => {
    axios.delete(`${baseUrl}/league/${currentLeague.id}`, {
      headers: headers
    }).then(response => {
      setLeagues(leagues.filter((league) => league.id !== currentLeague.id));
    });
    closeDeleteDialog();
  };

  const handleTeamChange = (event) => {
    setCurrentLeague({
      ...currentLeague,
      teams: event.target.value,
    });
  };

  return (
    <div>
      <Table>
       <thead>
         <tr>
           <th style={{ textAlign: 'center' }}>Name</th>
                 <th style={{ textAlign: 'center' }}>Sport</th>
                 {isAuthenticated && (
                    <th style={{ textAlign: 'center' }}>Actions</th>
                 )}
         </tr>
       </thead>
       <tbody>
  {leagues.map((league) => (
    <tr key={league.id}>
      <td style={{ textAlign: 'center' }}>
        <Link to={`/league/${league.name}`}>
          <Button>{league.name}</Button>
        </Link>
      </td>
      <td style={{ textAlign: 'center' }}>{league.sportName}</td>
      <td style={{ textAlign: 'center' }}>
        {isAuthenticated && user.sub === league.admin && (
          <>
            <Button onClick={() => openDialog(league)}>Edit</Button>
            <Button onClick={() => openDeleteDialog(league)}>Delete</Button>
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
          Add New League
              </Button>
         ) }
      </div>
      
      <Dialog open={open} onClose={closeDialog}>
  <DialogTitle>{currentLeague.id ? 'Edit League' : 'New League'}</DialogTitle>
  <DialogContent>
  <TextField name="name" label="Name" value={currentLeague.name || ''} onChange={handleChange} fullWidth />

  <FormControl fullWidth>
    <InputLabel id="sport-label">Sport</InputLabel>
    <Select
      labelId="sport-label"
      name="sportName"
      value={currentLeague.sportName || ''}
      onChange={handleChange}
    >
      {allSports.map((sport, index) => (
        <MenuItem key={index} value={sport.name}>
          {sport.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl fullWidth>
  <InputLabel id="team-select-label">Teams</InputLabel>
  <Select
    labelId="team-select-label"
    id="team-select"
    multiple
    value={currentLeague.teams || []}
    onChange={handleTeamChange}
  >
    {filteredTeams.map((team, index) => (
      <MenuItem key={index} value={team.id}>
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

      <Dialog open={openDelete} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {currentLeague.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Leagues;
