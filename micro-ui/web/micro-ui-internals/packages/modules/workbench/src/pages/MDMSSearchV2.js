import React, { useState, useEffect, useRef, useMemo } from "react";
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  required: { color: "#dc2626" },

  /* dropdown */
  ddWrap: { position: "relative" },
  ddBtn: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
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
  ddPlaceholder: { color: GRAY400 },
  ddPanel: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    background: WHITE,
    borderRadius: "10px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    border: "1px solid " + GRAY100,
    zIndex: 9990,
    maxHeight: "280px",
    display: "flex",
    flexDirection: "column",
  },
  ddSearch: {
    width: "100%",
    padding: "10px 14px",
    border: "none",
    borderBottom: "1px solid " + GRAY100,
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: "10px 10px 0 0",
  },
  ddList: {
    flex: 1,
    overflowY: "auto",
  },
  ddItem: {
    padding: "9px 14px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  ddItemHover: { background: TEAL_LIGHT },
  ddItemActive: { background: TEAL_LIGHT, color: TEAL, fontWeight: 600 },
  ddEmpty: {
    padding: "16px 14px",
    fontSize: "13px",
    color: GRAY400,
    textAlign: "center",
  },

  /* buttons */
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  btn: {
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.12s, box-shadow 0.12s",
    border: "none",
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    boxShadow: "0 2px 6px rgba(13,106,130,0.18)",
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  btnClear: {
    background: WHITE,
    color: GRAY700,
    border: "1px solid " + GRAY200,
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
};

/* ─────────────── SearchDropdown sub-component ─────────────── */
const SearchDropdown = ({ label, required, options = [], selected, onSelect, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoverIdx, setHoverIdx] = useState(-1);
  const ref = useRef(null);

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
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>
        {label} {required && <span style={S.required}>*</span>}
      </label>
      <div ref={ref} style={S.ddWrap}>
        <button
          type="button"
          style={{ ...S.ddBtn, ...(open ? S.ddBtnFocus : {}), ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}) }}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <span style={selected ? {} : S.ddPlaceholder}>{selected || placeholder || "Select..."}</span>
          <span style={{ color: GRAY400 }}>&#9662;</span>
        </button>
        {open && (
          <div style={S.ddPanel}>
            <input style={S.ddSearch} type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            <div style={S.ddList}>
              {filtered.length === 0 ? (
                <div style={S.ddEmpty}>No matches found</div>
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
   MDMSSearchV2 — main component
   ═══════════════════════════════════════════════ */
const MDMSSearchV2 = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("WB_MDMS_RECENT") || "[]");
    } catch {
      return [];
    }
  });

  /* ── fetch MDMS data using custom hook (same pattern as HRMS) ── */
  const { isLoading: loading, data: mdmsData } = Digit.Hooks.workbench.useWorkbenchMDMS(stateId || tenantId);
  const allData = mdmsData?.moduleMap || null;

  /* ── derived values ── */
  const moduleNames = useMemo(() => (allData ? Object.keys(allData).sort() : []), [allData]);
  const masterNames = useMemo(() => {
    if (!selectedModule || !allData || !allData[selectedModule]) return [];
    return allData[selectedModule];
  }, [selectedModule, allData]);

  /* ── handlers ── */
  const handleModuleChange = (mod) => {
    setSelectedModule(mod);
    setSelectedMaster(null);
  };

  const handleSearch = () => {
    if (!selectedModule || !selectedMaster) return;

    /* save to recent searches */
    const entry = { module: selectedModule, master: selectedMaster };
    const newRecent = [entry, ...recentSearches.filter((r) => !(r.module === entry.module && r.master === entry.master))].slice(0, 8);
    setRecentSearches(newRecent);
    try {
      sessionStorage.setItem("WB_MDMS_RECENT", JSON.stringify(newRecent));
    } catch {}

    /* navigate to results */
    history.push(
      `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(selectedModule)}&master=${encodeURIComponent(selectedMaster)}`
    );
  };

  const handleClear = () => {
    setSelectedModule(null);
    setSelectedMaster(null);
  };

  const handleRecentClick = (entry) => {
    setSelectedModule(entry.module);
    setSelectedMaster(entry.master);
    /* navigate directly */
    history.push(
      `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(entry.module)}&master=${encodeURIComponent(entry.master)}`
    );
  };

  if (loading) {
    return (
      <div style={S.page}>
        <Loader />
      </div>
    );
  }

  const canSearch = selectedModule && selectedMaster;

  return (
    <div style={S.page}>
      {/* ── hero card ── */}
      <div style={S.heroCard}>
        <div style={S.heroAccent} />
        <div style={S.heroBody}>
          <div style={S.heroIcon}>&#128218;</div>
          <h1 style={S.heroTitle}>{t("WB_MDMS_SEARCH_TITLE") || "Master Data Management"}</h1>
          <p style={S.heroSub}>
            {t("WB_MDMS_SEARCH_DESC") || "Search and browse MDMS configuration data. Select a module and master name to view records."}
          </p>
        </div>
      </div>

      {/* ── search form ── */}
      <div style={S.formCard}>
        <div style={S.formGrid}>
          <SearchDropdown
            label={t("WB_MODULE_NAME") || "Module Name"}
            required
            options={moduleNames}
            selected={selectedModule}
            onSelect={handleModuleChange}
            placeholder={t("WB_SELECT_MODULE") || "Select module..."}
          />
          <SearchDropdown
            label={t("WB_MASTER_NAME") || "Master Name"}
            required
            options={masterNames}
            selected={selectedMaster}
            onSelect={setSelectedMaster}
            placeholder={selectedModule ? t("WB_SELECT_MASTER") || "Select master..." : t("WB_SELECT_MODULE_FIRST") || "Select a module first"}
            disabled={!selectedModule}
          />
        </div>

        <div style={S.btnRow}>
          <button
            type="button"
            style={{ ...S.btn, ...S.btnClear, ...(canSearch ? {} : S.btnDisabled) }}
            onClick={handleClear}
            disabled={!selectedModule && !selectedMaster}
          >
            {t("ES_COMMON_CLEAR_SEARCH") || "Clear"}
          </button>
          <button
            type="button"
            style={{ ...S.btn, ...S.btnPrimary, ...(canSearch ? {} : S.btnDisabled) }}
            onClick={handleSearch}
            disabled={!canSearch}
          >
            &#128269; {t("WB_SEARCH") || "Search"}
          </button>
        </div>
      </div>

      {/* ── recent searches ── */}
      {recentSearches.length > 0 && (
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
      <span>&#128218;</span>
      <span>
        {entry.module} &rarr; {entry.master}
      </span>
    </div>
  );
};

export default MDMSSearchV2;
