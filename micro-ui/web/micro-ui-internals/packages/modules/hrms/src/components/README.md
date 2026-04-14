# HRMS Components — `src/components/`

This folder contains all shared and feature-specific UI components for the HRMS module.

---

## Custom Home Screen

### `HomeScreen.js` _(New — Custom home page UI)_

A fully custom employee home screen that displays role-based module cards and welcome information. Rendered at `/employee/home` by the `HomeModule` routing component.

### `HomeCard.js` _(New — Redirect component)_

A convention-based card component that follows DIGIT's `{ModuleCode}Card` naming pattern. When "Home" is added to `enabledModules`, DIGIT core automatically looks for and renders `HomeCard`. This component redirects users from `/employee` to `/employee/home` where the custom `HomeScreen` is displayed.

**Features:**

- **Welcome header** — "Welcome back, {Name}" with system-live badge, matching the Figma design
- **Role-based cards** — Shows HRMS and/or Workbench cards based on the logged-in user's roles
- **Centered layout** — If the user has only one role (HRMS or Workbench), the single card is centered on screen
- **Stats display** — Each card shows relevant statistics (e.g. Total Staff, Active Employees for HRMS)
- **Operations Overview** — Dashboard-style metrics row (Pending Approvals, System Health, etc.)
- **Security bar** — Compliance status indicator at the bottom
- **No search icon** — The DIGIT search icon is removed from the home page via CSS overrides

**Role configuration:**

| Card      | Shown when user has role(s)                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| HRMS      | `HRMS_ADMIN` (via `Digit.Utils.hrmsAccess()`)                                            |
| Workbench | Any of: `MDMS_ADMIN`, `EMPLOYEE`, `SUPERUSER`, `EMPLOYEE_COMMON`, `LOC_ADMIN`, `STADMIN` |

**Centering logic:**

- If both cards are visible → side-by-side layout (`flex`, gap)
- If only one card → `justify-content: center` on the cards row

**Data integration:**

```js
// User info for welcome message
Digit.UserService.getUser().info.name;

// HRMS employee count for stats
Digit.Hooks.hrms.useHRMSCount(tenantId);
```

**Styling:** All inline JS styles (no CSS imports) using the same teal/gray token system. Background uses a subtle gradient from teal-light to gray-50.

> **CSS overrides:** The home page also relies on CSS overrides in `web/src/index.css` to hide DIGIT's default search bar, module card container, and restyle the TopBar. See the CSS override section below.

---

## TopBar & CSS Overrides (`web/src/index.css`)

The DIGIT core module's TopBar and home page elements are restyled via CSS overrides:

| Override target          | Change                                     |
| ------------------------ | ------------------------------------------ |
| `.navbar`                | Teal gradient background, white text       |
| `.navbar .logo`          | Inverted to white                          |
| `.SearchComponent`, etc. | Hidden (`display: none`) on the home page  |
| `.moduleLinkHomePage`    | Hidden — replaced by `HomeScreen.js` cards |
| `.sidebar`               | White background, teal hover states        |
| `.employee-home-btn`     | Hidden                                     |

---

## Card Components (Employee Home Page)

The employee home page renders a card for each enabled module using the **DIGIT Component Registry** convention: it calls `Digit.ComponentRegistryService.getComponent("{ModuleName}Card")` for every entry in `enabledModules`.

### `ModuleCard.js` _(New — Redesign)_

A reusable, design-system-agnostic card component used as the base for all module home-page cards.

**Props:**

| Prop         | Type                                 | Description                         |
| ------------ | ------------------------------------ | ----------------------------------- |
| `moduleName` | `string`                             | Card title text                     |
| `theme`      | `"hrms" \| "workbench" \| "default"` | Controls the header gradient colour |
| `Icon`       | `ReactNode`                          | Icon element shown in the header    |
| `kpis`       | `Array<KPI>`                         | Optional KPI rings to show stats    |
| `links`      | `Array<{label, link}>`               | Navigation links in the card body   |

**KPI shape:**

```js
{
  count: number | string,   // value shown in ring centre
  label: string,            // text below ring
  link: string,             // react-router path for the ring (optional)
  variant: "primary" | "accent",  // ring colour
  percent: number,          // 0–100 fill amount for the donut arc
}
```

> **Note on CSS:** Styles are defined as plain JS objects (inline styles) inside this file, **not** via an external `.css` import. This is because microbundle processes `.css` imports as CSS Modules and hashes all class names, which breaks plain `className` usage. The `ModuleCard.css` file in this folder is kept as a human-readable reference only.

> **Note on syntax:** Avoid the `??` nullish coalescing operator in source files — the project's Babel/Webpack config does not support it. Use `!= null ? x : default` instead.

