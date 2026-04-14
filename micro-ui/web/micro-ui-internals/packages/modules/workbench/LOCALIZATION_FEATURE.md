# Localization Management Feature

## Overview

A comprehensive localization management feature has been added to the Workbench module, allowing users to search, create, and update localization entries through an intuitive UI.

## Features Implemented

### 1. **Manage Localization** Option in Workbench Card

- Added a new option "Manage Localization" in the Workbench card on the home screen
- Accessible to users with roles: EMPLOYEE, SUPERUSER, EMPLOYEE_COMMON, LOC_ADMIN
- Located at: `/employee/workbench/localization-search`

### 2. **Localization Search Page** (`LocalizationSearch.js`)

**Route:** `/employee/workbench/localization-search`

**Features:**

- **Auto-load Data**: All localization entries load automatically on page mount
- **Pagination**:
  - Default page size: 100 entries (configurable to 50, 100, or 200)
  - Previous/Next navigation with page info
  - Shows "Showing 1-100 of 500 entries" format
- **Search & Filter**:
  - Real-time filtering by code or message text
  - Clear search button to reset filters
  - Refetch button to fetch latest data from server
  - Pagination resets when searching
- **Inline Editing**:
  - Click ✎ icon to edit directly in table cells
  - Save (✓) or Cancel (✕) buttons for inline edits
  - Edit icons appear on hover
- **Popup Editing**:
  - Click ⤢ icon to edit in modal dialog
  - Better for longer text entries
- **UI Enhancements**:
  - Wider table layout (1200px max width)
  - Modern card-based design
  - Toast notifications for success/error
  - Breadcrumb navigation back to home

**API Used:**

- `POST /localization/messages/v1/_search` (auto-called on mount, also used for refetch)
- `POST /localization/messages/v1/_update` (for inline/popup edits and bulk uploads)

### 3. **Localization Create Page** (`LocalizationCreate.js`)

**Route:** `/employee/workbench/localization-create`

**Features:**

- **Manual Entry Mode:**
  - Add multiple localization entries at once
  - Each entry requires: Code, Message, Module, Locale
  - "Add More" button to add additional rows
  - Remove button for each row (minimum 1 row required)
  - Validation for required fields
- **Default Values:**
  - Module defaults to "rainmaker-common"
  - Locale defaults to "en_IN"
  - New rows inherit same defaults
- **File Upload Option:**
  - "Upload File" button to navigate to bulk upload page
  - Alternative method for creating multiple entries
- **Bulk Creation:**
  - All entries are created in a single API call
  - Success/error toast notifications
  - Auto-redirect to search page on success

**API Used:**

- `POST /localization/messages/v1/_create`
- Body: `{ tenantId, messages: [{ code, message, module, locale }] }`

### 4. **Localization Upload Page** (`LocalizationUpload.js`)

**Route:** `/employee/workbench/localization-upload`

**Features:**

- **Excel File Upload:**
  - Drag and drop or click to browse
  - Accepts .xlsx and .xls files
  - File size display
- **Column Validation:**
  - Required columns (case-sensitive): **Code**, **Module**, **Message**, **Locale**
  - Validates column headers before parsing
  - Shows error toast if columns don't match
  - Prevents API call if validation fails
- **Data Preview:**
  - Shows first 10 entries in a table
  - Displays total entry count
  - Preview before uploading
- **Data Extraction:**
  - Parses Excel file using xlsx library
  - Filters out rows with missing required fields
  - Extracts data and formats for API call
- **Bulk Upload:**
  - Uploads all valid entries in single API call
  - Success/error toast notifications
  - Auto-redirect to search page on success
- **User Guidance:**
  - Info box with required format details
  - Clear instructions for column names
  - File format requirements

**API Used:**

- `POST /localization/messages/v1/_update` (handles both create and update)
- Body: `{ tenantId, locale, module, messages: [{ code, message }] }`
- Groups entries by locale/module for efficient processing

**Excel Format Requirements:**

| Code             | Module           | Message | Locale |
| ---------------- | ---------------- | ------- | ------ |
| CS_COMMON_SUBMIT | rainmaker-common | Submit  | en_IN  |
| CS_COMMON_CANCEL | rainmaker-common | Cancel  | en_IN  |

- Column headers must match exactly (case-sensitive)
- All four columns are required for each row
- Empty rows are automatically filtered out

### 5. **Removed: Localization View Page**

**Status:** ❌ **REMOVED**

The separate LocalizationView page has been removed to simplify the user experience. All editing functionality is now integrated directly into the LocalizationSearch page.

**Reason for Removal:**

- Streamlined user flow - single page for search and editing
- Reduced navigation complexity
- Better user experience with inline and popup editing on search page
- Maintained all editing capabilities (inline + popup) in search page

## API Hooks Created

### `useLocalizationSearch(tenantId, filters, config)`

- Fetches localization messages based on filters
- Filters: `locale`, `module`
- Returns: `{ isLoading, data: { messages } }`

### `useLocalizationCreate(tenantId)`

- Creates new localization entries
- Mutation hook for creating multiple messages
- Returns: `{ mutate, isLoading }`

