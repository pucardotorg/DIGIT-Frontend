import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";

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

/* ─────────────── inline styles ─────────────── */
const S = {
  page: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px 16px 80px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  breadcrumb: {
    marginBottom: "20px",
  },
  breadcrumbLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: GRAY500,
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 0.15s",
  },
  breadcrumbLinkHover: {
    color: TEAL,
  },
  heroCard: {
    background: WHITE,
    borderRadius: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    padding: "0",
    marginBottom: "24px",
    position: "relative",
    overflow: "hidden",
  },
  heroAccent: {
    height: "4px",
    background: `linear-gradient(90deg, ${TEAL} 0%, #1aabb8 100%)`,
  },
  heroBody: {
    padding: "28px 32px",
  },
  heroIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: TEAL_LIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    marginBottom: "16px",
    color: TEAL,
  },
  heroTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: GRAY900,
    margin: "0 0 6px",
  },
  heroSub: {
    fontSize: "14px",
    color: GRAY500,
    margin: 0,
    lineHeight: 1.5,
  },

  /* form card */
  formCard: {
    background: WHITE,
    borderRadius: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    padding: "28px 32px",
    marginBottom: "24px",
  },

  /* search input */
  searchInputWrap: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    color: GRAY400,
    fontSize: "18px",
  },
  searchInput: {
    width: "100%",
    padding: "16px 20px 16px 48px",
    fontSize: "16px",
    borderRadius: "12px",
    border: `2px solid ${GRAY200}`,
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  searchInputFocus: {
    borderColor: TEAL,
    boxShadow: `0 0 0 4px ${TEAL_LIGHT}`,
  },

  /* results table */
  tableWrap: {
    marginTop: "24px",
    border: `1px solid ${GRAY200}`,
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: GRAY50,
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    borderBottom: `1px solid ${GRAY200}`,
  },
  tr: {
    transition: "background 0.15s",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: GRAY900,
    borderBottom: `1px solid ${GRAY100}`,
  },

  /* generic buttons */
  btnPrimary: {
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    padding: "10px 24px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(13,106,130,0.18)",
    transition: "transform 0.12s, box-shadow 0.12s",
    whiteSpace: "nowrap",
    marginTop: "4px",
  },

  /* recent searches */
  recentSection: {
    marginTop: "8px",
  },
  recentTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: GRAY500,
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  recentGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  recentChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    background: GRAY50,
    fontSize: "13px",
    color: GRAY700,
    cursor: "pointer",
    transition: "background 0.12s, border-color 0.12s",
    fontWeight: 500,
  },
  recentChipHover: {
    borderColor: TEAL,
    background: TEAL_LIGHT,
    color: TEAL,
  },
  emptyState: {
    padding: "32px",
    textAlign: "center",
    color: GRAY500,
    fontSize: "14px",
  },

  /* drop-down override styles */
  ddWrap: { position: "relative" },
  ddBtn: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    fontSize: "14px",
    color: GRAY900,
    background: WHITE,
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  ddBtnFocus: { borderColor: TEAL },
  ddPanel: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    background: WHITE,
    borderRadius: "10px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    border: `1px solid ${GRAY100}`,
    zIndex: 9990,
    maxHeight: "280px",
    display: "flex",
    flexDirection: "column",
  },
  ddSearch: {
    width: "100%",
    padding: "10px 14px",
    border: "none",
    borderBottom: `1px solid ${GRAY100}`,
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: "10px 10px 0 0",
  },
  ddItem: { padding: "9px 14px", fontSize: "13px", cursor: "pointer", transition: "background 0.1s" },
  ddItemHover: { background: TEAL_LIGHT },
  ddItemActive: { background: TEAL_LIGHT, color: TEAL, fontWeight: 600 },
};

