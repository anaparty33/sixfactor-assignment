import React from 'react';
import { Grid, Paper, Button, Avatar, Typography } from '@material-ui/core';

import { GoogleLogin } from "react-google-login";
import { GOOGLE_CLIENT_ID } from 'constants/Constants';
import { onFailure, googleResponse } from 'services/authService';
import beeCleanLogin from '../../../assets/images/bee-clean-login.png';
import history from 'services/history';

import './signin.scss';

const Signin = () => {

  const handleFailure = (error) => {
    onFailure(error);
  }

  const handleGoogleResponse = (response) => {
    googleResponse(response);
    location.reload();
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className="singin-container"
    >
      <Grid item >
        <Paper className="signin-form-container" elevation={3}>
          <Grid container
            justify="center"
          >
            <img className="login-logo" src={beeCleanLogin} />
          </Grid>
          <Grid container
            justify="center">
            <Typography variant="h6">
              <h2 className="login-header">Welcome to The Hive</h2>
            </Typography>
          </Grid>
          <Grid container
            justify="center">
            <GoogleLogin
              render={renderProps => (
                <Button
                  variant="contained"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  color="default"
                  size="small"
                  className="login-button"
                  startIcon={<Avatar src={'https://i.dlpng.com/static/png/6909571_preview.png'} />}
                >
                  Login With Google
                </Button>
              )}
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login With Google"
              scope="email"
              onSuccess={handleGoogleResponse}
              onFailure={handleFailure}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
};

export default Signin;