### `useLocalizationUpdate(tenantId)`

- Updates existing localization entries
- Mutation hook for updating messages
- Returns: `{ mutate, isLoading }`

## Files Created/Modified

### New Files:

1. `/src/hooks/useLocalizationSearch.js` - API hooks for localization
2. `/src/pages/LocalizationSearch.js` - Search page with inline/popup editing
3. `/src/pages/LocalizationCreate.js` - Create page with default values
4. `/src/pages/LocalizationUpload.js` - Excel file upload page

### Removed Files:

1. `/src/pages/LocalizationView.js` - ❌ Removed (functionality moved to search page)

### Modified Files:

1. `/src/hooks/index.js` - Exported localization hooks
2. `/src/Module.js` - Registered localization components (removed LocalizationView, added LocalizationUpload)
3. `/src/pages/index.js` - Added localization routes (removed localization-view, added localization-upload)
4. `/../hrms/src/components/HomeScreen.js` - Added "Manage Localization" link to workbench card
5. `/../hrms/src/components/WorkbenchCard.js` - Updated with localization link (backup)

## Component Registry

Components registered with Digit.ComponentRegistryService:

- `WBLocalizationSearch` - Search and edit page
- `WBLocalizationCreate` - Create new entries (manual + upload option)
- `WBLocalizationUpload` - Excel file upload page
- ~~`WBLocalizationView`~~ - ❌ Removed

## Routes

All routes are under `/employee/workbench/`:

- `localization-search` - Main search page with editing capabilities
- `localization-create` - Create new entries manually
- `localization-upload` - Upload Excel file for bulk creation
- ~~`localization-view`~~ - ❌ Removed (functionality integrated into search page)

## Backend API Endpoints Required

The feature uses the following DIGIT localization service endpoints:

1. **Search:** `POST /localization/messages/v1/_search`
2. **Create:** `POST /localization/messages/v1/_create`
3. **Update:** `POST /localization/messages/v1/_update`

## User Flow

### **Simplified Workflow (Current)**

1. **Home Screen** → Click "Manage Localization" in Workbench card
2. **Search Page** → All data auto-loads with pagination (100 entries per page)
3. **Search & Filter** → Type to filter by code or message → Click "Clear" to reset
4. **Refresh Data** → Click "Refetch" to get latest data from server
5. **Edit Entries** → Click ✎ for inline edit OR ⤢ for popup edit → Save changes
6. **Create New** → Click "Create New" → Choose:
   - **Manual Entry**: Add entries with defaults → Click "Create"
   - **Upload File**: Click "Upload File" → Select Excel → Preview → Upload

### **Previous Workflow (Deprecated)**

1. ~~**Home Screen** → Click "Manage Localization" in Workbench card~~
2. ~~**Search Page** → Enter code or message text → Click Search~~
3. ~~**Search Results** → Click "View" on any entry~~
4. ~~**View Page** → Edit messages inline or in popup → Save~~
5. ~~**Create New** → Click "Create New" → Add entries → Click "Create"~~

### **Key Improvements**

- ✅ **Auto-load data** - No need to click search button
- ✅ **Pagination** - Handle large datasets efficiently
- ✅ **Single-page editing** - Edit directly in search results
- ✅ **Clear search** - Easy filter reset
- ✅ **Refetch data** - Get latest data from server without page reload
- ✅ **Default values** - Module defaults to "rainmaker-common", Locale to "en_IN"
- ✅ **Excel upload** - Bulk creation via file upload with validation
- ✅ **Column validation** - Prevents API calls with invalid Excel format
- ✅ **Data preview** - Review entries before uploading
- ✅ **Update API** - Uses update API for both create and update operations

## Design Patterns

- Follows existing MDMS design patterns
- Consistent color scheme (Teal primary, Gray neutrals)
- Modern card-based layouts
- Inline and popup editing (same as MDMS)
- Toast notifications for user feedback
- Breadcrumb navigation
- Responsive design

## Notes

- **Default Values**: Module defaults to "rainmaker-common", Locale defaults to "en_IN"
- **Pagination**: Default 100 entries per page (configurable to 50, 100, 200)
- **Auto-load**: Search API called automatically on page mount
- **Search**: Real-time filtering by code or message text
- **Clear Search**: Button to reset search filters
- **Refetch Data**: Button to fetch latest data from server without page reload
- **Editing**: Both inline (✎) and popup (⤢) editing available
- **Excel Upload**:
  - Supports .xlsx and .xls files
  - Required columns (case-sensitive): Code, Module, Message, Locale
  - Column validation before API call
  - Preview data before uploading
  - Uses update API (handles both create and update operations)
  - Groups entries by locale/module for efficient processing
  - Uses xlsx library (v0.17.5) for parsing
- **Removed**: Separate LocalizationView page - functionality integrated into search page
- **UI**: Wider table layout (1200px max width) for better content display
- **API**: All calls include `RequestInfo` with auth token
- **Error Handling**: Toast notifications for success/error feedback
- **Loading**: Loader component during API calls

## Dependencies

- **xlsx** (v0.17.5) - Excel file parsing for bulk upload feature
