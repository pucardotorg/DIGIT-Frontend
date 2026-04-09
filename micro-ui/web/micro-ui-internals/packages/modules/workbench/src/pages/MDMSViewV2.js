import React, { useState, useEffect, useMemo, useRef, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";
import CustomTable from "../components/CustomTable";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const GREEN_BG = "#dcfce7";
const RED = "#dc2626";
const RED_BG = "#fee2e2";
const ORANGE = "#ea580c";
const ORANGE_BG = "#fff7ed";
const GRAY50 = "#f9fafb";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

/* ─────────────── inline styles ─────────────── */
const S = {
  page: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px 16px 80px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: GRAY500,
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "16px",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "20px",
  },
  titleWrap: {},
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: GRAY900,
    margin: "0 0 4px",
  },
  subtitle: {
    fontSize: "13px",
    color: GRAY500,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  },

  /* search / filter bar */
  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 1,
    minWidth: "240px",
    display: "flex",
    alignItems: "center",
    background: WHITE,
    borderRadius: "10px",
    border: "1px solid " + GRAY200,
    padding: "0 14px",
    height: "42px",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  searchBoxFocus: {
    borderColor: TEAL,
    boxShadow: `0 0 0 3px ${TEAL_LIGHT}`,
  },
  searchIcon: { marginRight: "10px", color: GRAY400, flexShrink: 0 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: GRAY700,
    background: "transparent",
    height: "100%",
  },

  /* column filter chip */
  chipBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "7px 12px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    background: WHITE,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: GRAY700,
    transition: "border-color 0.12s, background 0.12s",
  },
  chipBtnActive: {
    borderColor: TEAL,
    background: TEAL_LIGHT,
    color: TEAL,
    fontWeight: 600,
  },
  chipDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: "4px",
    background: WHITE,
    borderRadius: "10px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    border: "1px solid " + GRAY100,
    zIndex: 9990,
    minWidth: "200px",
    maxHeight: "260px",
    overflowY: "auto",
  },
  chipItem: {
    padding: "8px 14px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  chipItemHover: { background: TEAL_LIGHT },
  chipItemActive: { background: TEAL_LIGHT, color: TEAL, fontWeight: 600 },
  chipSearch: {
    width: "100%",
    padding: "8px 14px",
    border: "none",
    borderBottom: "1px solid " + GRAY100,
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },

  /* pills row */
  pillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "12px",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "14px",
    background: TEAL_LIGHT,
    color: TEAL,
    fontSize: "12px",
    fontWeight: 600,
  },
  pillX: {
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1,
  },

  /* status badges */
  badgeActive: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    background: GREEN_BG,
    color: GREEN,
  },
  badgeInactive: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    background: RED_BG,
    color: RED,
  },

  /* action buttons */
  clearBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    background: WHITE,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: GRAY700,
    transition: "background 0.12s",
    whiteSpace: "nowrap",
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  /* schema info card */
  schemaCard: {
    background: WHITE,
    borderRadius: "12px",
    border: "1px solid " + GRAY200,
    padding: "20px 24px",
    marginBottom: "16px",
  },
  schemaTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: GRAY900,
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  schemaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  schemaTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 12px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    fontSize: "12px",
    fontWeight: 500,
    color: GRAY700,
    background: GRAY50,
  },
  schemaType: {
    fontSize: "10px",
    fontWeight: 600,
    color: GRAY400,
    textTransform: "uppercase",
  },

  /* count badge */
  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
    height: "24px",
    borderRadius: "12px",
    background: TEAL_LIGHT,
    color: TEAL,
    fontSize: "12px",
    fontWeight: 700,
    padding: "0 6px",
  },
};