---

### `hrmscard.js` _(Redesigned)_

Renders the HRMS module card on the employee home page.

- **Access guard:** uses `Digit.Utils.hrmsAccess()` — returns `null` if the user does not have the `HRMS_ADMIN` role
- **Data:** fetches employee counts via `Digit.Hooks.hrms.useHRMSCount(tenantId)`
- **Renders:** `<ModuleCard theme="hrms" ... />` with two KPI rings (Total / Active employees) and two navigation links

---

### `WorkbenchCard.js` _(New — Local override of npm package)_

A local implementation of the Workbench home-page card that **overrides** the version bundled inside `@egovernments/digit-ui-module-workbench`.

**Why this exists:**  
The Workbench module ships as a pre-built npm package (only `dist/index.js`). To redesign its card without forking the entire package, we register our own `WorkbenchCard` component in the HRMS module's `componentsToRegister` map. Because `initHRMSComponents()` is called **after** `initWorkbenchComponents()` in `example/src/index.js`, our local version wins in the Component Registry.

**Role logic:**  
Mirrors the npm version exactly — checks `Digit.Utils.didEmployeeHasAtleastOneRole(allRoles)` with:

| Feature      | Required Roles                                          |
| ------------ | ------------------------------------------------------- |
| MDMS         | `MDMS_ADMIN`, `EMPLOYEE`, `SUPERUSER`                   |
| Localisation | `EMPLOYEE`, `SUPERUSER`, `EMPLOYEE_COMMON`, `LOC_ADMIN` |
| DSS          | `STADMIN`                                               |

Links are also filtered per-user based on their roles (same as the npm version).

---

### `ModuleCard.css` _(Reference only)_

A human-readable CSS file documenting the full card design intent (gradients, hover effects, responsive grid, KPI ring styles). **Not loaded at runtime** due to the CSS Modules issue described above. Use it as a reference when modifying inline styles in `ModuleCard.js`.

---

## Shared Components

### `CustomTable.js` _(New — Reusable)_

A fully custom, reusable table component with built-in skeleton loading, pagination, hover states, and flexible column renderers. Designed to replace repeated table markup across multiple screens.

**Props:**

| Prop              | Type                             | Default              | Description                                                                                                                                              |
| ----------------- | -------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`         | `Array<Column>`                  | `[]`                 | Column definitions (see shape below)                                                                                                                     |
| `data`            | `Array<Object>`                  | `[]`                 | Row data                                                                                                                                                 |
| `isLoading`       | `boolean`                        | `false`              | Shows skeleton rows when true                                                                                                                            |
| `skeletonRows`    | `number`                         | `5`                  | Number of shimmer rows during loading                                                                                                                    |
| `emptyMessage`    | `string \| ReactNode`            | `"No records found"` | Shown when data is empty                                                                                                                                 |
| `showPagination`  | `boolean`                        | `true`               | Whether to show pagination footer at all                                                                                                                 |
| `showIndexColumn` | `boolean`                        | `true`               | Show auto-generated index column (`#`) as first column. Numbering continues across pages.                                                                |
| `dynamicPageSize` | `boolean \| number[]`            | `false`              | Show page-size selector. `true` → `[10,20,30,40,50]`; pass an array for custom options e.g. `[5,10,25,50]`. If `false`, page size is fixed (default 10). |
| `pagination`      | `PaginationConfig`               | —                    | Pagination state & callbacks (see shape below)                                                                                                           |
| `onRowClick`      | `(row, index) => void`           | —                    | Row click handler                                                                                                                                        |
| `rowHover`        | `boolean`                        | `true`               | Enable row hover highlight                                                                                                                               |
| `rowKey`          | `string \| (row, idx) => string` | —                    | Unique key for each row                                                                                                                                  |

**Column shape:**

```js
{
  key: string,           // unique column identifier
  label: string,         // header text (can also be ReactNode)
  width: string,         // optional CSS width (e.g. "48px")
  render: (row, idx) => ReactNode,  // custom cell renderer — return ANY JSX:
                                     // buttons, dropdowns, icons, links, etc.
  accessor: (row) => value,         // simple value extractor (ignored if render set)
  skeleton: {            // skeleton config for loading state
    type: "text" | "avatar-text",
    width: string,       // for type "text"
    widths: string[],    // for type "avatar-text" — [nameWidth, subWidth]
  },
}
```

**Pagination shape:**

