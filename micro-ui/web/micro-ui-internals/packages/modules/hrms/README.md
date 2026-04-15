<!-- TODO: update this -->

# digit-ui-module-hrms

## Install

```bash
npm install --save @egovernments/digit-ui-module-hrms
```

## Limitation

```bash
This Package is more specific to DIGIT-UI's can be used across mission's
```

## Usage

After adding the dependency make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-module-hrms":"^1.5.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";

/** inside enabledModules add this new module key **/

const enabledModules = ["HRMS"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initHRMSComponents();
};
```

### Changelog

```bash
1.8.0 workbench v1.0 release
1.8.0-beta.01 fixed compilation issue
1.8.0-beta workbench base version beta release
1.7.0 urban 2.9
1.6.0 urban 2.8
1.5.27 updated the readme content
1.5.26 some issue
1.5.25 corrected the bredcrumb issue
1.5.24 added the readme file
1.5.23 base version
```

### Contributors

[jagankumar-egov] [naveen-egov] [nipunarora-eGov] [Tulika-eGov] [Ramkrishna-egov] [vamshikrishnakole-wtt-egov]

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)

### Published from DIGIT Frontend

DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)

![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

---

## Home Screen Redesign

> Replaces DIGIT's default employee home page with a fully custom dashboard matching the new Figma design.

### Files changed

| File                           | Change                                                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/HomeScreen.js` | **New.** Custom home screen with welcome header, role-based module cards, operations overview, and security bar. Uses inline styles.          |
| `src/Module.js`                | **Modified.** Imported `HomeScreen` and registered it as `EmployeeHome` in `componentsToRegister`.                                            |
| `web/src/App.js`               | **Modified.** Fixed `initHRMSComponents()` call order — now runs after `initWorkbenchComponents()` so overrides win.                          |
| `web/src/index.css`            | **Modified.** Added CSS overrides to restyle TopBar (teal gradient, white text), hide DIGIT search icon on home, hide default card container. |

### Design Features

- **Welcome header** — "Welcome back, {Name}" with system-live badge
- **Role-based module cards** — HRMS Core and/or Project Workbench shown based on user roles
- **Centered single card** — If user has only one role, the single card is centered on screen
- **Statistics display** — Employee counts on HRMS card, placeholder metrics on Workbench card
- **Operations Overview** — Pending Approvals, System Health, Upcoming Holidays, Critical Alerts
- **Security compliance bar** — Encryption and audit logging status
- **No search icon** — DIGIT's default search icon is removed from the home page
- **Restyled TopBar** — Teal gradient background with white text/icons, matching the Figma design

### Role Logic

| Card      | Visible when                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------- |
| HRMS      | User has `HRMS_ADMIN` role (checked via `Digit.Utils.hrmsAccess()`)                               |
| Workbench | User has any of: `MDMS_ADMIN`, `EMPLOYEE`, `SUPERUSER`, `EMPLOYEE_COMMON`, `LOC_ADMIN`, `STADMIN` |

### Init Order (Critical)

```js
// In App.js / example/src/index.js:
initWorkbenchComponents(); // npm WorkbenchCard registered first
initHRMSComponents(); // our EmployeeHome + WorkbenchCard overwrite ← must be last
```

### Build Constraints

| Constraint                 | Reason                                             | Workaround                   |
| -------------------------- | -------------------------------------------------- | ---------------------------- |
| No `??` nullish coalescing | Babel/Webpack config does not support it           | Use `!= null ? x : fallback` |
| No `.css` imports          | microbundle hashes class names (CSS Modules)       | Use inline JS style objects  |
| TopBar is in npm core      | Cannot modify `@egovernments/digit-ui-module-core` | CSS overrides in `index.css` |

---

## Card Redesign (Employee Home Page)

> Replaces DIGIT's built-in `EmployeeModuleCard` with a fully custom React card design across the HRMS and Workbench modules.

### Files changed

