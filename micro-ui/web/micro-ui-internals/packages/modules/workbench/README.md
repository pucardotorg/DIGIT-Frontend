# Workbench Module

Local override of `@egovernments/digit-ui-module-workbench`. Provides a modern, custom-designed MDMS browser and management UI.

## Why a local module?

The npm package (`@egovernments/digit-ui-module-workbench`) ships pre-built with no editable source. This local module replaces it via yarn workspace resolution (same package name takes priority) to enable full UI customisation.

## Module Structure

```
workbench/
├── package.json
├── README.md
├── API_ENDPOINTS.md
├── IMPLEMENTATION.md
└── src/
    ├── Module.js                  # Module entry + component registry
    ├── hooks/
    │   ├── index.js               # Hook exports
    │   └── useWorkbenchMDMS.js    # MDMS schema fetch hook
    ├── components/
    │   └── CustomTable.js         # Reusable table (copied from HRMS, independent)
    └── pages/
        ├── index.js               # Route definitions
        ├── MDMSSearchV2.js        # MDMS search screen (module/master dropdowns)
        ├── MDMSViewV2.js          # MDMS results screen (dynamic table + filters)
        ├── MDMSDetailV2.js        # Record detail / edit screen
        └── MDMSCreateV2.js        # Create new schema + data screen
```

## Installation

The module is auto-detected by the monorepo workspace config (`packages/modules/*`). After creating the module:

```bash
cd micro-ui/web/micro-ui-internals
yarn install
yarn start
```

## Routes

| Route                                              | Component      | Description                        |
| -------------------------------------------------- | -------------- | ---------------------------------- |
| `/workbench/manage-master-data`                    | `MDMSSearchV2` | Module/Master dropdown search      |
| `/workbench/mdms-view?module=X&master=Y`           | `MDMSViewV2`   | Results table with dynamic columns |
| `/workbench/mdms-view-row?module=X&master=Y&row=N` | `MDMSDetailV2` | Record detail / edit screen        |
| `/workbench/mdms-create`                           | `MDMSCreateV2` | Create new schema + data           |

## Component Registry

| Key               | Component                                 |
| ----------------- | ----------------------------------------- |
| `WorkbenchModule` | Top-level module (renders `WorkbenchApp`) |
| `WBMDMSSearchV2`  | MDMS Search screen                        |
| `WBMDMSViewV2`    | MDMS Results/View screen                  |
| `WBMDMSDetailV2`  | Record detail / edit screen               |
| `WBMDMSCreateV2`  | Create new schema + data screen           |

## Hooks

| Hook                                               | Description                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| `Digit.Hooks.workbench.useWorkbenchMDMS(tenantId)` | Fetches all MDMS v2 schema definitions, returns `{ moduleMap, schemas }` |

---

## MDMS Search Screen (`MDMSSearchV2.js`)

### Design

- **Hero card** with teal gradient accent, icon, title, and description
- **Two cascading dropdowns**: Module Name → Master Name (searchable)
- **Create New button** in hero card → navigates to `/workbench/mdms-create`
- **Search / Clear buttons**
- **Recent searches** section persisted in `sessionStorage`

### Data Flow

1. On mount, calls `Digit.Hooks.workbench.useWorkbenchMDMS(tenantId)` which fetches:
   - `/egov-mdms-service/schema/v1/_search` (v2 schema endpoint)
2. Builds a `{ moduleName: [masterName, ...] }` map for dropdown options
3. On search, navigates to `/workbench/mdms-view?module=X&master=Y`

### Sub-components

| Component        | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `SearchDropdown` | Searchable dropdown with label, required indicator, outside-click close |
| `RecentChip`     | Clickable chip for recent search entries with hover effect              |

---

## MDMS Results Screen (`MDMSViewV2.js`)

### Design

- **Back link** to search screen
- **Header** with master name title, module badge, record count
- **Schema info card** showing all discovered fields with their types
- **Filter bar** with text search, up to 4 auto-detected column filter chips, clear button
- **Active filter pills** row with individual clear buttons
- **Dynamic table** using `CustomTable` with:
  - Auto-generated columns from data schema
  - Smart cell rendering (booleans as badges, arrays/objects as count badges, long strings truncated)
  - Client-side pagination with page size selector
  - Row click navigation for detail view
  - Skeleton loading states

### Data Flow

1. Reads `module` and `master` from URL query params
2. Fetches data:
   - **Primary**: `/egov-mdms-service/v2/_search` with `schemaCode`
   - **Fallback**: Standard MDMS v1 search
3. Derives schema (field names + types) from data rows
4. Auto-detects filterable columns (string/boolean/number with ≤50 unique values)
5. Client-side text search and column filtering
6. Client-side pagination

### Sub-components

| Component    | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| `FilterChip` | Dropdown filter for a specific column with search and clear |

### Cell Value Rendering

