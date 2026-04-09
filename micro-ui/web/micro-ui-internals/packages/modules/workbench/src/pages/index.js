import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";

const WorkbenchApp = ({ path }) => {
  const MDMSSearch = Digit?.ComponentRegistryService?.getComponent("WBMDMSSearchV2");
  const MDMSView = Digit?.ComponentRegistryService?.getComponent("WBMDMSViewV2");
  const MDMSDetail = Digit?.ComponentRegistryService?.getComponent("WBMDMSDetailV2");
  const MDMSCreate = Digit?.ComponentRegistryService?.getComponent("WBMDMSCreateV2");
  const MDMSAdd = Digit?.ComponentRegistryService?.getComponent("WBMDMSAddV2");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <PrivateRoute path={`${path}/manage-master-data`} component={() => <MDMSSearch />} />
          <PrivateRoute path={`${path}/mdms-create`} component={() => <MDMSCreate />} />
          <PrivateRoute path={`${path}/mdms-view-row`} component={() => <MDMSDetail />} />
          <PrivateRoute path={`${path}/mdms-add`} component={() => <MDMSAdd />} />
          <PrivateRoute path={`${path}/mdms-view`} component={() => <MDMSView />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default WorkbenchApp;
