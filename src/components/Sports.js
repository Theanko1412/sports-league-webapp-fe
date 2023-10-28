import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useAuth } from './AuthContext';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';


const Sports = () => {
   const [sports, setSports] = useState([]);
   const [open, setOpen] = useState(false);
   const [openDelete, setOpenDelete] = useState(false);
   const [currentSport, setCurrentSport] = useState({});
   const [sportEnums, setSportEnums] = useState([]);
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
     axios.get(`${baseUrl}/sport/enums`, {
       headers: headers,
     }).then(response => {
       setSportEnums(response.data);
     });
   }, []);
 
   useEffect(() => {
     axios.get(`${baseUrl}/sport`, {
       headers: headers,
     })
       .then(response => {
         setSports(response.data);
       });
   }, []);
 
   const openDialog = (sport = {}) => {
     setCurrentSport(sport);
     setOpen(true);
   };
 
   const closeDialog = () => {
     setOpen(false);
   };
 
   const handleDelete = () => {
     axios.delete(`${baseUrl}/sport/${currentSport.id}`, {
       headers: headers,
     })
       .then(response => {
         setSports(sports.filter(sport => sport.id !== currentSport.id));
       });
     closeDeleteDialog();
   };
 
   const handleSave = () => {
     if (currentSport.id) {
       axios.patch(`${baseUrl}/sport/${currentSport.id}`, currentSport, {
         headers: headers,
       })
         .then(response => {
           setSports(sports.map(sport => (sport.id === currentSport.id ? currentSport : sport)));
         });
     } else {
       axios.post(`${baseUrl}/sport`,
         {
           "name": currentSport.sportEnum,
         }
         , {
           headers: headers,
         })
         .then(response => {
           setSports([...sports, response.data]);
         });
     }
     closeDialog();
   };
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setCurrentSport({ ...currentSport, [name]: value });
   };
 
   const openDeleteDialog = (sport) => {
     setCurrentSport(sport);
     setOpenDelete(true);
   };
 
   const closeDeleteDialog = () => {
     setOpenDelete(false);
   };
 
   return (
     <div>
       <Table>
         <thead>
           <tr>
             <th style={{ textAlign: 'center' }}>Name</th>
             {isAuthenticated && (
               <th style={{ textAlign: 'center' }}>Actions</th>
               )}
           </tr>
         </thead>
         <tbody>
           {sports.map(sport => (
             <tr key={sport.id}>
               <td style={{ textAlign: 'center' }}>
                 <Link to={`/sport/${sport.name}`}>
                   <Button>{sport.name}</Button>
                 </Link>
               </td>
               <td style={{ textAlign: 'center' }}>
                 {isAuthenticated && user.sub === sport.admin && (
                   <>
                     <Button onClick={() => openDialog(sport)}>Edit</Button>
                     <Button onClick={() => openDeleteDialog(sport)}>Delete</Button>
                   </>
                 )}
               </td>
             </tr>
           ))}
         </tbody>
       </Table>
       <div style={{ textAlign: 'center', marginTop: '20px' }}>
         {isAuthenticated && (
           <Button variant="contained" color="primary" onClick={() => openDialog()}>
             Add New Sport
           </Button>
         )}
       </div>
 
       <Dialog open={open} onClose={closeDialog}>
         <DialogTitle>{currentSport.id ? 'Edit Sport' : 'New Sport'}</DialogTitle>
         <DialogContent>
 
           <FormControl fullWidth style={{ marginTop: '10px' }}>
             <InputLabel id="sport-enum-label">Sport Enum</InputLabel>
             <Select
               labelId="sport-enum-label"
               name="sportEnum"
               value={currentSport.sportEnum || ''}
               onChange={handleChange}
             >
               {sportEnums
                 .filter(sportEnum => !sports.some(sport => sport.name === sportEnum))
                 .map((filteredSportEnum, index) => (
                   <MenuItem key={index} value={filteredSportEnum}>
                     {filteredSportEnum}
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
           Are you sure you want to delete {currentSport.name}?
         </DialogContent>
         <DialogActions>
           <Button onClick={closeDeleteDialog} color="primary">
             Cancel
           </Button>
           <Button onClick={handleDelete} color="primary">
             Delete
           </Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 };
 
 export default Sports;
 