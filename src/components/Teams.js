import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Button, Table, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from './AuthContext';

const Teams = () => {
   const [teams, setTeams] = useState([]);
   const [open, setOpen] = useState(false);
   const [openDelete, setOpenDelete] = useState(false);
   const [currentTeam, setCurrentTeam] = useState({});
   const [leagues, setLeagues] = useState([]);
   const [sports, setSports] = useState([]);
   const [players, setPlayers] = useState([]);
   

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
      if (isAuthenticated) {
        axios.get(`${baseUrl}/league`, {
          headers: headers
        }).then(response => {
          setLeagues(response.data);
        });
      }
   }, []);
   
   useEffect(() => {
      if (isAuthenticated) {
        axios.get(`${baseUrl}/sport`, {
          headers: headers
        }).then(response => {
          setSports(response.data);
        });
      }
   }, []);
   
   useEffect(() => {
      if (isAuthenticated) {
        axios.get(`${baseUrl}/player`, {
          headers: headers
        }).then(response => {
          setPlayers(response.data);
        });
      }
  }, []);
   
   
  useEffect(() => {
   axios.get(`${baseUrl}/team`, {
     headers: headers
   }).then(response => {
     setTeams(response.data);
   });    
  }, []);
   
  const openDialog = (team = {}) => {
   setCurrentTeam(team);
   setOpen(true);
 };

 const closeDialog = () => {
   setOpen(false);
 };

   const openDeleteDialog = (team) => {
   setCurrentTeam(team);
   setOpenDelete(true);
 };
 

 const closeDeleteDialog = () => {
   setOpenDelete(false);
   };
   
   const handleDelete = () => {
      axios.delete(`${baseUrl}/team/${currentTeam.id}`, {
        headers: headers
      }).then(response => {
        setTeams(teams.filter((team) => team.id !== currentTeam.id));
      });
      closeDeleteDialog();
    };

   const handleSave = () => {
      if (currentTeam.id) {
        axios.patch(`${baseUrl}/team/${currentTeam.id}`, currentTeam, {
          headers: headers
        }).then(response => {
          setTeams(teams.map((team) => team.id === currentTeam.id ? currentTeam : team));
        });
      } else {
        axios.post(`${baseUrl}/team`, currentTeam, {
          headers: headers
        }).then(response => {
          setTeams([...teams, response.data]);
        });
      }
      closeDialog();
   }
   
   const handleChange = (e) => {
      const { name, value } = e.target;
      let newTeam = { ...currentTeam, [name]: value };
    
      if (name === 'sportName') {
        newTeam.leagueName = '';
      }
      
      setCurrentTeam(newTeam);
    };
    
    const filteredLeagues = leagues.filter(league => league.sportName === currentTeam.sportName);
    
   
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
            {teams.map((team) => (
              <tr key={team.id}>
      <td style={{ textAlign: 'center' }}>
                  <Link to={`/team/${team.name}`}>
                    <Button>{team.name}</Button>
                  </Link>
                </td>
                <td style={{ textAlign: 'center' }}>{team.sportName}</td>
      <td style={{ textAlign: 'center' }}>
                  {isAuthenticated && user.sub === team.admin && (
                    <>
                      <Button onClick={() => openDialog(team)}>Edit</Button>
                      <Button onClick={() => openDeleteDialog(team)}>Delete</Button>
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
  Add New Team
</Button>

         ) }
          </div>
          
<Dialog open={open} onClose={closeDialog}>
  <DialogTitle>{currentTeam.id ? 'Edit Team' : 'New Team'}</DialogTitle>
  <DialogContent>
    <TextField 
      name="name" 
      label="Name" 
      value={currentTeam.name || ''} 
      onChange={handleChange} 
      fullWidth 
    />

    <FormControl fullWidth>
      <InputLabel id="sport-label">Sport</InputLabel>
      <Select
        labelId="sport-label"
        name="sportName"
        value={currentTeam.sportName || ''}
        onChange={handleChange}
      >
        {sports.map((sport, index) => (
          <MenuItem key={index} value={sport.name}>
            {sport.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth>
  <InputLabel id="league-label">League</InputLabel>
  <Select
    labelId="league-label"
    name="leagueName"
    value={currentTeam.leagueName || ''}
    onChange={handleChange}
  >
    {filteredLeagues.map((league, index) => (
      <MenuItem key={index} value={league.name}>
        {league.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeDialog} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSave} color="primary">
      Save
    </Button>
  </DialogActions>
          </Dialog>
          
      <Dialog open={openDelete} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {currentTeam.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      </div>
    );
};

export default Teams;
