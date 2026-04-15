import React, { useState, Fragment } from "react";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GRAY50 = "#f9fafb";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

/* ─────────────── inject shimmer keyframe once ── */
if (typeof document !== "undefined" && !document.getElementById("ct-shimmer-kf")) {
  const tag = document.createElement("style");
  tag.id = "ct-shimmer-kf";
  tag.textContent = "@keyframes ctShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}";
  document.head.appendChild(tag);
}

/* ─────────────── inline styles ─────────────── */
const styles = {
  wrap: {
    background: WHITE,
    borderRadius: "12px",
    overflowX: "auto",
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
    border: `1px solid ${GRAY200}`,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: `1px solid ${GRAY200}`,
    background: GRAY50,
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: GRAY700,
    borderBottom: `1px solid ${GRAY100}`,
    verticalAlign: "middle",
  },
  trHover: { background: GRAY50 },
  empty: {
    textAlign: "center",
    padding: "48px 20px",
    color: GRAY500,
    fontSize: "15px",
  },

  /* pagination footer */
  paginationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderTop: `1px solid ${GRAY100}`,
  },
  paginationLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: GRAY500,
  },
  paginationRight: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  pageSizeSelect: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: `1px solid ${GRAY200}`,
    background: WHITE,
    fontSize: "13px",
    color: GRAY700,
    cursor: "pointer",
    outline: "none",
    fontWeight: 500,
    transition: "border-color 0.15s",
  },
  pageSizeSelectFocus: {
    borderColor: TEAL,
  },
  pageBtn: {
    minWidth: "32px",
    height: "32px",
    border: `1px solid ${GRAY200}`,
    borderRadius: "6px",
    background: WHITE,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: GRAY700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.12s, border-color 0.12s",
  },
  pageBtnActive: {
    background: TEAL,
    borderColor: TEAL,
    color: WHITE,
    fontWeight: 700,
  },
  pageBtnDisabled: { opacity: 0.4, cursor: "default" },
  pageInfo: {
    fontSize: "13px",
    color: GRAY500,
    padding: "0 8px",
    whiteSpace: "nowrap",
  },

  /* skeleton base */
  skBar: {
    height: "14px",
    borderRadius: "6px",
    background: `linear-gradient(90deg, ${GRAY100} 25%, ${GRAY200} 50%, ${GRAY100} 75%)`,
    backgroundSize: "200% 100%",
    animation: "ctShimmer 1.5s infinite",
  },
  skCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: `linear-gradient(90deg, ${GRAY100} 25%, ${GRAY200} 50%, ${GRAY100} 75%)`,
    backgroundSize: "200% 100%",
    animation: "ctShimmer 1.5s infinite",
    flexShrink: 0,
  },
};

/* ════════════════════════════════════════════════
   SkeletonCell / SkeletonRows
   ════════════════════════════════════════════════ */
const SkeletonCell = ({ skeleton }) => {
  if (!skeleton) {
    return (
      <td style={styles.td}>
        <div style={{ ...styles.skBar, width: "80px" }} />
      </td>
    );
  }

  if (skeleton.type === "avatar-text") {
    const widths = skeleton.widths || ["120px", "80px"];
    return (
      <td style={styles.td}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={styles.skCircle} />
          <div style={{ flex: 1 }}>
            <div style={{ ...styles.skBar, width: widths[0], marginBottom: "6px" }} />
            <div style={{ ...styles.skBar, width: widths[1], height: "10px" }} />
          </div>
        </div>
      </td>
    );
  }

  return (
    <td style={styles.td}>
      <div style={{ ...styles.skBar, width: skeleton.width || "80px" }} />
    </td>
  );
};

const SkeletonRows = ({ columns, count }) =>
  Array.from({ length: count }, (_, i) => (
    <tr key={`sk-${i}`}>
      {columns.map((col, ci) => (
        <SkeletonCell key={ci} skeleton={col.skeleton} />
      ))}
    </tr>
  ));

/* ════════════════════════════════════════════════
   Pagination
   - Page size selector (left side, only when dynamicPageSize is enabled)
   - Page numbers + prev/next (right side)
   ════════════════════════════════════════════════ */