```js
{
  currentPage: number,       // 0-based page index
  totalPages: number,
  pageSize: number,          // current rows per page (needed when dynamicPageSize is on)
  hasPrev: boolean,
  hasNext: boolean,
  onPrev: () => void,
  onNext: () => void,
  onPageChange: (page: number) => void,
  onPageSizeChange: (newSize: number) => void,  // required when dynamicPageSize is enabled
  totalRecords: number,      // optional — enables "Showing X–Y of Z" display
}
```

**Usage Examples:**

Fixed page size (no selector):

```jsx
<CustomTable
  columns={columns}
  data={employees}
  isLoading={loading}
  pagination={{ currentPage, totalPages, pageSize: 10, hasPrev, hasNext, onPrev, onNext, onPageChange }}
/>
```

Dynamic page size (with selector dropdown):

```jsx
<CustomTable
  columns={columns}
  data={employees}
  isLoading={loading}
  showPagination={true}
  dynamicPageSize={true}              {/* or dynamicPageSize={[5, 10, 25, 50]} */}
  pagination={{
    currentPage, totalPages, pageSize,
    hasPrev, hasNext, onPrev, onNext, onPageChange,
    onPageSizeChange: handlePageSizeChange,
    totalRecords: 85,
  }}
/>
```

No pagination:

```jsx
<CustomTable columns={columns} data={data} showPagination={false} />
```

> **Cell flexibility:** The `render` prop on any column accepts ANY JSX — action menus, dropdowns, icons, badges, links, nested components, etc. This means any cell can be a fully interactive widget, not just text.

> **Reusability:** This component is not HRMS-specific. It can be used on any screen that needs a data table with loading/pagination.

---

## Search Components (Employee Search)

### `SearchEmployeeScreen.js` _(Redesigned)_

A fully custom search screen that replaces DIGIT's built-in DesktopInbox/InboxFilter/SearchApplication combo. Uses modern React syntax (JSX, `const`/`let`, arrow functions, destructuring) and delegates table rendering to `CustomTable`.

**Props:**

| Prop               | Type       | Description                                       |
| ------------------ | ---------- | ------------------------------------------------- |
| `data`             | `Object`   | Employee search results from `useHRMSSearch` hook |
| `isLoading`        | `boolean`  | Loading state from search hook                    |
| `onFilterChange`   | `Function` | Filter change callback (receives filter params)   |
| `searchParams`     | `Object`   | Current search parameters                         |
| `currentPage`      | `number`   | Current page index (0-based)                      |
| `pageSizeLimit`    | `number`   | Number of records per page                        |
| `onNextPage`       | `Function` | Pagination next page callback                     |
| `onPrevPage`       | `Function` | Pagination previous page callback                 |
| `onPageSizeChange` | `Function` | Page size change callback                         |
| `totalRecords`     | `number`   | Total number of records available                 |

**Features:**

- **Unified search bar** — single input searching across name, phone, and ID fields with intelligent detection
- **Filter chips** — Status, Role, Court Establishment, ULB with dropdown overlays
- **Active filter pills** — removable tags showing applied filters
- **`CustomTable` integration** — column definitions with custom renderers for avatar, status badge, action menu
- **Semantic HTML** — uses `<header>` and `<section>` elements for better document structure
- **Modern syntax** — `const`/`let`, JSX, arrow functions, destructured props, template literals

**Internal sub-components:**

- `FilterChip` — dropdown chip button for a single filter dimension
- `getInitials()` — helper to extract name initials for avatar display

**Data Integration:**

```js
// MDMS fetched inside component for filter options
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation");
// Data fetching handled by parent Inbox.js
Digit.Hooks.hrms.useHRMSSearch(searchParams, tenantId, paginationParams);
```

**Usage Example:**

```jsx
<SearchEmployeeScreen
  data={data}
  isLoading={hookLoading}
  onFilterChange={handleFilterChange}
  searchParams={searchParams}
  currentPage={Math.floor(pageOffset / pageSize)}
  pageSizeLimit={pageSize}
  onNextPage={fetchNextPage}
  onPrevPage={fetchPrevPage}
  onPageSizeChange={handlePageSizeChange}
  totalRecords={totalRecords}
/>
```

---

## Employee Details Page

### `EmployeeDetails.js` _(Redesigned)_

Located at `src/pages/EmployeeDetails.js`. A fully custom employee details page that replaces DIGIT's built-in `Card`/`StatusTable`/`Row`/`ActionBar` layout with a modern, visually rich design using inline styles.

**Route:** `/:path/details/:tenantId/:id`

**Registered as:** `HRMSDetails` in `Module.js`

**Design Elements:**