| Type             | Rendering                          |
| ---------------- | ---------------------------------- |
| `null/undefined` | Gray italic dash                   |
| `boolean`        | Green "true" / Red "false" badge   |
| `array`          | Teal count badge + "items" label   |
| `object`         | Teal count badge + "keys" label    |
| `string`         | Plain text (truncated at 60 chars) |
| `number`         | Plain text                         |

---

## CustomTable (`components/CustomTable.js`)

Copied from the HRMS module to maintain independence. Fully generic table with:

- Dynamic column definitions (label, render, accessor, width)
- Skeleton loading rows
- Pagination with page numbers, prev/next, page size selector
- Row hover + click handlers
- Auto index column

See the HRMS `components/README.md` for full API documentation.

---

## MDMS Record Detail Screen (`MDMSDetailV2.js`)

### Design

- **Back link** to results table
- **Header** with master name, module badge, unique identifier badge, active/inactive status badge
- **Edit / Save / Cancel** action buttons in header
- **Tabbed interface** with three tabs:
  - **Data Fields** — structured field-by-field view and edit
  - **JSON View** — raw JSON with syntax highlighting and copy button
  - **Audit Details** — MDMS record metadata (id, created/modified by/time)

### Data Fields Tab

- **Record Status** card with isActive toggle (uses outer MDMS `isActive`, not inner data)
- **Properties** card — simple fields (string, number, boolean) in a 2-column grid
- **Complex fields** — each object/array rendered in its own card

### Edit Mode

When editing is enabled:

| Field Type                 | Editor                             |
| -------------------------- | ---------------------------------- |
| `boolean`                  | Toggle switch (Active/Inactive)    |
| `number`                   | Number input                       |
| `string` (short)           | Text input                         |
| `string` (long, >80 chars) | Textarea                           |
| `object` / `array`         | JSON textarea with live validation |

### Save Flow

1. Sends `PUT` to `/egov-mdms-service/v2/_update` with:
   ```json
   {
     "Mdms": {
       "id": "<mdmsId>",
       "tenantId": "<tenantId>",
       "schemaCode": "<module>.<master>",
       "uniqueIdentifier": "<uid>",
       "data": { ...editedFields },
       "isActive": true / false
     }
   }
   ```
2. Shows success/error toast notification
3. On success, exits edit mode

### Sub-components

| Component         | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `JsonHighlight`   | Syntax-highlighted JSON viewer                         |
| `Toggle`          | Active/Inactive toggle switch                          |
| `Toast`           | Auto-dismissing success/error notification             |
| `JsonFieldEditor` | JSON textarea with live parse validation               |
| `FieldEditor`     | Smart editor that picks the right input per field type |

### Navigation

- Navigated to from `MDMSViewV2` on row click
- Receives row data via `location.state.rowData`
- Row data includes `_mdmsId`, `_mdmsUniqueIdentifier`, `_mdmsAuditDetails`, `isActive`

---

## MDMS Create Screen (`MDMSCreateV2.js`)

### Design

- **3-step wizard** with visual stepper indicator:
  1. **Define Schema** — module name, master name, description, JSON schema definition
  2. **Add Data** — unique identifier, initial data record as JSON
  3. **Review & Create** — summary of all inputs before submission
- **Success screen** with links to view records, create another, or go back

### API Integration

Uses two backend APIs (discovered from `egov-mdms-service` backend):

**Step 1 — Create Schema:**

```
POST /egov-mdms-service/schema/v1/_create
Body: {
  "SchemaDefinition": {
    "tenantId": "pb",
    "code": "moduleName.masterName",
    "description": "optional",
    "definition": { /* JSON Schema */ },
    "isActive": true
  }
}
```

**Step 2 — Create Data Record:**

```
POST /egov-mdms-service/v2/_create
Body: {
  "Mdms": {
    "tenantId": "pb",
    "schemaCode": "moduleName.masterName",
    "uniqueIdentifier": "1",
    "data": { /* record data */ },
    "isActive": true
  }
}
```

### Validation

| Field             | Rules                               |
| ----------------- | ----------------------------------- |
| Module Name       | Required, no spaces                 |
| Master Name       | Required, no spaces                 |
| JSON Schema       | Required, must be valid JSON object |
| Unique Identifier | Required                            |
| Data JSON         | Required, must be valid JSON object |

### Sub-components

| Component | Description                                |
| --------- | ------------------------------------------ |
| `Stepper` | Visual 3-step progress indicator           |
| `Toast`   | Auto-dismissing success/error notification |

### Navigation

- Accessed from "Create New" button on MDMSSearchV2 hero card
- On success, links to view the created records or create another entry

---

## Build & Dev Scripts

| Script                 | Command                          |
| ---------------------- | -------------------------------- |
| `yarn dev:workbench`   | Watch mode for local development |
| `yarn build:workbench` | Production build                 |

## Colour Tokens

Consistent with HRMS module: `TEAL (#0d6a82)`, `TEAL_LIGHT (#e8f4f6)`, `GRAY` shades, `GREEN (#16a34a)`, `RED (#dc2626)`, `WHITE (#ffffff)`.
