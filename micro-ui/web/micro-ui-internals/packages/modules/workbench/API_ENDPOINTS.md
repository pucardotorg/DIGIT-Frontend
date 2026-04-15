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
    "tenantId": "pb",
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
      "tenantId": "pb",
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
    "tenantId": "pb",
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
      "tenantId": "pb",
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

### 3. Create Schema Definition

**Endpoint**: `/egov-mdms-service/schema/v1/_create`  
**Used in**: `MDMSCreateV2.js` (step 1 of create wizard)  
**Purpose**: Create a new module.master schema definition

**Request**:

```json
{
  "SchemaDefinition": {
    "tenantId": "pb",
    "code": "moduleName.masterName",
    "description": "Optional description",
    "definition": {
      "type": "object",
      "$schema": "http://json-schema.org/draft-07/schema#",
      "required": [],
      "x-unique": [],
      "properties": {},
      "additionalProperties": false
    },
    "isActive": true
  },
  "RequestInfo": { ... }
}
```

**Response**:

```json
{
  "ResponseInfo": { ... },
  "SchemaDefinitions": [
    {
      "id": "generated-uuid",
      "tenantId": "pb",
      "code": "moduleName.masterName",
      "definition": { ... },
      "isActive": true,
      "auditDetails": { ... }
    }
  ]
}
```

---

### 4. Create Data Record

**Endpoint**: `/egov-mdms-service/v2/_create`  
**Used in**: `MDMSCreateV2.js` (step 2 of create wizard)  
**Purpose**: Create a new MDMS data record under an existing schema

**Request**:

```json
{
  "Mdms": {
    "tenantId": "pb",
    "schemaCode": "moduleName.masterName",
    "uniqueIdentifier": "1",
    "data": { ... },
    "isActive": true
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
      "id": "generated-uuid",
      "tenantId": "pb",
      "schemaCode": "moduleName.masterName",
      "uniqueIdentifier": "1",
      "data": { ... },
      "isActive": true,
      "auditDetails": { ... }
    }
  ]
}
```

---

### 5. Update Data Record

**Endpoint**: `/egov-mdms-service/v2/_update`  
**Used in**: `MDMSDetailV2.js` (edit mode save)  
**Purpose**: Update an existing MDMS data record

**Request**:

```json
{
  "Mdms": {
    "id": "existing-record-uuid",
    "tenantId": "pb",
    "schemaCode": "moduleName.masterName",
    "uniqueIdentifier": "1",
    "data": { ... },
    "isActive": true
  },
  "RequestInfo": { ... }
}
```

---

## Common Mistakes

### ❌ Wrong URLs (404 errors)

- `/mdms-v2/v2/_search` — **WRONG** (missing `egov-mdms-service` prefix)
- `/mdms-v2/v1/_search` — Old v1 endpoint (different structure)
- `/mdms-v2/schema/v1/_search` — **WRONG** (missing `egov-mdms-service` prefix)

### ✅ Correct URLs

- `/egov-mdms-service/schema/v1/_search` — Search schema definitions
- `/egov-mdms-service/schema/v1/_create` — Create schema definition
- `/egov-mdms-service/v2/_search` — Search MDMS data records
- `/egov-mdms-service/v2/_create` — Create MDMS data record
- `/egov-mdms-service/v2/_update` — Update MDMS data record

---

## File Locations

| File                            | Endpoint Used                          | Purpose                  |
| ------------------------------- | -------------------------------------- | ------------------------ |
| `src/hooks/useWorkbenchMDMS.js` | `/egov-mdms-service/schema/v1/_search` | Fetch module/master list |
| `src/pages/MDMSViewV2.js`       | `/egov-mdms-service/v2/_search`        | Fetch MDMS records       |
| `src/pages/MDMSDetailV2.js`     | `/egov-mdms-service/v2/_update`        | Update MDMS record       |
| `src/pages/MDMSCreateV2.js`     | `/egov-mdms-service/schema/v1/_create` | Create schema definition |
| `src/pages/MDMSCreateV2.js`     | `/egov-mdms-service/v2/_create`        | Create MDMS data record  |

---

## Testing

1. **Global Search Experience**: Check browser DevTools Network tab for:

   - URL: `/egov-mdms-service/schema/v1/_search`
   - Status: 200
   - Response: Array of `SchemaDefinitions`
   - _Note_: This call happens once upfront, and the `allData` map is kept in memory. The search box filters the list without requiring subsequent API calls.

2. **Search Results**: After clicking on a suggested combination from the search results, check for:

   - URL: `/egov-mdms-service/v2/_search`
   - Status: 200
   - Response: `{ mdms: [...] }`

3. **Create Flow**: Navigate to Create screen, fill in all fields, and check for:

   - URL: `/egov-mdms-service/schema/v1/_create` (schema)
   - URL: `/egov-mdms-service/v2/_create` (data)
   - Status: 202 (Accepted)

4. **Console Logs**:
   ```
   [WB Hook] Fetched 8 modules: ["case", "common-masters", ...]
   [WB Hook] Total schemas: 200
   [WB Create] Creating schema: moduleName.masterName
   [WB Create] Schema created: { ... }
   [WB Create] Creating data record for: moduleName.masterName
   [WB Create] Data record created: { ... }
   ```
