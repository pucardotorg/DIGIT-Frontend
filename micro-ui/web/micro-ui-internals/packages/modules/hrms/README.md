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

| File                                     | Change                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/SearchEmployeeScreen.js` | **New.** Custom search screen with unified search bar, filter chips, active filter pills, avatar-enhanced table, and skeleton loading. |
| `src/pages/Inbox.js`                     | **Modified.** Uses `SearchEmployeeScreen` instead of `DesktopInbox` for desktop view.                                                  |

### Design Features

- **Unified search bar** - Single text input searching across name, phone, and ID fields
- **Filter chip buttons** - Status, Role, Court Establishment, ULB with dropdown overlays
- **Active filter pills** - Removable tags below search bar showing applied filters
- **Enhanced table rows** - Avatar with initials, grouped name+ID, status badges, action menus
- **Skeleton loading** - Shimmer rows for smoother perceived performance
- **Modern pagination** - Page number buttons with Previous/Next navigation
- **+ Create Employee button** - Prominent call-to-action in top-right corner

### Data Flow

The existing DIGIT hooks and API calls remain unchanged - only the presentation layer is replaced:

```
Digit.Hooks.hrms.useHRMSSearch(searchParams, tenantId, paginationParams)
Digit.Hooks.hrms.useHRMSCount(tenantId)
Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation")
```

### Technical Notes

- Uses inline styles (no CSS imports) due to microbundle CSS Modules constraints
- Maintains compatibility with existing filter and pagination logic
- Fully responsive design with hover states and smooth transitions
- Accessibility support with proper ARIA labels and keyboard navigation
