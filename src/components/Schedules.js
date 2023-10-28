import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Table, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
   const [currentSchedule, setCurrentSchedule] = useState({});
  const [leagues, setLeagues] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
const [currentScores, setCurrentScores] = useState({home: '', away: ''});
   const [filteredLeagues, setFilteredLeagues] = useState([]);
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
           const scheduledLeagues = schedules.map(schedule => schedule.leagueName);
           const availableLeagues = response.data.filter(league => !scheduledLeagues.includes(league.name));
           setFilteredLeagues(availableLeagues);
        });
      }
   }, [schedules]);

  useEffect(() => {
    axios.get(`${baseUrl}/schedule`, {
      headers: headers,
    })
    .then(response => {
      setSchedules(response.data);
    });
  }, []);

  const openDialog = (schedule = {}) => {
    setCurrentSchedule(schedule);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const openDeleteDialog = (schedule) => {
    setCurrentSchedule(schedule);
    setOpenDelete(true);
  };

  const closeDeleteDialog = () => {
    setOpenDelete(false);
  };

  const openEditDialog = (match) => {
    setCurrentScores({ home: match.homeTeamScore, away: match.awayTeamScore });
    setCurrentSchedule(match);

    setOpenEdit(true);
  };
  
  const closeEditDialog = () => {
    setOpenEdit(false);
  };
  
  const handleScoreChange = (e, team) => {
    setCurrentScores({ ...currentScores, [team]: e.target.value });
  };
  

  const handleDelete = () => {
    axios.delete(`${baseUrl}/schedule/${currentSchedule.id}`, {
      headers: headers,
    })
    .then(response => {
      setSchedules(schedules.filter(schedule => schedule.id !== currentSchedule.id));
    });
    closeDeleteDialog();
  };

  const handleSave = () => {
      axios.post(`${baseUrl}/schedule`, currentSchedule, {
        headers: headers,
      })
      .then(response => {
        setSchedules([...schedules, response.data]);
      });
    closeDialog();
  };

  const handleScoreUpdate = () => {
    axios.patch(`${baseUrl}/match/${currentSchedule.id}`, {
      id: currentSchedule.id,
      homeTeamScore: currentScores.home,
      awayTeamScore: currentScores.away
    }, {
      headers: headers
    })
    .then(response => {
      setSchedules(prevSchedules => {
        return prevSchedules.map(schedule => {
          if (schedule.id === currentSchedule.id) {
            schedule.matches = schedule.matches.map(match => {
              if (match.id === currentSchedule.id) {
                match.homeTeamScore = currentScores.home;
                match.awayTeamScore = currentScores.away;
              }
              return match;
            });
          }
          return schedule;
        });
      });
    });
    
    closeEditDialog();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule({ ...currentSchedule, [name]: value });
   };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    "Doesn't refresh after result insert, manually switch tab and come back :P"
  </div>
<Table>
  <thead>
    <tr>
      <th style={{ textAlign: 'center' }}>League</th>
      <th style={{ textAlign: 'center' }}>Match Details</th>
      {isAuthenticated && (
        <th style={{ textAlign: 'center' }}>Actions</th>
      )}
    </tr>
  </thead>
  <tbody>
    {schedules.map(schedule => (
      <tr key={schedule.id}>
<td style={{ textAlign: 'center' }}>
  <Link to={`/league/${schedule.leagueName}`}>
    <Button>{schedule.leagueName}</Button>
  </Link>
</td>

        <td>
          {schedule.matches.map(match => (
            <div key={match.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <div style={{ flex: 1 }}>
                {`${match.homeTeam} vs ${match.awayTeam}`}
              </div>
              <div style={{ flex: 1, color: match.homeTeamScore === null && match.awayTeamScore === null ? 'inherit' : 'red' }}>
                {new Date(match.date).toLocaleDateString()}
              </div>
              <div style={{ flex: 1 }}>
              <Button
  style={{ backgroundColor: 'lightblue' }}
  onMouseOver={(e) => {
    if (isAuthenticated && user.sub === schedule.admin) {
      e.currentTarget.innerText = "EDIT";
    }
  }}
  onMouseOut={(e) => {
    if (isAuthenticated && user.sub === schedule.admin) {
      e.currentTarget.innerText = match.homeTeamScore !== null && match.awayTeamScore !== null ? `${match.homeTeamScore} - ${match.awayTeamScore}` : "";
    }
  }}
  onClick={() => {
    if (isAuthenticated && user.sub === schedule.admin) {
      openEditDialog(match);
    }
  }}
>
  {match.homeTeamScore !== null && match.awayTeamScore !== null ? `${match.homeTeamScore} - ${match.awayTeamScore}` : ""}
</Button>

              </div>
            </div>
          ))}
        </td>
        <td style={{ textAlign: 'center' }}>
          {isAuthenticated && user.sub === schedule.admin && (
            <Button onClick={() => openDeleteDialog(schedule)}>Delete</Button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</Table>

  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    {isAuthenticated && (
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        Generate Schedule
      </Button>
    )}
  </div>

      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{currentSchedule.id ? 'Edit Schedule' : 'Generate Schedule'}</DialogTitle>
        <DialogContent>
    <FormControl fullWidth>
  <InputLabel id="league-label">League</InputLabel>
  <Select
    labelId="league-label"
    name="leagueName"
    value={currentSchedule.leagueName || ''}
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

<Dialog open={openEdit} onClose={closeEditDialog}>
  <DialogTitle>Update Scores</DialogTitle>
  <DialogContent>
          <TextField
            style={{ marginTop: '10px' }}
      name="homeTeamScore" 
      label={`${currentSchedule.homeTeam} Score`}  
      type="number"
      value={currentScores.home || ''} 
      onChange={(e) => handleScoreChange(e, 'home')} 
      fullWidth
      InputProps={{
        inputProps: { min: 0 }
      }}
    />
          <TextField 
                        style={{ marginTop: '10px' }}

      name="awayTeamScore" 
      label={`${currentSchedule.awayTeam} Score`}
      type="number"
      value={currentScores.away || ''} 
      onChange={(e) => handleScoreChange(e, 'away')} 
      fullWidth
      InputProps={{
        inputProps: { min: 0 }
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={closeEditDialog} color="primary">
      Cancel
    </Button>
    <Button onClick={handleScoreUpdate} color="primary">
      Update
    </Button>
  </DialogActions>
</Dialog>



      <Dialog open={openDelete} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the schedule?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Schedules;
