# Workbench Module Implementation

## Problem Analysis

### Issue: Empty Module Dropdown

**Root Cause**: The initial implementation tried to use MDMS v1 endpoint with `MdmsService.call()`, but the existing workbench uses the **v2 schema endpoint** (`/egov-mdms-service/schema/v1/_search`) which returns schema definitions with codes like `"common-masters.assigneToOfficeMembers"`, `"case.CaseOverallStatusType"`, etc.

**DIGIT's Pattern**:

```js
// HRMS example
const { data } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation");

// Under the hood:
useQuery(["HRMS_EMP_RD", tenantId], () => MdmsService.getHrmsEmployeeRolesandDesignation(tenantId));
// Which calls:
MdmsService.call(tenantId, { moduleDetails: [...] });
```

**Key Differences**:

1. `MdmsService.call()` properly wraps the request with `RequestInfo` and auth tokens
2. React Query provides caching, loading states, and automatic refetch
3. Hooks are registered globally on `Digit.Hooks.<moduleName>`

## Solution

### 1. Created Custom Hook (`src/hooks/useWorkbenchMDMS.js`)

Uses the v2 schema endpoint (same as existing workbench):

```js
const useWorkbenchMDMS = (tenantId, config = {}) => {
  return useQuery(
    ["WORKBENCH_MDMS_SCHEMA", tenantId],
    async () => {
      // Fetch v2 schema definitions
      const res = await Digit.CustomService.getResponse({
        url: "/egov-mdms-service/schema/v1/_search",
        body: { SchemaDefCriteria: { tenantId, limit: 200 } },
      });

      // Parse schema codes like "common-masters.Department" into module -> masters map
      const schemas = res?.SchemaDefinitions || [];
      const moduleMap = {};
      schemas.forEach((schema) => {
        const [moduleName, ...masterParts] = schema.code.split(".");
        const masterName = masterParts.join(".");
        if (!moduleMap[moduleName]) moduleMap[moduleName] = [];
        moduleMap[moduleName].push(masterName);
      });

      return { moduleMap, schemas };
    },
    { staleTime: 60000, cacheTime: 300000, ...config }
  );
};
```

### 2. Registered Hook in Module.js

```js
import workbenchHooks from "./hooks";

export const initWorkbenchComponents = () => {
  // Register components
  Object.entries(componentsToRegister).forEach(...);

  // Register hooks (same as HRMS)
  Digit.Hooks.workbench = workbenchHooks;
};
```

### 3. Updated MDMSSearchV2 to Use Hook

**Before** (manual fetch):

```js
useEffect(() => {
  const fetchSchemas = async () => {
    const res = await Digit.CustomService.getResponse({ url: ..., body: ... });
    setAllData(processData(res));
  };
  fetchSchemas();
}, [tenantId]);
```

**After** (hook-based):

```js
const { isLoading: loading, data: mdmsData } = Digit.Hooks.workbench.useWorkbenchMDMS(stateId || tenantId);
const allData = mdmsData?.moduleMap || null;
```

## File Structure

```
workbench/
├── src/
│   ├── hooks/
│   │   ├── index.js                    # Exports all hooks
│   │   └── useWorkbenchMDMS.js         # MDMS fetch hook
│   ├── components/
│   │   └── CustomTable.js
│   ├── pages/
│   │   ├── index.js
│   │   ├── MDMSSearchV2.js             # Uses Digit.Hooks.workbench.useWorkbenchMDMS
│   │   └── MDMSViewV2.js
│   └── Module.js                       # Registers hooks on Digit.Hooks.workbench
```

## Benefits

1. **Consistency**: Follows DIGIT's established patterns (same as HRMS, PGR, etc.)
2. **Caching**: React Query automatically caches MDMS data
3. **Loading States**: Built-in `isLoading`, `isError`, `isFetching` states
4. **Reusability**: Hook can be used in any workbench component
5. **Debugging**: Console logs show which modules were fetched

## Testing

1. Open browser DevTools console
2. Navigate to `/employee/workbench/manage-master-data`
3. Look for log: `[WB Hook] Fetched X modules: [...]`
4. Module dropdown should populate with: `ACCESSCONTROL-ROLES`, `BillingService`, `common-masters`, `DIGIT-UI`, `egov-hrms`, `egov-location`, `RAINMAKER-PGR`, `tenant`
5. Select a module → master dropdown populates
6. Click Search → navigates to results screen

## Known Modules/Masters

The hook fetches these known MDMS modules:

- `common-masters`: Department, Designation, GenderType, StateInfo, etc.
- `tenant`: tenants, citymodule
- `egov-hrms`: CommonFieldsConfig, DeactivationReason, EmployeeStatus, EmployeeType, Degree
- `ACCESSCONTROL-ROLES`: roles
- `RAINMAKER-PGR`: ServiceDefs, PGRConstants
- `BillingService`: BusinessService, TaxHeadMaster, TaxPeriod
- `DIGIT-UI`: ApiCachingSettings
- `egov-location`: TenantBoundary

Additional modules can be added to the `moduleDetails` array in `useWorkbenchMDMS.js`.