const Pagination = ({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  totalRecords,
}) => {
  const visibleCount = Math.min(totalPages, 5);
  let start = 0;
  if (totalPages > 5) {
    start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
  }

  const showPageSizeSelector = typeof onPageSizeChange === "function" && pageSizeOptions;

  /* display range: "Showing 1–10 of 85" */
  const rangeStart = currentPage * pageSize + 1;
  const rangeEnd = Math.min(rangeStart + pageSize - 1, totalRecords != null ? totalRecords : rangeStart + pageSize - 1);

  return (
    <div style={styles.paginationRow}>
      {/* ── left: rows per page ── */}
      <div style={styles.paginationLeft}>
        {showPageSizeSelector && (
          <>
            <span>Rows per page:</span>
            <select style={styles.pageSizeSelect} value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </>
        )}
        {totalRecords != null && (
          <span style={styles.pageInfo}>
            Showing {rangeStart}–{rangeEnd} of {totalRecords}
          </span>
        )}
      </div>

      {/* ── right: page numbers ── */}
      <div style={styles.paginationRight}>
        <button type="button" style={{ ...styles.pageBtn, ...(hasPrev ? {} : styles.pageBtnDisabled) }} disabled={!hasPrev} onClick={onPrev}>
          &#8249; Prev
        </button>

        {Array.from({ length: visibleCount }, (_, i) => {
          const page = start + i;
          return (
            <button
              key={page}
              type="button"
              style={{ ...styles.pageBtn, ...(page === currentPage ? styles.pageBtnActive : {}) }}
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
          );
        })}

        <button type="button" style={{ ...styles.pageBtn, ...(hasNext ? {} : styles.pageBtnDisabled) }} disabled={!hasNext} onClick={onNext}>
          Next &#8250;
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   CustomTable — reusable table component

   Props:
     columns          – Array<Column>          Column definitions
     data             – Array<Object>          Row data
     isLoading        – boolean                Show skeleton rows (default false)
     skeletonRows     – number                 Skeleton row count (default 5)
     emptyMessage     – string | ReactNode     Shown when data is empty
     showPagination   – boolean                Show pagination footer (default true)
     showIndexColumn  – boolean                Show auto-generated index column as first column (default true)
     dynamicPageSize  – boolean | number[]     Show page-size selector; true → [10,20,30,40,50];
                                                pass an array for custom options e.g. [5,10,25,50]
     pagination       – PaginationConfig       Pagination state & callbacks (see below)
     onRowClick       – (row, index) => void   Row click handler
     rowHover         – boolean                Enable row hover highlight (default true)
     rowKey           – string | (row, idx) => string

   Column shape:
     key      – unique identifier for the column
     label    – header text (can be string or ReactNode)
     width    – optional CSS width for <th>
     render   – (row, index) => ReactNode   Custom cell renderer — return ANY JSX:
                buttons, dropdowns, icons, links, nested components, etc.
     accessor – (row) => value              Simple value extractor (ignored if render is set)
     skeleton – { type: "text"|"avatar-text", width?: string, widths?: string[] }

   PaginationConfig shape:
     currentPage      – number (0-based)
     totalPages       – number
     pageSize         – number (current rows per page)
     hasPrev          – boolean
     hasNext          – boolean
     onPrev           – () => void
     onNext           – () => void
     onPageChange     – (page: number) => void
     onPageSizeChange – (newSize: number) => void   Required when dynamicPageSize is enabled
     totalRecords     – number (optional, for "Showing X–Y of Z" display)
   ════════════════════════════════════════════════ */
const CustomTable = ({
  columns = [],
  data = [],
  isLoading = false,
  skeletonRows: skeletonRowCount = 5,
  emptyMessage = "No records found",
  showPagination = true,
  showIndexColumn = true,
  dynamicPageSize = false,
  pagination,
  onRowClick,
  rowHover = true,
  rowKey,
}) => {
  const [hoverIdx, setHoverIdx] = useState(-1);

  const getRowKey = (row, idx) => {
    if (typeof rowKey === "function") return rowKey(row, idx);
    if (typeof rowKey === "string" && row[rowKey]) return row[rowKey];
    return idx;
  };

  /* resolve page size options */
  const pageSizeOptions = Array.isArray(dynamicPageSize) ? dynamicPageSize : dynamicPageSize ? DEFAULT_PAGE_SIZE_OPTIONS : null;

  const shouldShowPagination = showPagination && pagination && !isLoading && data.length > 0;

  /* prepend index column if enabled */
  const indexColumn = {
    key: "__index__",
    label: "#",
    width: "50px",
    render: (row, idx) => {
      const pageOffset = pagination && pagination.currentPage && pagination.pageSize ? pagination.currentPage * pagination.pageSize : 0;
      return <span style={{ color: GRAY500, fontWeight: 500 }}>{pageOffset + idx + 1}</span>;
    },
    skeleton: { type: "text", width: "20px" },
  };

  const finalColumns = showIndexColumn ? [indexColumn, ...columns] : columns;

  return (
    <div style={styles.wrap}>
      <table style={styles.table}>
        {/* ── head ── */}
        <thead>
          <tr>
            {finalColumns.map((col) => (
              <th key={col.key} style={{ ...styles.th, ...(col.width ? { width: col.width } : {}) }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── body ── */}
        <tbody>
          {isLoading ? (
            <SkeletonRows columns={finalColumns} count={skeletonRowCount} />
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={finalColumns.length} style={styles.empty}>
                {typeof emptyMessage === "string"
                  ? emptyMessage.split("\\n").map((line, i) => (
                      <p key={i} style={{ margin: "4px 0" }}>
                        {line}
                      </p>
                    ))
                  : emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={getRowKey(row, idx)}
                style={{
                  ...(rowHover && hoverIdx === idx ? styles.trHover : {}),
                  ...(onRowClick ? { cursor: "pointer" } : {}),
                }}
                onMouseEnter={() => rowHover && setHoverIdx(idx)}
                onMouseLeave={() => rowHover && setHoverIdx(-1)}
                onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
              >
                {finalColumns.map((col) => (
                  <td key={col.key} style={styles.td}>
                    {col.render ? col.render(row, idx) : col.accessor ? col.accessor(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ── pagination footer ── */}
      {shouldShowPagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize || 10}
          hasPrev={pagination.hasPrev}
          hasNext={pagination.hasNext}
          onPrev={pagination.onPrev}
          onNext={pagination.onNext}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pageSizeOptions ? pagination.onPageSizeChange : null}
          pageSizeOptions={pageSizeOptions}
          totalRecords={pagination.totalRecords}
        />
      )}
    </div>
  );
};

export default CustomTable;
