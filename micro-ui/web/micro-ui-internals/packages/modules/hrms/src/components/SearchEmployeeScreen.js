import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { getCityThatUserhasAccess } from "./Utils";

/* ─────────────── colour tokens ─────────────── */
var TEAL = "#0d6a82";
var TEAL_LIGHT = "#e8f4f6";
var ORANGE = "#f97316";
var GREEN = "#16a34a";
var GREEN_BG = "#dcfce7";
var RED = "#dc2626";
var RED_BG = "#fee2e2";
var GRAY50 = "#f9fafb";
var GRAY100 = "#f3f4f6";
var GRAY200 = "#e5e7eb";
var GRAY400 = "#9ca3af";
var GRAY500 = "#6b7280";
var GRAY700 = "#374151";
var GRAY900 = "#111827";
var WHITE = "#ffffff";

/* ─────────────── inline styles ─────────────── */
var s = {
  /* wrapper */
  page: { padding: "0", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },

  /* top row: header + create btn */
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" },
  heading: { fontSize: "22px", fontWeight: 700, color: GRAY900, margin: 0 },
  createBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, " + TEAL + " 0%, #1aabb8 100%)",
    color: WHITE, fontSize: "14px", fontWeight: 600, textDecoration: "none",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 2px 8px rgba(13,106,130,0.25)",
  },

  /* search bar */
  searchRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" },
  searchBox: {
    flex: 1, minWidth: "240px", display: "flex", alignItems: "center",
    background: WHITE, borderRadius: "10px", border: "1px solid " + GRAY200,
    padding: "0 14px", height: "44px", transition: "border-color 0.15s, box-shadow 0.15s",
  },
  searchBoxFocus: { borderColor: TEAL, boxShadow: "0 0 0 3px " + TEAL_LIGHT },
  searchIcon: { marginRight: "10px", color: GRAY400, flexShrink: 0 },
  searchInput: {
    flex: 1, border: "none", outline: "none", fontSize: "14px", color: GRAY700,
    background: "transparent", height: "100%",
  },

  /* filter chip btns */
  chipBtn: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "8px 14px", borderRadius: "8px", border: "1px solid " + GRAY200,
    background: WHITE, cursor: "pointer", fontSize: "13px", fontWeight: 500,
    color: GRAY700, transition: "border-color 0.15s, background 0.15s",
    position: "relative", whiteSpace: "nowrap",
  },
  chipBtnActive: { borderColor: TEAL, color: TEAL, background: TEAL_LIGHT },

  /* dropdown overlay */
  dropdown: {
    position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
    background: WHITE, borderRadius: "10px", border: "1px solid " + GRAY200,
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: "200px", maxHeight: "260px",
    overflowY: "auto", padding: "6px",
  },
  dropItem: {
    padding: "8px 12px", borderRadius: "6px", cursor: "pointer",
    fontSize: "13px", color: GRAY700, transition: "background 0.12s",
  },
  dropItemHover: { background: GRAY100 },
  dropItemActive: { background: TEAL_LIGHT, color: TEAL, fontWeight: 600 },

  /* active filter pills */
  pillsRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" },
  pill: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
    background: TEAL_LIGHT, color: TEAL, cursor: "default",
  },
  pillX: { cursor: "pointer", fontWeight: 700, fontSize: "14px", lineHeight: 1, marginLeft: "2px" },

  /* table */
  tableWrap: {
    background: WHITE, borderRadius: "12px", overflow: "hidden",
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "1px solid " + GRAY200,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: 600,
    color: GRAY500, textTransform: "uppercase", letterSpacing: "0.5px",
    borderBottom: "1px solid " + GRAY200, background: GRAY50,
  },
  td: { padding: "14px 16px", fontSize: "14px", color: GRAY700, borderBottom: "1px solid " + GRAY100 },
  trHover: { background: GRAY50 },

  /* avatar */
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 700,
    fontSize: "13px", color: WHITE, background: "linear-gradient(135deg, " + TEAL + ", #1aabb8)",
    flexShrink: 0,
  },
  empCell: { display: "flex", alignItems: "center", gap: "10px" },
  empName: { fontWeight: 600, color: GRAY900, fontSize: "14px", lineHeight: 1.3 },
  empId: { fontSize: "12px", color: GRAY500 },

  /* status badge */
  badgeActive: {
    display: "inline-block", padding: "3px 10px", borderRadius: "12px",
    fontSize: "12px", fontWeight: 600, color: GREEN, background: GREEN_BG,
  },
  badgeInactive: {
    display: "inline-block", padding: "3px 10px", borderRadius: "12px",
    fontSize: "12px", fontWeight: 600, color: RED, background: RED_BG,
  },

  /* action menu */
  actionBtn: {
    background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
    borderRadius: "6px", fontSize: "18px", color: GRAY400, transition: "background 0.12s, color 0.12s",
  },

  /* pagination */
  paginationRow: {
    display: "flex", justifyContent: "flex-end", alignItems: "center",
    gap: "4px", padding: "14px 16px",
  },
  pageBtn: {
    minWidth: "32px", height: "32px", border: "1px solid " + GRAY200,
    borderRadius: "6px", background: WHITE, cursor: "pointer",
    fontSize: "13px", fontWeight: 500, color: GRAY700,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.12s, border-color 0.12s",
  },
  pageBtnActive: { background: TEAL, borderColor: TEAL, color: WHITE, fontWeight: 700 },
  pageBtnDisabled: { opacity: 0.4, cursor: "default" },

  /* skeleton */
  skeleton: {
    height: "14px", borderRadius: "6px",
    background: "linear-gradient(90deg, " + GRAY100 + " 25%, " + GRAY200 + " 50%, " + GRAY100 + " 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  skeletonAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(90deg, " + GRAY100 + " 25%, " + GRAY200 + " 50%, " + GRAY100 + " 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },

  /* empty state */
  empty: { textAlign: "center", padding: "48px 20px", color: GRAY500, fontSize: "15px" },
};