- **Hero header card** — large avatar with initials, employee name, code, employment type, and status badge (green/red pill). Teal gradient accent bar at top.
- **Action buttons** — Edit (outlined teal) and Deactivate/Activate (red outlined or teal gradient) buttons directly in the hero header.
- **Deactivation banner** — orange warning-style banner shown only for inactive employees with effective date, reason, remarks, and order number.
- **Section cards** — rounded white cards with icon headers for Personal Details, Employment Details, Documents, Jurisdictions, and Assignments.
- **Detail grid** — responsive `auto-fill` grid layout for label-value pairs.
- **Sub-cards** — bordered cards within sections for individual jurisdictions and assignments, with teal index badges.
- **Document items** — clickable document cards with file icons that trigger download.
- **Role tags** — pill-style tags for each user role within assignment cards.
- **Back link** — arrow link to navigate back to the employee list.

**Sub-components:**

- **`DetailField`** — renders a label-value pair with uppercase gray label and dark value text.
- **`SectionCard`** — renders a white card with icon header bar and content body.
- **`getInitials()`** — extracts name initials for avatar display.

**Data Integration:**

```js
// Employee data fetched by employee code
Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId, null, isupdate);

// Document download
Digit.UploadServices.Filefetch([documentId], stateId);
```

**Actions:**

| Action     | Behavior                                                   |
| ---------- | ---------------------------------------------------------- |
| Edit       | Navigates to `/hrms/edit/:tenantId/:id`                    |
| Deactivate | Opens `ActionModal` with `DEACTIVATE_EMPLOYEE_HEAD` action |
| Activate   | Opens `ActionModal` with `ACTIVATE_EMPLOYEE_HEAD` action   |

**Styling:** All styles are inline (no CSS imports) using the same teal/gray colour token system as `SearchEmployeeScreen`. Key tokens: `TEAL (#0d6a82)`, `GREEN (#16a34a)`, `RED (#dc2626)`, `ORANGE (#ea580c)`.

---

## Employee Form (Create / Edit)

### `EmployeeForm.js` _(New)_

Located at `src/pages/EmployeeForm.js`. A unified form component that handles **both** Create Employee and Edit Employee flows in a single file. Replaces the old `createEmployee.js` + `EditEmployee/EditForm.js` + `FormComposer` combo with a fully custom modern UI using inline styles.

**Route detection:** Determines mode from URL — `/hrms/create` renders create mode, `/hrms/edit/:tenantId/:id` renders edit mode (pre-populates form with existing employee data).

**Registered as:** `HREmployeeForm` in `Module.js`

**Design Elements:**

- **Hero header card** — teal gradient accent bar, avatar with initials (edit mode), title + description.
- **Section cards** — rounded white cards with icon headers for Personal Details, Employee Details, Assignment Details.
- **Custom form inputs** — all inline-styled: text inputs, dropdowns with search, multi-select with checkboxes and removeable tags, date inputs.
- **Dynamic assignments** — add/remove assignment cards with teal index badges.
- **Cascading dropdowns** — District ↔ Court Establishment ↔ Courtroom auto-link.
- **Inline validation** — real-time error messages for name, phone, email patterns.
- **Phone duplicate check** — debounced API call to detect existing phone numbers.
- **Employee ID duplicate check** — on submit, checks for existing employee codes.
- **Submit / Cancel bar** — gradient primary submit button with disabled state, outlined cancel.
- **Toast notifications** — fixed-position error/success toasts with auto-dismiss.

**Sub-components (defined within file):**

| Component         | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `SectionCard`     | White card wrapper with icon header bar                          |
| `FormInput`       | Text input with label, prefix (e.g. +91), validation error, hint |
| `FormSelect`      | Searchable dropdown with outside-click close                     |
| `FormMultiSelect` | Multi-select with checkboxes, search, removeable tags            |
| `FormDate`        | Date input with min/max constraints                              |
| `ToastNotif`      | Fixed-position toast notification with auto-dismiss              |

**Data Integration:**

```js
// MDMS hooks (fetched at top level)
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation");
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "EmployeeType");

// Employee data (edit mode only)
Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId);

// Phone duplicate check
Digit.HRMSService.search(tenantId, null, { phone });

// Employee ID duplicate check (on submit)
Digit.HRMSService.search(tenantId, null, { codes: empCode });
```

**Submit flow:** Navigates to `/hrms/response` with the same `{ Employees, key, action }` state shape expected by `Response.js`. Supports `Digit.Customizations.HRMS.customiseCreateFormData` and `customiseUpdateFormData` hooks.

**Cascading dropdown logic:**

- **District selected** → filters Court Establishments; clears mismatched establishment/courtroom
- **Court Establishment selected** → auto-sets District; filters Courtrooms; clears mismatched courtroom
- **Courtroom selected** → auto-sets Court Establishment and District
