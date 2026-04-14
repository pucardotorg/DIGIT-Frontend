import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import HomeScreen from "../components/HomeScreen";

const HomeModule = () => {
  const { path } = useRouteMatch();

  console.log("path12", path);

  return (
    <Switch>
      <PrivateRoute exact path={`${path}`} component={() => <HomeScreen />} />
    </Switch>
  );
};

export default HomeModule;
