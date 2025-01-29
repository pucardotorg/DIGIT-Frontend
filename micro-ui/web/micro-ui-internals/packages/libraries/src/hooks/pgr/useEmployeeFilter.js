import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const useEmployeeFilter = (tenantId, roles, complaintDetails) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      // const _roles = roles.join(",");
      const searchResponse = await Digit.PGRService.employeeSearch(tenantId, roles);

      const serviceDefs = await Digit.MDMSService.getServiceDefs(tenantId, "PGR");
      const serviceCode = complaintDetails.service.serviceCode;
      const service = serviceDefs?.find((def) => def.serviceCode === serviceCode);
      const courtEstablishment = service?.CourtEstablishment;
      const employees = searchResponse.Employees.filter((employee) =>
        employee.assignments.map((assignment) => assignment.courtEstablishment).includes(courtEstablishment)
      );

      //emplpoyess data sholld only conatin name uuid dept
      setEmployeeDetails([
        {
          courtEstablishment: t(`COMMON_MASTERS_COURT_ESTABLISHMENT_${courtEstablishment}`),
          employees: employees.map((employee) => {
            return { uuid: employee.user.uuid, name: employee.user.name };
          }),
        },
      ]);
    })();
  }, [tenantId, roles, t, complaintDetails]);

  return employeeDetails;
};

export default useEmployeeFilter;
