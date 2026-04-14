import React from "react";
import { useTranslation } from "react-i18next";
import ModuleCard from "./ModuleCard";

// Role configuration — mirrors the npm workbench module's role definitions
const WORKBENCH_ROLES = {
  LOCALISATION: ["EMPLOYEE", "SUPERUSER", "EMPLOYEE_COMMON", "LOC_ADMIN"],
  MDMS: ["MDMS_ADMIN", "EMPLOYEE", "SUPERUSER"],
  DSS: ["STADMIN"],
};

const WorkbenchCard = () => {
  const { t } = useTranslation();

  // Role-based access guard — same logic as the npm WorkbenchCard
  const allRoles = Object.values(WORKBENCH_ROLES).flatMap((r) => r);
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(allRoles)) {
    return null;
  }

  // Build links and filter by user roles (same as npm version)
  let links = [
    {
      label: t("ACTION_TEST_MDMS") || "Manage Master Data",
      link: `/${window?.contextPath}/employee/workbench/manage-master-data`,
      roles: WORKBENCH_ROLES.MDMS,
    },
    {
      label: t("ACTION_TEST_LOCALISATION") || "Manage Localization",
      link: `/${window?.contextPath}/employee/workbench/localization-search`,
      roles: WORKBENCH_ROLES.LOCALISATION,
    },
  ];

  // Only show links the current user has roles for
  links = links.filter((item) => item.roles?.length > 0 && Digit.Utils.didEmployeeHasAtleastOneRole(item.roles));

  return (
    <ModuleCard
      moduleName={t("ACTION_TEST_WORKBENCH")}
      theme="workbench"
      Icon={
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
        </svg>
      }
      links={links}
    />
  );
};

export default WorkbenchCard;