/* ─────────────── FilterChip sub-component ─────────────── */
const FilterChip = ({ label, options = [], selected, onSelect }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => String(o).toLowerCase().includes(q));
  }, [options, search]);

  const isActive = selected != null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" style={{ ...S.chipBtn, ...(isActive ? S.chipBtnActive : {}) }} onClick={() => setOpen(!open)}>
        {label}
        {isActive && <span>: {String(selected)}</span>}
        {!isActive && <span>&#9662;</span>}
      </button>
      {open && (
        <div style={S.chipDropdown}>
          {options.length > 8 && (
            <input style={S.chipSearch} type="text" placeholder="Filter..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
          )}
          {isActive && (
            <div
              style={{ ...S.chipItem, color: RED, fontWeight: 600 }}
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
            >
              &#10005; Clear filter
            </div>
          )}
          {filtered.map((val, idx) => {
            const isSelected = selected === val;
            return (
              <div
                key={String(val) + idx}
                style={{
                  ...S.chipItem,
                  ...(hoverIdx === idx ? S.chipItemHover : {}),
                  ...(isSelected ? S.chipItemActive : {}),
                }}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(-1)}
                onClick={() => {
                  onSelect(isSelected ? null : val);
                  setOpen(false);
                }}
              >
                {String(val)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────── helpers ─────────────── */
const getValueType = (val) => {
  if (val === null || val === undefined) return "null";
  if (typeof val === "boolean") return "boolean";
  if (typeof val === "number") return "number";
  if (Array.isArray(val)) return "array";
  if (typeof val === "object") return "object";
  return "string";
};

const renderCellValue = (val) => {
  if (val === null || val === undefined) return <span style={{ color: GRAY400, fontStyle: "italic" }}>—</span>;
  if (typeof val === "boolean") {
    return val ? <span style={S.badgeActive}>true</span> : <span style={S.badgeInactive}>false</span>;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return <span style={{ color: GRAY400 }}>[]</span>;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <span style={S.countBadge}>{val.length}</span>
        <span style={{ color: GRAY500, fontSize: "12px" }}>items</span>
      </span>
    );
  }
  if (typeof val === "object") {
    const keys = Object.keys(val);
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <span style={S.countBadge}>{keys.length}</span>
        <span style={{ color: GRAY500, fontSize: "12px" }}>keys</span>
      </span>
    );
  }
  const str = String(val);
  if (str.length > 60) return str.substring(0, 57) + "...";
  return str;
};

/* ═══════════════════════════════════════════════
   MDMSViewV2 — results screen
   ═══════════════════════════════════════════════ */
const MDMSViewV2 = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const moduleName = params.get("module");
  const masterName = params.get("master");

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  /* ── fetch MDMS data ── */
  useEffect(() => {
    if (!moduleName || !masterName) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        /* Try v2 search first */
        let records = [];
        try {
          const res = await Digit.CustomService.getResponse({
            url: "/egov-mdms-service/v2/_search",
            params: {},
            body: {
              MdmsCriteria: {
                tenantId: stateId || tenantId,
                schemaCode: `${moduleName}.${masterName}`,
                limit: 500,
                offset: 0,
              },
            },
          });
          if (res?.mdms && res.mdms.length > 0) {
            records = res.mdms.map((item) => {
              const { isActive: _innerIsActive, ...dataWithoutIsActive } = item.data || {};
              return {
                ...dataWithoutIsActive,
                isActive: item.isActive, // Use outer isActive (MDMS record status)
                _mdmsId: item.id,
                _mdmsUniqueIdentifier: item.uniqueIdentifier,
                _mdmsAuditDetails: item.auditDetails,
              };
            });
          }
        } catch {
          /* v2 failed, try v1 */
        }

        if (records.length === 0) {
          const res = await Digit.CustomService.getResponse({
            url: Digit.Urls?.MDMS || "/mdms-v2/v1/_search",
            params: {},
            body: {
              MdmsCriteria: {
                tenantId: stateId || tenantId,
                moduleDetails: [
                  {
                    moduleName: moduleName,
                    masterDetails: [{ name: masterName }],
                  },
                ],
              },
            },
          });
          const mdmsRes = res?.MdmsRes || {};
          records = (mdmsRes[moduleName] && mdmsRes[moduleName][masterName]) || [];
        }

        setRawData(Array.isArray(records) ? records : [records]);
      } catch (err) {
        console.error("MDMS fetch error:", err);
        setError(err?.message || "Failed to fetch data");
        setRawData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [moduleName, masterName, tenantId, stateId]);

  /* ── derive schema from data ── */
  const schema = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    const fieldMap = {};
    rawData.forEach((row) => {
      if (typeof row !== "object" || row === null) return;
      Object.keys(row).forEach((key) => {
        if (key.startsWith("_mdms")) return;
        if (!fieldMap[key]) {
          fieldMap[key] = { key, types: new Set() };
        }
        fieldMap[key].types.add(getValueType(row[key]));
      });
    });
    return Object.values(fieldMap).map((f) => ({
      key: f.key,
      types: Array.from(f.types),
    }));
  }, [rawData]);

  /* ── build column filter options ── */
  const filterableColumns = useMemo(() => {
    return schema
      .filter((col) => {
        const types = col.types;
        return types.includes("string") || types.includes("boolean") || types.includes("number");
      })
      .map((col) => {
        const uniqueVals = new Set();
        rawData.forEach((row) => {
          const val = row[col.key];
          if (val !== null && val !== undefined && typeof val !== "object" && !Array.isArray(val)) {
            uniqueVals.add(val);
          }
        });
        return { key: col.key, values: Array.from(uniqueVals).sort() };
      })
      .filter((col) => col.values.length > 1 && col.values.length <= 50);
  }, [schema, rawData]);

  /* ── filtered data ── */
  const filteredData = useMemo(() => {
    let data = rawData;

    /* text search */
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      data = data.filter((row) =>
        Object.entries(row).some(([k, v]) => {
          if (k.startsWith("_mdms")) return false;
          return v !== null && v !== undefined && String(v).toLowerCase().includes(q);
        })
      );
    }

    /* column filters */
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        data = data.filter((row) => {
          const cellVal = row[key];
          if (typeof val === "boolean") return cellVal === val;
          return String(cellVal) === String(val);
        });
      }
    });

    return data;
  }, [rawData, searchText, columnFilters]);

  /* ── pagination ── */
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const pagedData = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, columnFilters, pageSize]);

  /* ── table columns ── */
  const columns = useMemo(() => {
    return schema.map((col) => ({
      key: col.key,
      label: col.key,
      render: (row) => renderCellValue(row[col.key]),
    }));
  }, [schema]);

  /* ── active filter pills ── */
  const pills = Object.entries(columnFilters)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([key, val]) => ({
      key,
      label: `${key}: ${String(val)}`,
      clear: () => setColumnFilters((prev) => ({ ...prev, [key]: null })),
    }));

  const hasActiveFilters = searchText || pills.length > 0;

  const handleClear = () => {
    setSearchText("");
    setColumnFilters({});
  };

  /* ── row click ── */
  const handleRowClick = useCallback(
    (row, idx) => {
      const actualIdx = currentPage * pageSize + idx;
      history.push({
        pathname: `/${window?.contextPath}/employee/workbench/mdms-view-row`,
        search: `?module=${encodeURIComponent(moduleName)}&master=${encodeURIComponent(masterName)}&row=${actualIdx}`,
        state: { rowData: row },
      });
    },
    [history, moduleName, masterName, currentPage, pageSize]
  );

  if (!moduleName || !masterName) {
    return (
      <div style={S.page}>
        <p>Missing module or master name parameter.</p>
        <Link to={`/${window?.contextPath}/employee/workbench/manage-master-data`} style={S.backLink}>
          &larr; Back to search
        </Link>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ── back link ── */}
      <Link to={`/${window?.contextPath}/employee/workbench/manage-master-data`} style={S.backLink}>
        &larr; {t("WB_BACK_TO_SEARCH") || "Back to Search"}
      </Link>

      {/* ── header ── */}
      <div style={S.header}>
        <div style={S.titleWrap}>
          <h1 style={S.title}>{masterName}</h1>
          <p style={S.subtitle}>
            <span style={{ ...S.badge, background: TEAL_LIGHT, color: TEAL }}>{moduleName}</span>
            {!loading && <span style={S.countBadge}>{filteredData.length} records</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
           <button 
             type="button" 
             style={{ padding: "9px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`, color: WHITE }} 
             onClick={() => history.push(`/${window?.contextPath}/employee/workbench/mdms-add?module=${encodeURIComponent(moduleName)}&master=${encodeURIComponent(masterName)}`)}
           >
             &#43; {t("WB_ADD_MDMS") || "Add MDMS"}
           </button>
        </div>
      </div>

      {/* ── schema info ── */}
      {!loading && schema.length > 0 && (
        <div style={S.schemaCard}>
          <div style={S.schemaTitle}>
            <span>&#128203;</span> Schema ({schema.length} fields)
          </div>
          <div style={S.schemaGrid}>
            {schema.map((col) => (
              <div key={col.key} style={S.schemaTag}>
                <span>{col.key}</span>
                <span style={S.schemaType}>{col.types.join("|")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── filter bar ── */}
      {!loading && rawData.length > 0 && (
        <Fragment>
          <div style={S.filterBar}>
            <div style={{ ...S.searchBox, ...(focused ? S.searchBoxFocus : {}) }}>
              <span style={S.searchIcon}>&#128269;</span>
              <input
                style={S.searchInput}
                type="text"
                placeholder={t("WB_SEARCH_RECORDS") || "Search records..."}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </div>

            {filterableColumns.slice(0, 4).map((col) => (
              <FilterChip
                key={col.key}
                label={col.key}
                options={col.values}
                selected={columnFilters[col.key] ? columnFilters[col.key] : null}
                onSelect={(val) => setColumnFilters((prev) => ({ ...prev, [col.key]: val }))}
              />
            ))}

            <button
              type="button"
              style={{ ...S.clearBtn, ...(hasActiveFilters ? {} : S.btnDisabled) }}
              onClick={handleClear}
              disabled={!hasActiveFilters}
            >
              &#10005; {t("ES_COMMON_CLEAR_SEARCH") || "Clear"}
            </button>
          </div>

          {/* ── active pills ── */}
          {pills.length > 0 && (
            <div style={S.pillsRow}>
              {pills.map((p) => (
                <span key={p.key} style={S.pill}>
                  {p.label}
                  <span style={S.pillX} onClick={p.clear}>
                    &times;
                  </span>
                </span>
              ))}
            </div>
          )}
        </Fragment>
      )}

      {/* ── error ── */}
      {error && (
        <div style={{ padding: "20px", color: RED, background: RED_BG, borderRadius: "10px", marginBottom: "16px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── table ── */}
      <CustomTable
        columns={columns}
        data={pagedData}
        isLoading={loading}
        skeletonRows={pageSize}
        emptyMessage={t("COMMON_TABLE_NO_RECORD_FOUND") || "No records found"}
        rowKey={(row, idx) => row._mdmsId || row.code || row.id || idx}
        showPagination={filteredData.length > 0}
        showIndexColumn={true}
        dynamicPageSize={[10, 20, 30, 50]}
        onRowClick={handleRowClick}
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          hasPrev: currentPage > 0,
          hasNext: currentPage < totalPages - 1,
          onPrev: () => setCurrentPage((p) => Math.max(0, p - 1)),
          onNext: () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1)),
          onPageChange: (page) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(0);
          },
          totalRecords: filteredData.length,
        }}
      />
    </div>
  );
};

export default MDMSViewV2;