| File                              | Change                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/components/ModuleCard.js`    | **New.** Shared card — gradient header, SVG KPI donut rings, animated nav links, hover lift effect. Uses inline styles. |
| `src/components/ModuleCard.css`   | **New (reference only).** Readable CSS documenting design tokens. Not loaded at runtime — see caveats below.            |
| `src/components/hrmscard.js`      | **Modified.** Uses `<ModuleCard theme="hrms">` instead of `<EmployeeModuleCard>`.                                       |
| `src/components/WorkbenchCard.js` | **New.** Local override of the Workbench card from the npm package, using the Component Registry pattern.               |
| `src/Module.js`                   | **Modified.** `WorkbenchCard` added to `componentsToRegister`.                                                          |

### WorkbenchCard override pattern

The Workbench module is a pre-built npm package with no editable source. Its home card is overridden here via the DIGIT Component Registry:

```js
// src/Module.js — WorkbenchCard overrides the npm version
const componentsToRegister = {
  HRMSCard,
  WorkbenchCard,
  // ...
};
```

**Critical — init order in `example/src/index.js`:**

```js
initWorkbenchComponents(); // npm WorkbenchCard registered first
initHRMSComponents(); // our WorkbenchCard overwrites it ← must be last
```

### How the DIGIT home page discovers cards

```js
// DigitUI core — for each enabled module:
Digit.ComponentRegistryService.getComponent(moduleCode + "Card");
// "HRMS" → getComponent("HRMSCard")
// "Workbench" → getComponent("WorkbenchCard")
```

### Build constraints

| Constraint                      | Reason                                                                       | Workaround                   |
| ------------------------------- | ---------------------------------------------------------------------------- | ---------------------------- |
| No `??` nullish coalescing      | Babel/Webpack config does not support it                                     | Use `!= null ? x : fallback` |
| No `.css` imports in components | microbundle hashes all class names (CSS Modules), breaking plain `className` | Use inline JS style objects  |

See [`src/components/README.md`](src/components/README.md) for the full component API reference.

---

## Search Employee Screen Redesign

> Replaces DIGIT's built-in DesktopInbox/InboxFilter/SearchApplication combo with a fully custom React implementation for maximum design flexibility.

### Files changed

| File                                     | Change                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/CustomTable.js`          | **New.** Reusable table component with skeleton loading, pagination, column renderers. Not HRMS-specific — can be used on any screen.                   |
| `src/components/SearchEmployeeScreen.js` | **Redesigned.** Modernised to JSX + `const`/`let` + arrow functions. Uses `CustomTable` for the results table. Semantic HTML (`<header>`, `<section>`). |
| `src/pages/Inbox.js`                     | **Modified.** Uses `SearchEmployeeScreen` instead of `DesktopInbox` for desktop view.                                                                   |

### Design Features

- **Unified search bar** — single text input searching across name, phone, and ID fields
- **Filter chip buttons** — Status, Role, Court Establishment, ULB with dropdown overlays
- **Active filter pills** — removable tags below search bar showing applied filters
- **Reusable `CustomTable`** — column-driven config with `render`/`accessor` per column, built-in skeleton rows and pagination
- **Enhanced table rows** — avatar with initials, grouped name+ID, status badges, action menus
- **Skeleton loading** — shimmer rows for smoother perceived performance
- **Modern pagination** — page number buttons with Previous/Next navigation
- **+ Create Employee button** — prominent call-to-action in top-right corner
- **Modern JS syntax** — `const`/`let`, JSX, arrow functions, destructured props, template literals

### Data Flow

The existing DIGIT hooks and API calls remain unchanged — only the presentation layer is replaced:

```
Digit.Hooks.hrms.useHRMSSearch(searchParams, tenantId, paginationParams)
Digit.Hooks.hrms.useHRMSCount(tenantId)
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation")
```

### Technical Notes

- Uses inline styles (no CSS imports) due to microbundle CSS Modules constraints
- `CustomTable` is a generic shared component — reusable on Create Employee, Employee Details, or any future list screen
- Maintains compatibility with existing filter and pagination logic
- Fully responsive design with hover states and smooth transitions
- Semantic HTML structure (`<header>`, `<section>`) for accessibility

---

## Employee Details Page Redesign

