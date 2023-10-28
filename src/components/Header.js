import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'center' }}>
        <Link to="/league" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">Leagues</Button>
        </Link>
        <Link to="/player" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">Players</Button>
        </Link>
        <Link to="/schedule" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">Schedules</Button>
        </Link>
        <Link to="/sport" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">Sports</Button>
        </Link>
        <Link to="/team" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">Teams</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
