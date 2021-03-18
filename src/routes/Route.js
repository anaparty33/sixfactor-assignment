import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from 'contexts/authContext';

function RouteWrapper (props) {
  let Component = props.component, {
    component,
    isPrivate,
    ...rest
  } = props;
  const userInfo = useContext(AuthContext);
    /**
   * Redirect user to SignIn page if he tries to access a private route
   * without authentication.
   */
  if (isPrivate && !userInfo) {
    return <Redirect to="/signin" />;
  }

  /**
   * Redirect user to Main page if he tries to access a non private route like
   * (SignIn or SignUp) after being authenticated.
   */
  if (!isPrivate && userInfo) {
    return <Redirect to="/dashboard" />;
  } 

  /**
   * If not included on both previous cases, redirect user to the desired route.
   */
  return (
    <Route {...rest}
      render={props => (
        <Component {...props} />
      )}
    />
  );
}


export default RouteWrapper;
