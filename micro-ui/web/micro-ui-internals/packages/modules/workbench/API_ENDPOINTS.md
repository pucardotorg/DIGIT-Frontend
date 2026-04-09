# Workbench MDMS API Endpoints

## Summary

The workbench module uses **MDMS v2** endpoints, not the old v1 MDMS endpoints.

## Endpoints Used

### 1. Schema Search (Get Module/Master List)

**Endpoint**: `/egov-mdms-service/schema/v1/_search`  
**Used in**: `useWorkbenchMDMS.js` hook  
**Purpose**: Fetch all available MDMS schema definitions to populate module/master dropdowns

**Request**:

```json
{
  "SchemaDefCriteria": {
    "tenantId": "kl",
    "limit": 200
  },
  "RequestInfo": { ... }
}
```

**Response**:

```json
{
  "SchemaDefinitions": [
    {
      "id": "...",
      "tenantId": "kl",
      "code": "common-masters.assigneToOfficeMembers",
      "description": null,
      "definition": { ... },
      "isActive": true,
      "auditDetails": { ... }
    },
    {
      "code": "case.CaseOverallStatusType",
      ...
    }
  ]
}
```

**Code parsing**: Split `code` by `.` to get module and master:

- `"common-masters.assigneToOfficeMembers"` → module: `common-masters`, master: `assigneToOfficeMembers`
- `"case.CaseOverallStatusType"` → module: `case`, master: `CaseOverallStatusType`

---

### 2. Data Search (Get MDMS Records)

**Endpoint**: `/egov-mdms-service/v2/_search`  
**Used in**: `MDMSViewV2.js` (results screen)  
**Purpose**: Fetch actual MDMS data records for a specific module.master combination

**Request**:

```json
{
  "MdmsCriteria": {
    "tenantId": "kl",
    "schemaCode": "commonUiConfig.chequeDetailsConfig",
    "limit": 500,
    "offset": 0
  },
  "RequestInfo": { ... }
}
```

**Response**:

```json
{
  "ResponseInfo": { ... },
  "mdms": [
    {
      "id": "bb8eddc2-00d6-43c2-a723-2e456874237d",
      "tenantId": "kl",
      "schemaCode": "commonUiConfig.chequeDetailsConfig",
      "uniqueIdentifier": "1",
      "data": {
        "id": 1,
        "header": "CS_CHEQUE_DETAILS_HEADING",
        "formconfig": [ ... ],
        ...
      },
      "isActive": true,
      "auditDetails": { ... }
    }
  ]
}
```

---

## Common Mistakes

### ❌ Wrong URLs (404 errors)

- `/mdms-v2/v2/_search` — **WRONG** (missing `egov-mdms-service` prefix)
- `/mdms-v2/v1/_search` — Old v1 endpoint (different structure)
- `/mdms-v2/schema/v1/_search` — **WRONG** (missing `egov-mdms-service` prefix)

### ✅ Correct URLs

- `/egov-mdms-service/schema/v1/_search` — Schema definitions
- `/egov-mdms-service/v2/_search` — MDMS data records

---

## File Locations

| File                            | Endpoint Used                          | Purpose                  |
| ------------------------------- | -------------------------------------- | ------------------------ |
| `src/hooks/useWorkbenchMDMS.js` | `/egov-mdms-service/schema/v1/_search` | Fetch module/master list |
| `src/pages/MDMSViewV2.js`       | `/egov-mdms-service/v2/_search`        | Fetch MDMS records       |

---

## Testing

1. **Global Search Experience**: Check browser DevTools Network tab for:

   - URL: `/egov-mdms-service/schema/v1/_search`
   - Status: 200
   - Response: Array of `SchemaDefinitions`
   - *Note*: This call happens once upfront, and the `allData` map is kept in memory. The search box filters the list without requiring subsequent API calls.

2. **Search Results**: After clicking on a suggested combination from the search results, check for:

   - URL: `/egov-mdms-service/v2/_search`
   - Status: 200
   - Response: `{ mdms: [...] }`

3. **Console Logs**:
   ```
   [WB Hook] Fetched 8 modules: ["case", "common-masters", ...]
   [WB Hook] Total schemas: 200
   ```
