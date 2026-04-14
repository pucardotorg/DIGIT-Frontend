import React from "react";
import { useRouteMatch } from "react-router-dom";
import HRMSCard from "./components/hrmscard";
import WorkbenchCard from "./components/WorkbenchCard";
import InboxFilter from "./components/InboxFilter";
import ActionModal from "./components/Modal";
import Assignments from "./components/pageComponents/assignment";
import HRBanner from "./components/pageComponents/Banner";
import SelectDateofBirthEmployment from "./components/pageComponents/EmployeeDOB";
import SelectEmployeePhoneNumber from "./components/pageComponents/EmployeePhoneNumber";
import Jurisdictions from "./components/pageComponents/jurisdiction";
import SelectDateofEmployment from "./components/pageComponents/SelectDateofEmployment";
import SelectEmployeeEmailId from "./components/pageComponents/SelectEmailId";
import SelectEmployeeCorrespondenceAddress from "./components/pageComponents/SelectEmployeeCorrespondenceAddress";
import SelectEmployeeGender from "./components/pageComponents/SelectEmployeeGender";
import SelectEmployeeId from "./components/pageComponents/SelectEmployeeId";
import SelectEmployeeName from "./components/pageComponents/SelectEmployeeName";
import SelectEmployeeType from "./components/pageComponents/SelectEmployeeType";
import EmployeeApp from "./pages";
import CreateEmployee from "./pages/createEmployee";
import EditEmployee from "./pages/EditEmployee/index";
import Details from "./pages/EmployeeDetails";
import Inbox from "./pages/Inbox";
import Response from "./pages/Response";
import EmployeeForm from "./pages/EmployeeForm";
import { CustomMultiSelect } from "./components/pageComponents/CustomMultiSelect";
import HomeScreen from "./components/HomeScreen";
import HomeModule from "./pages/HomeModule";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import HomeCard from "./components/HomeCard";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "HR";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  Digit.SessionStorage.set("HRMS_TENANTS", tenants);
  const { path, url } = useRouteMatch();
  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }
  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} />;
  } else return null;
};

const componentsToRegister = {
  HRMSCard,
  /**
   * HomeCard — Rendered by DIGIT core when "Home" is in enabledModules.
   * DIGIT core looks for {ModuleCode}Card components.
   * This redirects /employee to /employee/home.
   * See: src/components/HomeCard.js
   */
  HomeCard,
  /**
   * HomeModule — custom home module that provides routing for custom home screens.
   * Renders at /employee/home route.
   * See: src/pages/HomeModule.js
   */
  HomeModule,
  /**
   * EmployeeHome — redirect component that redirects /employee to /employee/home.
   * The DIGIT core renders this at /employee, and we redirect to our custom home.
   */
  /**
   * WorkbenchCard — local override of the card from @egovernments/digit-ui-module-workbench.
   * The npm package has no editable source; we override it here via the Component Registry.
   * IMPORTANT: initHRMSComponents() must be called AFTER initWorkbenchComponents() in the
   * app entry point (example/src/index.js) so this registration wins.
   * See: src/components/WorkbenchCard.js and src/components/README.md
   */
  WorkbenchCard,
  HRMSDetails: Details,
  SelectEmployeeEmailId,
  SelectEmployeeName,
  SelectEmployeeId,
  Jurisdictions,
  Assignments,
  ActionModal,
  HRBanner,
  SelectEmployeePhoneNumber,
  SelectDateofEmployment,
  SelectEmployeeType,
  SelectEmployeeCorrespondenceAddress,
  SelectEmployeeGender,
  SelectDateofBirthEmployment,
  HRMSModule,
  HRMSResponse: Response,
  HREditEmpolyee: EditEmployee,
  HRCreateEmployee: CreateEmployee,
  HREmployeeForm: EmployeeForm,
  HRInbox: Inbox,
  HRMS_INBOX_FILTER: (props) => <InboxFilter {...props} />,
  CustomMultiSelect,
  HomeScreen,
};

export const initHRMSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
