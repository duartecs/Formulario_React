import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import StorageContext from "./Context";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useContext(StorageContext);

  return (
    <Route
      {...rest}
      render={() =>
        token ? <Component {...rest} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
