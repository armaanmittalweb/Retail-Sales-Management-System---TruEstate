# Architecture

## Backend Architecture

- **Runtime / Framework**: Node.js + Express
- **Entry Point**: `backend/src/index.js`
- **Layers**:
  - **Routes (`routes/`)**: Define HTTP endpoints under `/api/sales`.
  - **Controllers (`controllers/`)**: Translate HTTP requests to service calls and return JSON responses.
  - **Services (`services/`)**: Business logic for search, filtering, sorting, and pagination.
  - **Utils (`utils/`)**:
    - `csvLoader.js`: Loads and normalizes the CSV file into structured records.
    - `filters.js`: Applies all filter predicates in one pass.
    - `sorter.js`: Applies sorting according to `sortBy` / `sortDir`.
    - `pagination.js`: Slices result sets and returns paging metadata.
    - `errors.js`: Contains a custom `BadRequestError` used for invalid ranges.

- **Data Loading**:
  - On startup, `index.js` calls `loadSalesData` with `data/sales.csv`.
  - Raw records are normalized in `salesService.normalizeSaleRecord` (parsing numbers, dates, and tags).
  - Filter options (unique regions, genders, categories, tags, payment methods) are precomputed and cached.

- **Key Endpoints**:
  - `GET /api/sales`
    - Query params: `search`, `region`, `gender`, `productCategory`, `tags`, `paymentMethod`, `ageMin`, `ageMax`, `dateFrom`, `dateTo`, `sortBy`, `sortDir`, `page`, `pageSize`.
    - Response: `{ data, total, page, pageSize, totalPages, hasNext, hasPrev, sortBy, sortDir, filters }`.
  - `GET /api/sales/filters`
    - Returns unique values for multi-select filters.

## Frontend Architecture

- **Runtime / Framework**: React (with Vite bundler).
- **Entry Point**: `frontend/src/main.jsx` → `App.jsx`.
- **Core Page**:
  - `pages/Dashboard.jsx`:
    - Owns all UI state: search term, filters, sorting, and pagination.
    - Builds query parameters and calls backend via `services/api.js`.
    - Renders the main layout: search bar, filter panel, toolbar, table, and pagination.

- **Components** (`src/components/`):
  - `SearchBar.jsx`: Controlled input for search term.
  - `FilterPanel.jsx`: Displays multi-select filters and numeric/date ranges; lifts state changes via `onChange`.
  - `SortDropdown.jsx`: Maps UX options to `sortBy`/`sortDir` combinations.
  - `SalesTable.jsx`: Tabular view of paginated sales data.
  - `PaginationControls.jsx`: Previous/Next navigation and range summary.

- **Services**:
  - `services/api.js`: Thin wrapper around Axios to call `/api/sales` and `/api/sales/filters`.

- **Styles**:
  - `styles/global.css`: Defines layout (header, sidebar, main section), table styling, filter controls, and responsive behaviour.
  - Layout mirrors the required structure: Search Bar, Filter Panel, Transaction Table, Sorting Dropdown, Pagination Controls.

## Data Flow

1. **Initial Load**:
   - Backend loads and normalizes CSV data at process startup.
   - Backend computes filter metadata for `/api/sales/filters`.

2. **Frontend Boot**:
   - `Dashboard` mounts and calls `fetchFilterOptions` once to populate the filter panel.
   - Initial query state is `{ sortBy: 'date', sortDir: 'desc', page: 1, pageSize: 10 }`.

3. **Query Execution**:
   - Whenever search, any filter, sorting, or page changes, `Dashboard` recomputes `queryParams` and calls `fetchSales`.
   - Backend:
     - Validates ranges (age, date) and throws `BadRequestError` for invalid values.
     - Applies search + all filters in `applyFilters`.
     - Applies sorting in `applySorting`.
     - Applies pagination in `paginate`.
     - Returns paginated data plus metadata.

4. **Rendering**:
   - `Dashboard` updates local state (`data`, `total`, `totalPages`).
   - `SalesTable` and `PaginationControls` render based on this state.
   - Edge cases:
     - No results → “No results found” message.
     - Errors → Error banner.
     - Conflicting filters → Valid request but zero-length result set.

## Folder Structure & Responsibilities

- `backend/src/index.js`
  - Compose Express app, load CSV, start server, register global error handler.

- `backend/src/routes/salesRoutes.js`
  - Declare `/api/sales` and `/api/sales/filters` endpoints.

- `backend/src/controllers/salesController.js`
  - Translate HTTP requests into service calls, return JSON.

- `backend/src/services/salesService.js`
  - Owns in-memory dataset.
  - Normalizes raw records.
  - Implements `getSales` (search + filter + sort + paginate).
  - Exposes `getFilterOptions` (precomputed filter metadata).

- `backend/src/utils/*.js`
  - Small, reusable utilities to keep service logic clean and testable.

- `frontend/src/pages/Dashboard.jsx`
  - Orchestrates state and data loading; top-level screen.

- `frontend/src/components/*.jsx`
  - Pure presentation and simple state handlers; reusable UI building blocks.

- `frontend/src/services/api.js`
  - Isolates HTTP layer from UI components.

This setup keeps concerns clearly separated, avoids duplicating filtering/sorting logic between frontend and backend, and matches how a production-grade SDE would structure a small but realistic feature.  

---

## 7. How to run & how to turn this into the submission

**Local run (monorepo way):**

```bash
# From root
npm install
npm run install-all   # if using workspaces; or install in backend/frontend separately

# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
