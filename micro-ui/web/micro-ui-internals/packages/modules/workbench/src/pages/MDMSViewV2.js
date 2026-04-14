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

  /* ── inline cell editing ── */
  cellWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    width: "100%",
  },
  cellValue: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cellIcons: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    flexShrink: 0,
    opacity: 0,
    transition: "opacity 0.15s",
  },
  cellIconBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: GRAY400,
    fontSize: "14px",
    padding: 0,
    transition: "background 0.12s, color 0.12s",
  },
  cellIconBtnHover: {
    background: TEAL_LIGHT,
    color: TEAL,
  },
  inlineInput: {
    width: "100%",
    padding: "4px 8px",
    border: "1.5px solid " + TEAL,
    borderRadius: "6px",
    fontSize: "13px",
    color: GRAY700,
    outline: "none",
    background: WHITE,
    boxSizing: "border-box",
  },
  inlineActions: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
  },
  inlineSaveBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    border: "none",
    background: TEAL,
    color: WHITE,
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },
  inlineCancelBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    border: "1px solid " + GRAY200,
    background: WHITE,
    color: GRAY500,
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },

  /* boolean toggle capsule */
  toggleCapsule: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 3px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    userSelect: "none",
  },
  toggleTrue: {
    background: GREEN_BG,
    color: GREEN,
  },
  toggleFalse: {
    background: RED_BG,
    color: RED,
  },
  toggleOption: {
    padding: "2px 8px",
    borderRadius: "10px",
    transition: "background 0.2s, color 0.2s",
  },
  toggleOptionActive: {
    background: WHITE,
    color: GRAY900,
  },
  toggleOptionInactive: {
    color: "transparent",
  },

  /* ── popup / modal overlay ── */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  popupCard: {
    background: WHITE,
    borderRadius: "14px",
    width: "560px",
    maxWidth: "92vw",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid " + GRAY100,
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },
  popupClose: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: GRAY400,
    padding: "4px",
    lineHeight: 1,
  },
  popupBody: {
    padding: "20px 24px",
    flex: 1,
    overflowY: "auto",
  },
  popupTextarea: {
    width: "100%",
    minHeight: "200px",
    padding: "12px 14px",
    border: "1.5px solid " + GRAY200,
    borderRadius: "10px",
    fontSize: "13px",
    fontFamily: "'SF Mono', Consolas, 'Courier New', monospace",
    color: GRAY700,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: 1.5,
  },
  popupTextareaFocus: {
    borderColor: TEAL,
    boxShadow: "0 0 0 3px " + TEAL_LIGHT,
  },
  popupError: {
    color: RED,
    fontSize: "12px",
    marginTop: "8px",
  },
  popupFooter: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    padding: "14px 24px",
    borderTop: "1px solid " + GRAY100,
  },
  popupCancelBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    background: WHITE,
    color: GRAY700,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  popupSaveBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, " + TEAL + " 0%, #1aabb8 100%)",
    color: WHITE,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  popupSaveBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  popupFieldLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },

  /* ── toast ── */
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    zIndex: 10001,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    animation: "slideInToast 0.25s ease-out",
  },
  toastSuccess: {
    background: GREEN_BG,
    color: GREEN,
    border: "1px solid " + GREEN,
  },
  toastError: {
    background: RED_BG,
    color: RED,
    border: "1px solid " + RED,
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

/* ─────────────── CellEditPopup sub-component ─────────────── */
const CellEditPopup = ({ fieldKey, value, onSave, onClose }) => {
  const isComplex = typeof value === "object" && value !== null;
  const isBoolean = typeof value === "boolean";
  const [text, setText] = useState(isComplex ? JSON.stringify(value, null, 2) : String(value != null ? value : ""));
  const [parseError, setParseError] = useState(null);
  const [taFocused, setTaFocused] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    let parsed = text;
    if (isComplex) {
      try {
        parsed = JSON.parse(text);
        setParseError(null);
      } catch (err) {
        setParseError("Invalid JSON: " + err.message);
        return;
      }
    }
    setSaving(true);
    await onSave(parsed);
    setSaving(false);
  };

  const handleBooleanToggle = async (newValue) => {
    setSaving(true);
    await onSave(newValue);
    setSaving(false);
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.popupCard} onClick={(e) => e.stopPropagation()}>
        <div style={S.popupHeader}>
          <h3 style={S.popupTitle}>Edit: {fieldKey}</h3>
          <button type="button" style={S.popupClose} onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={S.popupBody}>
          <div style={S.popupFieldLabel}>{isComplex ? "JSON Value" : isBoolean ? "Boolean Value" : "Value"}</div>

          {/* Boolean toggle capsule */}
          {isBoolean && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <div
                style={{ ...S.toggleCapsule, ...(value ? S.toggleTrue : S.toggleFalse), cursor: "pointer" }}
                onClick={() => handleBooleanToggle(!value)}
              >
                <span style={{ ...S.toggleOption, ...(value ? S.toggleOptionActive : S.toggleOptionInactive) }}>TRUE</span>
                <span style={{ ...S.toggleOption, ...(!value ? S.toggleOptionActive : S.toggleOptionInactive) }}>FALSE</span>
              </div>
            </div>
          )}

          {/* Textarea for non-boolean values */}
          {!isBoolean && (
            <textarea
              style={{ ...S.popupTextarea, ...(taFocused ? S.popupTextareaFocus : {}) }}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setParseError(null);
              }}
              onFocus={() => setTaFocused(true)}
              onBlur={() => setTaFocused(false)}
              spellCheck={false}
            />
          )}

          {parseError && <div style={S.popupError}>{parseError}</div>}
        </div>
        <div style={S.popupFooter}>
          <button type="button" style={S.popupCancelBtn} onClick={onClose}>
            Cancel
          </button>
          {!isBoolean && (
            <button type="button" style={{ ...S.popupSaveBtn, ...(saving ? S.popupSaveBtnDisabled : {}) }} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Toast sub-component ─────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ ...S.toast, ...(type === "success" ? S.toastSuccess : S.toastError) }}>
      <span>{type === "success" ? "\u2713" : "\u2717"}</span>
      <span>{message}</span>
    </div>
  );
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

  /* ── inline editing state ── */
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [popupCell, setPopupCell] = useState(null);
  const [toast, setToast] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

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

  /* ── inline cell save handler ── */
  const handleCellSave = useCallback(
    async (row, colKey, newValue) => {
      const schemaCode = `${moduleName}.${masterName}`;
      const mdmsId = row._mdmsId;
      const uniqueId = row._mdmsUniqueIdentifier;
      const auditDetails = row._mdmsAuditDetails;

      if (!mdmsId && !uniqueId) {
        setToast({ message: "Cannot save: record has no MDMS ID (v1 data is read-only)", type: "error" });
        setEditingCell(null);
        return;
      }

      const { _mdmsId, _mdmsUniqueIdentifier, _mdmsAuditDetails, isActive, ...dataFields } = row;
      const updatedData = { ...dataFields, [colKey]: newValue };

      try {
        const body = {
          Mdms: {
            tenantId: stateId || tenantId,
            schemaCode,
            uniqueIdentifier: uniqueId,
            data: updatedData,
            isActive: isActive !== undefined ? isActive : true,
          },
        };
        if (mdmsId) body.Mdms.id = mdmsId;
        if (auditDetails) body.Mdms.auditDetails = auditDetails;

        await Digit.CustomService.getResponse({
          url: "/egov-mdms-service/v2/_update",
          params: {},
          body,
        });

        setRawData((prev) =>
          prev.map((r) => {
            if (r._mdmsId === mdmsId) {
              return { ...r, [colKey]: newValue };
            }
            return r;
          })
        );
        setToast({ message: t("WB_RECORD_UPDATED") || "Cell updated successfully", type: "success" });
      } catch (err) {
        console.error("[WB Inline] Save error:", err);
        setToast({
          message: err?.response?.data?.Errors?.[0]?.message || t("WB_SAVE_FAILED") || "Failed to save cell",
          type: "error",
        });
      }
      setEditingCell(null);
    },
    [moduleName, masterName, tenantId, stateId, t]
  );

  /* ── table columns ── */
  const columns = useMemo(() => {
    return schema.map((col) => ({
      key: col.key,
      label: col.key,
      render: (row, rowIdx) => {
        const val = row[col.key];
        const valType = getValueType(val);
        const isComplex = valType === "array" || valType === "object";
        const cellId = `${rowIdx}-${col.key}`;
        const isEditing = editingCell === cellId;
        const isHovered = hoverCell === cellId;
        const hasV2Id = !!row._mdmsId;

        if (isEditing && !isComplex) {
          // Show toggle capsule for boolean values
          if (valType === "boolean") {
            const isTrue = val === true;
            return (
              <div style={S.cellWrap} onClick={(e) => e.stopPropagation()}>
                <div
                  style={{ ...S.toggleCapsule, ...(isTrue ? S.toggleTrue : S.toggleFalse) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCellSave(row, col.key, !isTrue);
                  }}
                >
                  <span style={{ ...S.toggleOption, ...(isTrue ? S.toggleOptionActive : S.toggleOptionInactive) }}>TRUE</span>
                  <span style={{ ...S.toggleOption, ...(!isTrue ? S.toggleOptionActive : S.toggleOptionInactive) }}>FALSE</span>
                </div>
                <div style={S.inlineActions}>
                  <button
                    type="button"
                    style={S.inlineCancelBtn}
                    title="Done"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCell(null);
                    }}
                  >
                    &#10005;
                  </button>
                </div>
              </div>
            );
          }

          // Regular input for string and number values
          return (
            <div style={S.cellWrap} onClick={(e) => e.stopPropagation()}>
              <input
                style={S.inlineInput}
                type={valType === "number" ? "number" : "text"}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    let parsed = editValue;
                    if (valType === "number") parsed = Number(editValue);
                    handleCellSave(row, col.key, parsed);
                  }
                  if (e.key === "Escape") setEditingCell(null);
                }}
                autoFocus
              />
              <div style={S.inlineActions}>
                <button
                  type="button"
                  style={S.inlineSaveBtn}
                  title="Save"
                  onClick={(e) => {
                    e.stopPropagation();
                    let parsed = editValue;
                    if (valType === "number") parsed = Number(editValue);
                    handleCellSave(row, col.key, parsed);
                  }}
                >
                  &#10003;
                </button>
                <button
                  type="button"
                  style={S.inlineCancelBtn}
                  title="Cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCell(null);
                  }}
                >
                  &#10005;
                </button>
              </div>
            </div>
          );
        }

        return (
          <div style={S.cellWrap} onMouseEnter={() => setHoverCell(cellId)} onMouseLeave={() => setHoverCell(null)}>
            <span style={S.cellValue}>{renderCellValue(val)}</span>
            {hasV2Id && (
              <span style={{ ...S.cellIcons, ...(isHovered ? { opacity: 1 } : {}) }}>
                {!isComplex && (
                  <button
                    type="button"
                    style={S.cellIconBtn}
                    title="Edit inline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCell(cellId);
                      setEditValue(val != null ? String(val) : "");
                    }}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, S.cellIconBtnHover)}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = GRAY400;
                    }}
                  >
                    &#9998;
                  </button>
                )}
                <button
                  type="button"
                  style={S.cellIconBtn}
                  title={isComplex ? "Edit in popup" : "Expand editor"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupCell({ row, colKey: col.key, value: val });
                  }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, S.cellIconBtnHover)}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = GRAY400;
                  }}
                >
                  {isComplex ? "\u270E" : "\u2197"}
                </button>
              </span>
            )}
          </div>
        );
      },
    }));
  }, [schema, editingCell, editValue, hoverCell, handleCellSave]);

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
            style={{
              padding: "9px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
              color: WHITE,
            }}
            onClick={() =>
              history.push(
                `/${window?.contextPath}/employee/workbench/mdms-add?module=${encodeURIComponent(moduleName)}&master=${encodeURIComponent(
                  masterName
                )}`
              )
            }
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

      {/* ── popup editor for complex / expanded values ── */}
      {popupCell && (
        <CellEditPopup
          fieldKey={popupCell.colKey}
          value={popupCell.value}
          onSave={async (newValue) => {
            await handleCellSave(popupCell.row, popupCell.colKey, newValue);
            setPopupCell(null);
          }}
          onClose={() => setPopupCell(null)}
        />
      )}

      {/* ── toast notification ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MDMSViewV2;
