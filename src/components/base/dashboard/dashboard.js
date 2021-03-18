import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, makeStyles, Grid, Paper } from '@material-ui/core';
import { AuthContext } from 'contexts/authContext';

import { logout } from 'services/authService';
import logo from '../../../assets/images/logo.png';
import "./dashboard.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Dashboard = () => {
  const userInfo = useContext(AuthContext);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <Avatar src={logo} />
          </IconButton>
          <Typography variant="h6" className={classes.title}>

          </Typography>
          <Avatar src={userInfo.picture} />
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="user-info"
      >
        <Paper className="dashboard-info-container" elevation={3}>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar src={userInfo.picture} />
            </Grid>
            <Grid item xs={8} container alignItems="center">
              {userInfo.first_name} {userInfo.last_name}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item><b>Email</b>:{userInfo.email}</Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item><b>ID</b>: {userInfo.googleProvider.id}</Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item><b>IP</b>: {userInfo.last_ip}</Grid>
          </Grid>
        </Paper>

      </Grid>
    </div>
  );
}

export default Dashboard;

