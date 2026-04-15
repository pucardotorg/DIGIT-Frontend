import { useQuery } from "react-query";

/**
 * Custom hook to fetch all available MDMS modules and masters using v2 schema endpoint
 * Matches the existing workbench implementation
 */
const useWorkbenchMDMS = (tenantId, config = {}) => {
  return useQuery(
    ["WORKBENCH_MDMS_SCHEMA", tenantId],
    async () => {
      /* Fetch MDMS v2 schema definitions - same as existing workbench */
      const res = await Digit.CustomService.getResponse({
        url: "/egov-mdms-service/schema/v1/_search",
        params: {},
        body: {
          SchemaDefCriteria: {
            tenantId: tenantId,
            limit: 200,
          },
        },
      });

      const schemas = res?.SchemaDefinitions || [];

      if (schemas.length === 0) {
        console.warn("[WB Hook] No schema definitions found");
        return { moduleMap: {}, schemas: [] };
      }

      /* Build module -> masters map from schema codes */
      const moduleMap = {};
      schemas.forEach((schema) => {
        if (!schema.code || !schema.isActive) return;

        const parts = schema.code.split(".");
        if (parts.length >= 2) {
          const moduleName = parts[0];
          const masterName = parts.slice(1).join(".");

          if (!moduleMap[moduleName]) {
            moduleMap[moduleName] = [];
          }
          if (!moduleMap[moduleName].includes(masterName)) {
            moduleMap[moduleName].push(masterName);
          }
        }
      });

      /* Sort masters within each module */
      Object.keys(moduleMap).forEach((mod) => {
        moduleMap[mod].sort();
      });

      console.log("[WB Hook] Fetched", Object.keys(moduleMap).length, "modules:", Object.keys(moduleMap).sort());
      console.log("[WB Hook] Total schemas:", schemas.length);

      return {
        moduleMap,
        schemas,
      };
    },
    {
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
      retry: 1,
      ...config,
    }
  );
};

export default useWorkbenchMDMS;
