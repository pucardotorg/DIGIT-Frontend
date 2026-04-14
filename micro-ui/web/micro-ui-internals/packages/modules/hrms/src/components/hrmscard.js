import { PersonIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import ModuleCard from "./ModuleCard";

const HRMSCard = () => {
  const ADMIN = Digit.Utils.hrmsAccess();
  if (!ADMIN) {
    return null;
  }

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data } = Digit.Hooks.hrms.useHRMSCount(tenantId);

  const totalEmployees = isLoading ? "-" : data?.EmployeCount?.totalEmployee;
  const activeEmployees = isLoading ? "-" : data?.EmployeCount?.activeEmployee;

  // Calculate percentage for the ring chart (active / total)
  const activePercent = !isLoading && totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 100;

  return (
    <ModuleCard
      moduleName={t("ACTION_TEST_HRMS")}
      theme="hrms"
      Icon={<PersonIcon />}
      kpis={[
        {
          count: totalEmployees,
          label: t("TOTAL_EMPLOYEES"),
          link: `/${window?.contextPath}/employee/hrms/inbox`,
          variant: "primary",
          percent: 100,
        },
        {
          count: activeEmployees,
          label: t("ACTIVE_EMPLOYEES"),
          link: `/${window?.contextPath}/employee/hrms/inbox`,
          variant: "accent",
          percent: activePercent,
        },
      ]}
      links={[
        {
          label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
          link: `/${window?.contextPath}/employee/hrms/inbox`,
        },
        {
          label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
          link: `/${window?.contextPath}/employee/hrms/create`,
        },
      ]}
    />
  );
};

export default HRMSCard;