/* ─────────────── SearchDropdown sub-component ─────────────── */
const SearchDropdown = ({ label, required, options = [], selected, onSelect, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoverIdx, setHoverIdx] = useState(-1);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: GRAY500, textTransform: "uppercase", letterSpacing: "0.4px" }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <div ref={ref} style={S.ddWrap}>
        <button
          type="button"
          style={{ ...S.ddBtn, ...(open ? S.ddBtnFocus : {}), ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}) }}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <span style={selected ? {} : { color: GRAY400 }}>{selected || placeholder || "Select..."}</span>
          <span style={{ color: GRAY400 }}>&#9662;</span>
        </button>
        {open && (
          <div style={S.ddPanel}>
            <input style={S.ddSearch} type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "16px 14px", fontSize: "13px", color: GRAY400, textAlign: "center" }}>No matches found</div>
              ) : (
                filtered.map((opt, idx) => {
                  const isSelected = selected === opt;
                  return (
                    <div
                      key={opt}
                      style={{
                        ...S.ddItem,
                        ...(hoverIdx === idx ? S.ddItemHover : {}),
                        ...(isSelected ? S.ddItemActive : {}),
                      }}
                      onMouseEnter={() => setHoverIdx(idx)}
                      onMouseLeave={() => setHoverIdx(-1)}
                      onClick={() => {
                        onSelect(opt);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      {opt}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Table Row Component with Hover effect
   ═══════════════════════════════════════════════ */
const ResultRow = ({ moduleName, masterName, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <tr
      style={{ ...S.tr, ...(hover ? { background: GRAY50, cursor: "pointer" } : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <td style={S.td}>{moduleName}</td>
      <td style={S.td}>
        <span style={{ fontWeight: 600, color: TEAL }}>{masterName}</span>
      </td>
      <td style={{ ...S.td, textAlign: "right", color: GRAY400 }}>&rarr;</td>
    </tr>
  );
};

/* ═══════════════════════════════════════════════
   MDMSSearchV2 — main component
   ═══════════════════════════════════════════════ */
const MDMSSearchV2 = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const [globalSearch, setGlobalSearch] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("WB_MDMS_RECENT") || "[]");
    } catch {
      return [];
    }
  });

  /* ── fetch MDMS data using custom hook ── */
  const { isLoading: loading, data: mdmsData } = Digit.Hooks.workbench.useWorkbenchMDMS(stateId || tenantId);
  const allData = mdmsData?.moduleMap || null;
  console.log("allData", allData, mdmsData);

  /* ── derived selections ── */
  const moduleNames = useMemo(() => (allData ? Object.keys(allData).sort() : []), [allData]);
  const masterNames = useMemo(() => {
    if (!selectedModule || !allData || !allData[selectedModule]) return [];
    return allData[selectedModule];
  }, [selectedModule, allData]);

  const handleModuleChange = (mod) => {
    setSelectedModule(mod);
    setSelectedMaster(null);
  };

  /* ── flatten into pairs: [ { module: 'x', master: 'y' } ] ── */
  const allPairs = useMemo(() => {
    if (!allData) return [];
    let pairs = [];
    Object.keys(allData).forEach((mod) => {
      allData[mod].forEach((mas) => {
        pairs.push({ module: mod, master: mas });
      });
    });
    return pairs;
  }, [allData]);

  /* ── filter based on global search & dropdowns ── */
  const filteredPairs = useMemo(() => {
    let result = allPairs;

    if (selectedModule) {
      result = result.filter((p) => p.module === selectedModule);
    }
    if (selectedMaster) {
      result = result.filter((p) => p.master === selectedMaster);
    }

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.module.toLowerCase().includes(q) ||
          q.includes(p.module.toLowerCase()) ||
          p.master.toLowerCase().includes(q) ||
          q.includes(p.master.toLowerCase())
      );
    }
    return result.slice(0, 50); // Show max 50 to prevent huge dom
  }, [globalSearch, selectedModule, selectedMaster, allPairs]);

  const isFiltering = globalSearch.trim() !== "" || selectedModule !== null || selectedMaster !== null;

  /* ── handlers ── */
  const handleSelect = (moduleName, masterName) => {
    /* save to recent searches */
    const entry = { module: moduleName, master: masterName };
    const newRecent = [entry, ...recentSearches.filter((r) => !(r.module === entry.module && r.master === entry.master))].slice(0, 8);
    setRecentSearches(newRecent);
    try {
      sessionStorage.setItem("WB_MDMS_RECENT", JSON.stringify(newRecent));
    } catch {}

    /* navigate to results */
    history.push(
      `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(moduleName)}&master=${encodeURIComponent(masterName)}`
    );
  };

  const handleRecentClick = (entry) => {
    handleSelect(entry.module, entry.master);
  };

  if (loading) {
    return (
      <div style={S.page}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ── breadcrumb navigation ── */}
      <div style={S.breadcrumb}>
        <a
          href={`/${window?.contextPath}/employee/home`}
          style={S.breadcrumbLink}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/${window?.contextPath}/employee/home`);
          }}
        >
          &larr; {t("WB_HOME") || "Home"}
        </a>
      </div>

      {/* ── hero card ── */}
      <div style={S.heroCard}>
        <div style={S.heroAccent} />
        <div style={S.heroBody}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={S.heroIcon}>&#128218;</div>
              <h1 style={S.heroTitle}>{t("WB_MDMS_SEARCH_TITLE") || "Master Data Management"}</h1>
              <p style={S.heroSub}>
                {t("WB_MDMS_SEARCH_DESC") || "Search and browse MDMS configuration data. Select a module and master name to view records."}
              </p>
            </div>
            <button
              type="button"
              style={{ ...S.btn, ...S.btnPrimary, whiteSpace: "nowrap", marginTop: "4px" }}
              onClick={() => history.push(`/${window?.contextPath}/employee/workbench/mdms-create`)}
            >
              &#43; {t("WB_CREATE_NEW") || "Create New"}
            </button>
          </div>
        </div>
      </div>

      {/* ── search form ── */}
      <div style={S.formCard}>
        {/* Dropdowns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <SearchDropdown
            label={t("WB_MODULE_NAME") || "Module Name"}
            options={moduleNames}
            selected={selectedModule}
            onSelect={handleModuleChange}
            placeholder={t("WB_SELECT_MODULE") || "Select module..."}
          />
          <SearchDropdown
            label={t("WB_MASTER_NAME") || "Master Name"}
            options={masterNames}
            selected={selectedMaster}
            onSelect={setSelectedMaster}
            placeholder={selectedModule ? t("WB_SELECT_MASTER") || "Select master..." : t("WB_SELECT_MODULE_FIRST") || "Select a module first"}
            disabled={!selectedModule}
          />
        </div>

        {/* separator */}
        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", color: GRAY400 }}>
          <div style={{ flex: 1, height: "1px", background: GRAY200 }}></div>
          <span style={{ padding: "0 12px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>OR / AND</span>
          <div style={{ flex: 1, height: "1px", background: GRAY200 }}></div>
        </div>

        <div style={S.searchInputWrap}>
          <span style={S.searchIcon}>&#128269;</span>
          <input
            type="text"
            placeholder={t("WB_GLOBAL_SEARCH_PLACEHOLDER") || "Global Search module or master name... (e.g. 'department' or 'common')"}
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            style={{
              ...S.searchInput,
              ...(inputFocus ? S.searchInputFocus : {}),
            }}
          />
        </div>

        {isFiltering && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                color: GRAY500,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                setGlobalSearch("");
                setSelectedModule(null);
                setSelectedMaster(null);
              }}
            >
              {t("ES_COMMON_CLEAR_SEARCH") || "Clear Filters"}
            </button>
          </div>
        )}

        {/* ── search results table ── */}
        {isFiltering && (
          <div style={S.tableWrap}>
            {filteredPairs.length > 0 ? (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>{t("WB_MODULE_NAME") || "Module"}</th>
                    <th style={S.th} colSpan="2">
                      {t("WB_MASTER_NAME") || "Master"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPairs.map((p, idx) => (
                    <ResultRow
                      key={`${p.module}-${p.master}-${idx}`}
                      moduleName={p.module}
                      masterName={p.master}
                      onClick={() => handleSelect(p.module, p.master)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={S.emptyState}>No modules or masters matching your filters.</div>
            )}
          </div>
        )}
      </div>

      {/* ── recent searches ── */}
      {recentSearches.length > 0 && !isFiltering && (
        <div style={S.recentSection}>
          <div style={S.recentTitle}>{t("WB_RECENT_SEARCHES") || "Recent Searches"}</div>
          <div style={S.recentGrid}>
            {recentSearches.map((entry, idx) => (
              <RecentChip key={idx} entry={entry} onClick={() => handleRecentClick(entry)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── RecentChip sub-component ── */
const RecentChip = ({ entry, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ ...S.recentChip, ...(hover ? S.recentChipHover : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <span style={{ color: GRAY400 }}>&#128218;</span>
      <span>
        {entry.module} &rarr; <strong style={{ color: hover ? TEAL : GRAY900 }}>{entry.master}</strong>
      </span>
    </div>
  );
};

export default MDMSSearchV2;
