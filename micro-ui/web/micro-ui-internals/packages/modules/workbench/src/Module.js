import React from "react";
import { useRouteMatch } from "react-router-dom";
import WorkbenchApp from "./pages";
import MDMSSearchV2 from "./pages/MDMSSearchV2";
import MDMSViewV2 from "./pages/MDMSViewV2";
import MDMSDetailV2 from "./pages/MDMSDetailV2";
import MDMSCreateV2 from "./pages/MDMSCreateV2";
import MDMSAddV2 from "./pages/MDMSAddV2";
import LocalizationSearch from "./pages/LocalizationSearch";
import LocalizationCreate from "./pages/LocalizationCreate";
import LocalizationUpload from "./pages/LocalizationUpload";
import workbenchHooks from "./hooks";

/* ═══════════════════════════════════════════════
   WorkbenchModule — top-level module component
   ═══════════════════════════════════════════════ */
export const WorkbenchModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  if (userType === "employee") {
    return <WorkbenchApp path={path} url={url} />;
  }
  return null;
};

/* ═══════════════════════════════════════════════
   Component and hooks registry
   ═══════════════════════════════════════════════ */
const componentsToRegister = {
  WorkbenchModule,
  WBMDMSSearchV2: MDMSSearchV2,
  WBMDMSViewV2: MDMSViewV2,
  WBMDMSDetailV2: MDMSDetailV2,
  WBMDMSCreateV2: MDMSCreateV2,
  WBMDMSAddV2: MDMSAddV2,
  WBLocalizationSearch: LocalizationSearch,
  WBLocalizationCreate: LocalizationCreate,
  WBLocalizationUpload: LocalizationUpload,
};

export const initWorkbenchComponents = () => {
  /* Register components */
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });

  /* Register hooks */
  Digit.Hooks.workbench = workbenchHooks;
};