> Replaces DIGIT's built-in `Card`/`StatusTable`/`Row`/`ActionBar` layout with a modern, visually rich design using inline styles.

### Files changed

| File                           | Change                                                                                                                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/EmployeeDetails.js` | **Redesigned.** Modern hero header with avatar, status badge, action buttons. Section cards for personal/employment details, documents, jurisdictions, assignments. Deactivation banner for inactive employees. |

### Design Features

- **Hero header card** — large avatar with initials, employee name, code, type, and status badge (green ACTIVE / red INACTIVE pill). Teal gradient accent bar.
- **Inline action buttons** — Edit (outlined teal) and Deactivate/Activate (red outlined or teal gradient) directly in the hero header, replacing the bottom ActionBar.
- **Deactivation banner** — orange warning-style banner for inactive employees with effective date, reason, remarks, and order number.
- **Section cards** — rounded white cards with icon headers: Personal Details, Employment Details, Documents, Jurisdictions, Assignments.
- **Detail grid** — responsive CSS grid (`auto-fill, minmax(240px, 1fr)`) for label-value pairs.
- **Sub-cards** — bordered cards for individual jurisdictions and assignments with teal index badges.
- **Document cards** — clickable cards with file icon and document name, triggering download.
- **Role tags** — pill-style tags for user roles within assignment sections.
- **Back link** — arrow link navigating back to the employee list.
- **Outside-click menu close** — `useRef` + `mousedown` listener for dropdown dismissal.

### Data Flow

Uses the same DIGIT hooks — only the presentation layer is replaced:

```
Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId, null, isupdate)
Digit.UploadServices.Filefetch([documentId], stateId)
```

### Sub-components

- `DetailField` — label-value pair with uppercase gray label
- `SectionCard` — white card with icon header and content body
- `getInitials()` — extracts name initials for avatar display

---

## Employee Form Redesign (Create / Edit)

> Replaces `createEmployee.js` + `EditEmployee/EditForm.js` + DIGIT's `FormComposer` with a single unified `EmployeeForm.js` component using modern inline styles.

### Files changed

| File                        | Change                                                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/EmployeeForm.js` | **New.** Unified Create/Edit form with modern UI, custom inline-styled form controls, cascading dropdowns, validation, and toast notifications. |
| `src/Module.js`             | **Modified.** Imported and registered `EmployeeForm` as `HREmployeeForm`.                                                                       |
| `src/pages/index.js`        | **Modified.** Updated `/create` and `/edit/:tenantId/:id` routes to render `EmployeeForm` instead of `CreateEmployee` / `EditEmpolyee`.         |

### Design Features

- **Hero header card** — teal gradient accent, avatar (edit mode), title + description
- **Section cards** — Personal Details, Employee Details, Assignment Details with icon headers
- **Custom form controls** — `FormInput`, `FormSelect` (searchable), `FormMultiSelect` (checkboxes + tags), `FormDate`
- **Dynamic assignments** — add/remove cards with teal index badges; cascading District ↔ Court Establishment ↔ Courtroom
- **Inline validation** — real-time error messages for name, phone, email
- **Phone duplicate check** — debounced API call with toast on duplicate
- **Employee ID duplicate check** — on submit via API
- **Submit bar** — gradient primary button + outlined cancel
- **Toast notifications** — fixed-position auto-dismiss error/success toasts
- **Mode detection** — URL-based: `/hrms/create` → create mode, `/hrms/edit/:tenantId/:id` → edit mode

### Data Flow

Uses the same DIGIT hooks and APIs — only the presentation layer is replaced:

```
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation")
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "EmployeeType")
Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId)  // edit mode
Digit.HRMSService.search(tenantId, null, { phone })              // duplicate check
```

### Submit Flow

Navigates to `/hrms/response` with the same `{ Employees, key, action }` state shape:

- **Create** → `{ key: "CREATE", action: "CREATE" }`
- **Edit** → `{ key: "UPDATE", action: "UPDATE" }`

Supports `Digit.Customizations.HRMS.customiseCreateFormData` and `customiseUpdateFormData` hooks.
