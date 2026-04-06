# HRMS Components — `src/components/`

This folder contains all shared and feature-specific UI components for the HRMS module.

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

## Search Components (Employee Search)

### `SearchEmployeeScreen.js` _(New — Redesign)_

A fully custom search screen that replaces DIGIT's built-in DesktopInbox/InboxFilter/SearchApplication combo for maximum design flexibility.

**Props:**

| Prop               | Type       | Description                                       |
| ------------------ | ---------- | ------------------------------------------------- |
| `data`             | `Object`   | Employee search results from `useHRMSSearch` hook |
| `isLoading`        | `boolean`  | Loading state from search hook                    |
| `onSearch`         | `Function` | Search callback (receives search params)          |
| `onFilterChange`   | `Function` | Filter change callback (receives filter params)   |
| `searchParams`     | `Object`   | Current search parameters                         |
| `currentPage`      | `number`   | Current page index (0-based)                      |
| `pageSizeLimit`    | `number`   | Number of records per page                        |
| `onNextPage`       | `Function` | Pagination next page callback                     |
| `onPrevPage`       | `Function` | Pagination previous page callback                 |
| `onPageSizeChange` | `Function` | Page size change callback                         |
| `totalRecords`     | `number`   | Total number of records available                 |

**Features:**

- **Unified search bar** - Single input searching across name, phone, and ID fields with intelligent detection
- **Filter chips** - Status, Role, Court Establishment, ULB with dropdown overlays and active state indicators
- **Active filter pills** - Removable tags showing applied filters with clear buttons
- **Enhanced table** - Avatar with initials, grouped name+ID, designation, court establishment, status badges
- **Skeleton loading** - Shimmer rows during data fetch for smooth perceived performance
- **Modern pagination** - Page number buttons with Previous/Next navigation and disabled states
- **+ Create Employee button** - Prominent call-to-action linking to employee creation page
- **Responsive design** - Mobile-friendly layout with proper hover states and transitions

**Data Integration:**
The component uses existing DIGIT hooks without modification:

```js
// Data fetching (handled by parent Inbox.js)
Digit.Hooks.hrms.useHRMSSearch(searchParams, tenantId, paginationParams)
Digit.Hooks.hrms.useHRMSCount(tenantId)
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation")

// Filter options from MDMS
- Status: Active/Inactive from translation keys
- Roles: From ACCESSCONTROL-ROLES MDMS data
- Court Establishment: From common-masters MDMS data
- ULB: From user's accessible cities
```

**Technical Implementation:**

- Uses inline styles (no CSS imports) due to microbundle CSS Modules constraints
- Implements debounced search (400ms) to reduce API calls
- Intelligent search detection (numeric → phone, alphabetic → name, other → employee ID)
- Proper cleanup of event listeners and timers
- Accessibility support with ARIA labels and keyboard navigation

**Usage Example:**

```js
// In Inbox.js desktop view
<SearchEmployeeScreen
  data={data}
  isLoading={hookLoading}
  onSearch={handleFilterChange}
  onFilterChange={handleFilterChange}
  searchParams={searchParams}
  currentPage={Math.floor(pageOffset / pageSize)}
  pageSizeLimit={pageSize}
  onNextPage={fetchNextPage}
  onPrevPage={fetchPrevPage}
  totalRecords={totalRecords}
/>
```