/* inject shimmer keyframe once */
if (typeof document !== "undefined" && !document.getElementById("shimmer-keyframes")) {
  var styleSheet = document.createElement("style");
  styleSheet.id = "shimmer-keyframes";
  styleSheet.textContent = "@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}";
  document.head.appendChild(styleSheet);
}

/* ─────────────── helper: initials ─────────────── */
function getInitials(name) {
  if (!name) return "?";
  var parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

/* ─────────────── sub-component: FilterChip ─────────────── */
function FilterChip(props) {
  var label = props.label;
  var options = props.options || [];
  var selected = props.selected;
  var onSelect = props.onSelect;
  var optionKey = props.optionKey || "name";
  var ref = useRef(null);
  var _s = useState(false), open = _s[0], setOpen = _s[1];
  var _h = useState(-1), hoverIdx = _h[0], setHoverIdx = _h[1];

  // close on outside click
  useEffect(function () {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return function () { document.removeEventListener("mousedown", handler); };
  }, []);

  var isActive = selected != null;

  return React.createElement("div", { ref: ref, style: { position: "relative" } },
    React.createElement("button", {
      type: "button",
      style: Object.assign({}, s.chipBtn, isActive ? s.chipBtnActive : {}),
      onClick: function () { setOpen(!open); },
    }, label, " ▾"),
    open && React.createElement("div", { style: s.dropdown },
      options.map(function (opt, idx) {
        var isSelected = selected && (selected.code === opt.code);
        return React.createElement("div", {
          key: opt.code || idx,
          style: Object.assign({}, s.dropItem, hoverIdx === idx ? s.dropItemHover : {}, isSelected ? s.dropItemActive : {}),
          onMouseEnter: function () { setHoverIdx(idx); },
          onMouseLeave: function () { setHoverIdx(-1); },
          onClick: function () { onSelect(isSelected ? null : opt); setOpen(false); },
        }, opt[optionKey] || opt.name || opt.code);
      })
    )
  );
}

/* ─────────────── sub-component: SkeletonRows ──────────────── */
function SkeletonRows(props) {
  var count = props.count || 5;
  var rows = [];
  for (var i = 0; i < count; i++) {
    rows.push(
      React.createElement("tr", { key: i },
        React.createElement("td", { style: s.td },
          React.createElement("div", { style: s.empCell },
            React.createElement("div", { style: s.skeletonAvatar }),
            React.createElement("div", { style: { flex: 1 } },
              React.createElement("div", { style: Object.assign({}, s.skeleton, { width: "120px", marginBottom: "6px" }) }),
              React.createElement("div", { style: Object.assign({}, s.skeleton, { width: "80px", height: "10px" }) })
            )
          )
        ),
        React.createElement("td", { style: s.td }, React.createElement("div", { style: Object.assign({}, s.skeleton, { width: "100px" }) })),
        React.createElement("td", { style: s.td }, React.createElement("div", { style: Object.assign({}, s.skeleton, { width: "110px" }) })),
        React.createElement("td", { style: s.td }, React.createElement("div", { style: Object.assign({}, s.skeleton, { width: "60px" }) })),
        React.createElement("td", { style: s.td }, React.createElement("div", { style: Object.assign({}, s.skeleton, { width: "20px" }) }))
      )
    );
  }
  return React.createElement(React.Fragment, null, rows);
}

/* ═══════════════════════════════════════════════
   SearchEmployeeScreen — main component
   ═══════════════════════════════════════════════ */
var SearchEmployeeScreen = function (props) {
  var data = props.data;
  var isLoading = props.isLoading;
  var onSearch = props.onSearch;
  var onFilterChange = props.onFilterChange;
  var searchParams = props.searchParams || {};
  var currentPage = props.currentPage || 0;
  var pageSize = props.pageSizeLimit || 10;
  var onNextPage = props.onNextPage;
  var onPrevPage = props.onPrevPage;
  var onPageSizeChange = props.onPageSizeChange;
  var totalRecords = props.totalRecords;

  var t = useTranslation().t;
  var history = useHistory();
  var tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");
  var tenantId = Digit.ULBService.getCurrentTenantId();

  // MDMS for filters
  var mdmsResult = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation");
  var mdmsData = mdmsResult.data;

  // local state
  var _sText = useState(""), searchText = _sText[0], setSearchText = _sText[1];
  var _sFocus = useState(false), focused = _sFocus[0], setFocused = _sFocus[1];

  // filter selections
  var _fStatus = useState(null), filterStatus = _fStatus[0], setFilterStatus = _fStatus[1];
  var _fUlb = useState(null), filterUlb = _fUlb[0], setFilterUlb = _fUlb[1];
  var _fCourt = useState(null), filterCourt = _fCourt[0], setFilterCourt = _fCourt[1];
  var _fRole = useState(null), filterRole = _fRole[0], setFilterRole = _fRole[1];

  // hover state for table rows
  var _hRow = useState(-1), hoverRow = _hRow[0], setHoverRow = _hRow[1];

  // employee list
  var employees = (data && data.Employees) || [];

  /* ──── filter options ──── */
  var statusOptions = [
    { code: true, name: t("HR_ACTIVATE_HEAD") },
    { code: false, name: t("HR_DEACTIVATE_HEAD") },
  ];

  var cityOptions = getCityThatUserhasAccess(tenantIds || [])
    .sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); })
    .map(function (c) { return Object.assign({}, c, { i18text: Digit.Utils.locale.getCityLocale(c.code) }); });

  var courtOptions = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["common-masters"] && mdmsData.MdmsRes["common-masters"].CourtEstablishment
    ? Digit.Utils.locale.convertToLocaleData(mdmsData.MdmsRes["common-masters"].CourtEstablishment, "COMMON_MASTERS_COURT_ESTABLISHMENT")
    : [];

  var roleOptions = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["ACCESSCONTROL-ROLES"] && mdmsData.MdmsRes["ACCESSCONTROL-ROLES"].roles
    ? Digit.Utils.locale.convertToLocaleData(mdmsData.MdmsRes["ACCESSCONTROL-ROLES"].roles, "ACCESSCONTROL_ROLES_ROLES", t)
    : [];

  /* ──── apply search ──── */
  var applySearch = useCallback(function () {
    var params = {};
    var delKeys = [];

    // unified text — try to determine what user typed
    var text = searchText.trim();
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

    // filters
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

  /* debounced search on text change */
  useEffect(function () {
    var timer = setTimeout(function () { applySearch(); }, 400);
    return function () { clearTimeout(timer); };
  }, [searchText, filterStatus, filterUlb, filterCourt, filterRole]);

  /* ──── active pills ──── */
  var pills = [];
  if (filterStatus != null) pills.push({ key: "status", label: t("HR_EMP_STATUS_LABEL") + ": " + filterStatus.name, clear: function () { setFilterStatus(null); } });
  if (filterUlb != null) pills.push({ key: "ulb", label: t("HR_ULB_LABEL") + ": " + (filterUlb.i18text ? t(filterUlb.i18text) : filterUlb.name), clear: function () { setFilterUlb(null); } });
  if (filterCourt != null) pills.push({ key: "court", label: t("HR_COURT_ESTABLISHMENT_LABEL") + ": " + (filterCourt.i18text ? t(filterCourt.i18text) : filterCourt.name), clear: function () { setFilterCourt(null); } });
  if (filterRole != null) pills.push({ key: "role", label: t("HR_COMMON_TABLE_COL_ROLE") + ": " + (filterRole.i18text ? t(filterRole.i18text) : filterRole.name), clear: function () { setFilterRole(null); } });

  /* ──── pagination calc ──── */
  var totalPages = totalRecords ? Math.ceil(totalRecords / pageSize) : (employees.length === pageSize ? currentPage + 2 : currentPage + 1);

  /* ──── render ──── */
  return React.createElement("div", { style: s.page },
    /* top row */
    React.createElement("div", { style: s.topRow },
      React.createElement("h2", { style: s.heading }, t("HR_HOME_SEARCH_RESULTS_HEADING")),
      React.createElement(Link, {
        to: "/" + (window.contextPath || "digit-ui") + "/employee/hrms/create",
        style: s.createBtn,
      }, "+ ", t("HR_COMMON_CREATE_EMPLOYEE_HEADER"))
    ),

    /* search row */
    React.createElement("div", { style: s.searchRow },
      React.createElement("div", { style: Object.assign({}, s.searchBox, focused ? s.searchBoxFocus : {}) },
        React.createElement("span", { style: s.searchIcon }, "\uD83D\uDD0D"),
        React.createElement("input", {
          style: s.searchInput,
          type: "text",
          placeholder: t("HR_NAME_LABEL") + ", " + t("HR_MOB_NO_LABEL") + ", " + t("HR_EMPLOYEE_ID_LABEL") + "...",
          value: searchText,
          onChange: function (e) { setSearchText(e.target.value); },
          onFocus: function () { setFocused(true); },
          onBlur: function () { setFocused(false); },
        })
      ),
      /* filter chips */
      React.createElement(FilterChip, { label: t("HR_EMP_STATUS_LABEL"), options: statusOptions, selected: filterStatus, onSelect: setFilterStatus, optionKey: "name" }),
      React.createElement(FilterChip, { label: t("HR_COMMON_TABLE_COL_ROLE"), options: roleOptions, selected: filterRole, onSelect: setFilterRole, optionKey: "i18text" }),
      React.createElement(FilterChip, { label: t("HR_COURT_ESTABLISHMENT_LABEL"), options: courtOptions, selected: filterCourt, onSelect: setFilterCourt, optionKey: "i18text" }),
      React.createElement(FilterChip, { label: t("HR_ULB_LABEL"), options: cityOptions, selected: filterUlb, onSelect: setFilterUlb, optionKey: "i18text" })
    ),

    /* active filter pills */
    pills.length > 0 && React.createElement("div", { style: s.pillsRow },
      pills.map(function (p) {
        return React.createElement("span", { key: p.key, style: s.pill },
          p.label,
          React.createElement("span", { style: s.pillX, onClick: p.clear }, "\u00d7")
        );
      })
    ),

    /* table */
    React.createElement("div", { style: s.tableWrap },
      React.createElement("table", { style: s.table },
        React.createElement("thead", null,
          React.createElement("tr", null,
            React.createElement("th", { style: s.th }, t("HR_EMP_NAME_LABEL")),
            React.createElement("th", { style: s.th }, t("HR_DESG_LABEL")),
            React.createElement("th", { style: s.th }, t("HR_COURT_ESTABLISHMENT_LABEL")),
            React.createElement("th", { style: s.th }, t("HR_STATUS_LABEL")),
            React.createElement("th", { style: Object.assign({}, s.th, { width: "48px" }) }, "")
          )
        ),
        React.createElement("tbody", null,
          isLoading
            ? React.createElement(SkeletonRows, { count: pageSize })
            : employees.length === 0
              ? React.createElement("tr", null,
                  React.createElement("td", { colSpan: 5, style: s.empty },
                    t("COMMON_TABLE_NO_RECORD_FOUND").split("\\n").map(function (line, i) {
                      return React.createElement("p", { key: i, style: { margin: "4px 0" } }, line);
                    })
                  )
                )
              : employees.map(function (emp, idx) {
                  var name = emp.user && emp.user.name || "";
                  var code = emp.code || "";
                  var roles = emp.user && emp.user.roles || [];
                  var assignments = (emp.assignments || []).sort(function (a, b) { return new Date(a.fromDate) - new Date(b.fromDate); });
                  var designation = assignments[0] && assignments[0].designation
                    ? t("COMMON_MASTERS_DESIGNATION_" + assignments[0].designation) : "";
                  var court = assignments[0] && assignments[0].courtEstablishment
                    ? t("COMMON_MASTERS_COURT_ESTABLISHMENT_" + assignments[0].courtEstablishment) : "";
                  var isActive = emp.isActive;
                  var detailsLink = "/" + (window.contextPath || "digit-ui") + "/employee/hrms/details/" + emp.tenantId + "/" + code;

                  return React.createElement("tr", {
                    key: code || idx,
                    style: hoverRow === idx ? s.trHover : {},
                    onMouseEnter: function () { setHoverRow(idx); },
                    onMouseLeave: function () { setHoverRow(-1); },
                  },
                    /* Employee (avatar + name + id) */
                    React.createElement("td", { style: s.td },
                      React.createElement(Link, { to: detailsLink, style: { textDecoration: "none" } },
                        React.createElement("div", { style: s.empCell },
                          React.createElement("div", { style: s.avatar }, getInitials(name)),
                          React.createElement("div", null,
                            React.createElement("div", { style: s.empName }, name),
                            React.createElement("div", { style: s.empId }, code)
                          )
                        )
                      )
                    ),
                    /* Designation */
                    React.createElement("td", { style: s.td }, designation),
                    /* Court */
                    React.createElement("td", { style: s.td }, court),
                    /* Status */
                    React.createElement("td", { style: s.td },
                      React.createElement("span", { style: isActive ? s.badgeActive : s.badgeInactive },
                        isActive ? t("ACTIVE") : t("INACTIVE")
                      )
                    ),
                    /* Action */
                    React.createElement("td", { style: s.td },
                      React.createElement("button", {
                        type: "button",
                        style: s.actionBtn,
                        title: t("HR_VIEW_DETAILS") || "View Details",
                        onClick: function () { history.push(detailsLink); },
                      }, "\u22EE")
                    )
                  );
                })
        )
      ),

      /* pagination */
      !isLoading && employees.length > 0 && React.createElement("div", { style: s.paginationRow },
        React.createElement("button", {
          type: "button",
          style: Object.assign({}, s.pageBtn, currentPage === 0 ? s.pageBtnDisabled : {}),
          disabled: currentPage === 0,
          onClick: onPrevPage,
        }, "\u2039 Prev"),
        Array.from({ length: Math.min(totalPages, 5) }, function (_, i) {
          var page = i;
          // show pages around current for large sets
          if (totalPages > 5) {
            var start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
            page = start + i;
          }
          return React.createElement("button", {
            key: page,
            type: "button",
            style: Object.assign({}, s.pageBtn, page === currentPage ? s.pageBtnActive : {}),
            onClick: function () {
              if (page > currentPage) { for (var c = 0; c < page - currentPage; c++) onNextPage(); }
              if (page < currentPage) { for (var c = 0; c < currentPage - page; c++) onPrevPage(); }
            },
          }, page + 1);
        }),
        React.createElement("button", {
          type: "button",
          style: Object.assign({}, s.pageBtn, employees.length < pageSize ? s.pageBtnDisabled : {}),
          disabled: employees.length < pageSize,
          onClick: onNextPage,
        }, "Next \u203A")
      )
    )
  );
};

export default SearchEmployeeScreen;
