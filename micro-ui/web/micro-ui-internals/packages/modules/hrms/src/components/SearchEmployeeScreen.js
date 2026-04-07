import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { getCityThatUserhasAccess } from "./Utils";
import CustomTable from "./CustomTable";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const GREEN_BG = "#dcfce7";
const RED = "#dc2626";
const RED_BG = "#fee2e2";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

/* ─────────────── inline styles ─────────────── */
const styles = {
  page: {
    padding: "0",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  /* header row */
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  heading: { fontSize: "22px", fontWeight: 700, color: GRAY900, margin: 0 },
  createBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 2px 8px rgba(13,106,130,0.25)",
  },

  /* search bar */
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 1,
    minWidth: "240px",
    display: "flex",
    alignItems: "center",
    background: WHITE,
    borderRadius: "10px",
    border: `1px solid ${GRAY200}`,
    padding: "0 14px",
    height: "44px",
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

  /* filter chip buttons */
  chipBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    background: WHITE,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: GRAY700,
    transition: "border-color 0.15s, background 0.15s",
    position: "relative",
    whiteSpace: "nowrap",
  },
  chipBtnActive: { borderColor: TEAL, color: TEAL, background: TEAL_LIGHT },

  /* dropdown overlay */
  dropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    zIndex: 50,
    background: WHITE,
    borderRadius: "10px",
    border: `1px solid ${GRAY200}`,
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
    minWidth: "200px",
    maxHeight: "260px",
    overflowY: "auto",
    padding: "6px",
  },
  dropItem: {
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: GRAY700,
    transition: "background 0.12s",
  },
  dropItemHover: { background: GRAY100 },
  dropItemActive: { background: TEAL_LIGHT, color: TEAL, fontWeight: 600 },

  /* active filter pills */
  pillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
    background: TEAL_LIGHT,
    color: TEAL,
    cursor: "default",
  },
  pillX: {
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: 1,
    marginLeft: "2px",
  },

  /* table cell renderers */
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "13px",
    color: WHITE,
    background: `linear-gradient(135deg, ${TEAL}, #1aabb8)`,
    flexShrink: 0,
  },
  empCell: { display: "flex", alignItems: "center", gap: "10px" },
  empName: { fontWeight: 600, color: GRAY900, fontSize: "14px", lineHeight: 1.3 },
  empId: { fontSize: "12px", color: GRAY500 },
  badgeActive: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    color: GREEN,
    background: GREEN_BG,
  },
  badgeInactive: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    color: RED,
    background: RED_BG,
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "18px",
    color: GRAY400,
    transition: "background 0.12s, color 0.12s",
  },

  /* search action buttons */
  searchActionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "transform 0.15s, box-shadow 0.15s, opacity 0.15s",
    whiteSpace: "nowrap",
  },
  searchBtn: {
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    boxShadow: "0 2px 6px rgba(13,106,130,0.2)",
  },
  clearBtn: {
    background: WHITE,
    color: GRAY700,
    border: `1px solid ${GRAY200}`,
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

/* ─────────────── helper: initials ─────────────── */
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

/* ─────────────── sub-component: FilterChip ─────────────── */
const FilterChip = ({ label, options = [], selected, onSelect, optionKey = "name" }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = selected != null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" style={{ ...styles.chipBtn, ...(isActive ? styles.chipBtnActive : {}) }} onClick={() => setOpen(!open)}>
        {label} &#9662;
      </button>
      {open && (
        <div style={styles.dropdown}>
          {options.map((opt, idx) => {
            const isSelected = selected && selected.code === opt.code;
            return (
              <div
                key={opt.code != null ? String(opt.code) : idx}
                style={{
                  ...styles.dropItem,
                  ...(hoverIdx === idx ? styles.dropItemHover : {}),
                  ...(isSelected ? styles.dropItemActive : {}),
                }}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(-1)}
                onClick={() => {
                  onSelect(isSelected ? null : opt);
                  setOpen(false);
                }}
              >
                {opt[optionKey] || opt.name || opt.code}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SearchEmployeeScreen — main component
   ═══════════════════════════════════════════════ */
const SearchEmployeeScreen = ({
  data,
  isLoading,
  onFilterChange,
  searchParams = {},
  currentPage: currentPageProp = 0,
  pageSizeLimit = 10,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  totalRecords,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: mdmsData } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation");

  /* ──── local state ──── */
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterUlb, setFilterUlb] = useState(null);
  const [filterCourt, setFilterCourt] = useState(null);
  const [filterRole, setFilterRole] = useState(null);

  const employees = (data && data.Employees) || [];
  const pageSize = pageSizeLimit;
  const currentPage = currentPageProp;

  /* ──── filter options ──── */
  const statusOptions = [
    { code: true, name: t("HR_ACTIVATE_HEAD") },
    { code: false, name: t("HR_DEACTIVATE_HEAD") },
  ];

  const cityOptions = getCityThatUserhasAccess(tenantIds || [])
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .map((c) => ({ ...c, i18text: Digit.Utils.locale.getCityLocale(c.code) }));

  const mdmsRes = mdmsData && mdmsData.MdmsRes;

  const courtOptions =
    mdmsRes && mdmsRes["common-masters"] && mdmsRes["common-masters"].CourtEstablishment
      ? Digit.Utils.locale.convertToLocaleData(mdmsRes["common-masters"].CourtEstablishment, "COMMON_MASTERS_COURT_ESTABLISHMENT")
      : [];

  const roleOptions =
    mdmsRes && mdmsRes["ACCESSCONTROL-ROLES"] && mdmsRes["ACCESSCONTROL-ROLES"].roles
      ? Digit.Utils.locale.convertToLocaleData(mdmsRes["ACCESSCONTROL-ROLES"].roles, "ACCESSCONTROL_ROLES_ROLES", t)
      : [];

  /* ──── apply search ──── */
  const applySearch = useCallback(() => {
    const params = {};
    const delKeys = [];
    const text = searchText.trim();

    if (text) {
      if (/^\d+$/.test(text) && text.length <= 10) {
        params.phone = text;
        delKeys.push("names", "codes");
      } else if (/^[A-Za-z]/.test(text)) {
        params.names = text;
        delKeys.push("phone", "codes");
      } else {
        params.codes = text;
        delKeys.push("names", "phone");
      }
    } else {
      delKeys.push("names", "phone", "codes");
    }

    if (filterStatus != null) params.isActive = filterStatus.code;
    else delKeys.push("isActive");

    if (filterUlb != null) params.tenantId = filterUlb.code;

    if (filterCourt != null) params.CourtEstablishment = filterCourt.code;
    else delKeys.push("CourtEstablishment");

    if (filterRole != null) params.roles = filterRole.code;
    else delKeys.push("roles");

    params.delete = delKeys;
    onFilterChange(params);
  }, [searchText, filterStatus, filterUlb, filterCourt, filterRole, onFilterChange]);

  /* debounced search removed - using manual search only to prevent pagination reset issues */

  /* ──── manual search/clear handlers ──── */
  const handleManualSearch = () => {
    applySearch();
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilterStatus(null);
    setFilterUlb(null);
    setFilterCourt(null);
    setFilterRole(null);
    // Manually trigger search after clearing filters
    setTimeout(() => {
      const params = { delete: ["names", "phone", "codes", "isActive", "CourtEstablishment", "roles"] };
      onFilterChange(params);
    }, 0);
  };

  const hasActiveFilters = searchText || filterStatus || filterUlb || filterCourt || filterRole;

  /* ──── active pills ──── */
  const pills = [];
  if (filterStatus != null) {
    pills.push({ key: "status", label: `${t("HR_EMP_STATUS_LABEL")}: ${filterStatus.name}`, clear: () => setFilterStatus(null) });
  }
  if (filterUlb != null) {
    pills.push({
      key: "ulb",
      label: `${t("HR_ULB_LABEL")}: ${filterUlb.i18text ? t(filterUlb.i18text) : filterUlb.name}`,
      clear: () => setFilterUlb(null),
    });
  }
  if (filterCourt != null) {
    pills.push({
      key: "court",
      label: `${t("HR_COURT_ESTABLISHMENT_LABEL")}: ${filterCourt.i18text ? t(filterCourt.i18text) : filterCourt.name}`,
      clear: () => setFilterCourt(null),
    });
  }
  if (filterRole != null) {
    pills.push({
      key: "role",
      label: `${t("HR_COMMON_TABLE_COL_ROLE")}: ${filterRole.i18text ? t(filterRole.i18text) : filterRole.name}`,
      clear: () => setFilterRole(null),
    });
  }

  /* ──── pagination calc ──── */
  const totalPages = totalRecords ? Math.ceil(totalRecords / pageSize) : employees.length === pageSize ? currentPage + 2 : currentPage + 1;

  /* ──── table column definitions ──── */
  const columns = [
    {
      key: "employee",
      label: t("HR_EMP_NAME_LABEL"),
      skeleton: { type: "avatar-text", widths: ["120px", "80px"] },
      render: (emp) => {
        const name = (emp.user && emp.user.name) || "";
        const code = emp.code || "";
        const detailsLink = `/${window.contextPath || "digit-ui"}/employee/hrms/details/${emp.tenantId}/${code}`;
        return (
          <Link to={detailsLink} style={{ textDecoration: "none" }}>
            <div style={styles.empCell}>
              <div style={styles.avatar}>{getInitials(name)}</div>
              <div>
                <div style={styles.empName}>{name}</div>
                <div style={styles.empId}>{code}</div>
              </div>
            </div>
          </Link>
        );
      },
    },
    {
      key: "designation",
      label: t("HR_DESG_LABEL"),
      skeleton: { type: "text", width: "100px" },
      accessor: (emp) => {
        const assignments = (emp.assignments || []).sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
        return assignments[0] && assignments[0].designation ? t("COMMON_MASTERS_DESIGNATION_" + assignments[0].designation) : "";
      },
    },
    {
      key: "court",
      label: t("HR_COURT_ESTABLISHMENT_LABEL"),
      skeleton: { type: "text", width: "110px" },
      accessor: (emp) => {
        const assignments = (emp.assignments || []).sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
        return assignments[0] && assignments[0].courtEstablishment
          ? t("COMMON_MASTERS_COURT_ESTABLISHMENT_" + assignments[0].courtEstablishment)
          : "";
      },
    },
    {
      key: "status",
      label: t("HR_STATUS_LABEL"),
      skeleton: { type: "text", width: "60px" },
      render: (emp) => <span style={emp.isActive ? styles.badgeActive : styles.badgeInactive}>{emp.isActive ? t("ACTIVE") : t("INACTIVE")}</span>,
    },
    {
      key: "actions",
      label: "",
      width: "48px",
      skeleton: { type: "text", width: "20px" },
      render: (emp) => {
        const code = emp.code || "";
        const detailsLink = `/${window.contextPath || "digit-ui"}/employee/hrms/details/${emp.tenantId}/${code}`;
        return (
          <button
            type="button"
            style={styles.actionBtn}
            title={t("HR_VIEW_DETAILS") || "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              history.push(detailsLink);
            }}
          >
            &#8594;
          </button>
        );
      },
    },
  ];

  /* ──── render ──── */
  return (
    <div style={styles.page}>
      {/* ── header row ── */}
      <header style={styles.topRow}>
        <h2 style={styles.heading}>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</h2>
        <Link to={`/${window.contextPath || "digit-ui"}/employee/hrms/create`} style={styles.createBtn}>
          + {t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}
        </Link>
      </header>

      {/* ── search + filters ── */}
      <section>
        <div style={styles.searchRow}>
          <div style={{ ...styles.searchBox, ...(focused ? styles.searchBoxFocus : {}) }}>
            <span style={styles.searchIcon}>&#128269;</span>
            <input
              style={styles.searchInput}
              type="text"
              placeholder={`${t("HR_NAME_LABEL")}, ${t("HR_MOB_NO_LABEL")}, ${t("HR_EMPLOYEE_ID_LABEL")}...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleManualSearch();
              }}
            />
          </div>
          <FilterChip label={t("HR_EMP_STATUS_LABEL")} options={statusOptions} selected={filterStatus} onSelect={setFilterStatus} optionKey="name" />
          <FilterChip
            label={t("HR_COMMON_TABLE_COL_ROLE")}
            options={roleOptions}
            selected={filterRole}
            onSelect={setFilterRole}
            optionKey="i18text"
          />
          <FilterChip
            label={t("HR_COURT_ESTABLISHMENT_LABEL")}
            options={courtOptions}
            selected={filterCourt}
            onSelect={setFilterCourt}
            optionKey="i18text"
          />
          <FilterChip label={t("HR_ULB_LABEL")} options={cityOptions} selected={filterUlb} onSelect={setFilterUlb} optionKey="i18text" />

          {/* Search button */}
          <button
            type="button"
            style={{
              ...styles.searchActionBtn,
              ...styles.searchBtn,
            }}
            onClick={handleManualSearch}
            title="Apply filters"
          >
            &#128269; {t("ES_COMMON_SEARCH") || "Search"}
          </button>

          {/* Clear Search button */}
          <button
            type="button"
            style={{
              ...styles.searchActionBtn,
              ...styles.clearBtn,
              ...(hasActiveFilters ? {} : styles.btnDisabled),
            }}
            onClick={handleClearSearch}
            disabled={!hasActiveFilters}
            title="Clear all filters"
          >
            &#10005; {t("ES_COMMON_CLEAR_SEARCH") || "Clear"}
          </button>
        </div>

        {/* ── active filter pills ── */}
        {pills.length > 0 && (
          <div style={styles.pillsRow}>
            {pills.map((p) => (
              <span key={p.key} style={styles.pill}>
                {p.label}
                <span style={styles.pillX} onClick={p.clear}>
                  &times;
                </span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── results table ── */}
      <section>
        <CustomTable
          columns={columns}
          data={employees}
          isLoading={isLoading}
          skeletonRows={pageSize}
          emptyMessage={t("COMMON_TABLE_NO_RECORD_FOUND")}
          rowKey={(emp) => emp.code || undefined}
          showPagination={true}
          showIndexColumn={true}
          dynamicPageSize={true}
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            hasPrev: currentPage > 0,
            hasNext: employees.length >= pageSize,
            onPrev: onPrevPage,
            onNext: onNextPage,
            onPageSizeChange,
            totalRecords,
            onPageChange: (page) => {
              if (page > currentPage) {
                for (let c = 0; c < page - currentPage; c++) onNextPage();
              }
              if (page < currentPage) {
                for (let c = 0; c < currentPage - page; c++) onPrevPage();
              }
            },
          }}
        />
      </section>
    </div>
  );
};

export default SearchEmployeeScreen;
