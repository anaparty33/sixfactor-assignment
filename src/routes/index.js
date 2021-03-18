import React, { useState, useEffect } from "react";
import { Switch, Router, Redirect } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { AuthContext } from 'contexts/authContext';
import { verifiyToken } from 'services/authService';
import Route from "./Route";
import history from 'services/history';
import Signin from 'base/signin/signin';
import Dashboard from 'base/dashboard/dashboard';

function Routes() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      verifiyToken()
        .then((response) => {
          // debugger;
          // console.log('userdata->', response);
          setUserInfo(response.user)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoaded(true)
        });
    }
  }, [isInitialized]);



  //During verifyToken call back render just an empty element 
  //instead of Router
  if (!loaded || !isInitialized) {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="loader"
      >
        <Grid item >
          <CircularProgress />
        </Grid>
      </Grid>
    )
  }
  return (
    <AuthContext.Provider value={userInfo}>
      <Router history={history}>
        <Switch>
          <Route path="/signin" exact component={Signin} />
          <Route path="/dashboard" exact component={Dashboard} isPrivate />
          <Redirect exact from="/" to="dashboard" />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}


export default Routes;

