import React, { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const GREEN_BG = "#dcfce7";
const RED = "#dc2626";
const RED_BG = "#fee2e2";
const ORANGE = "#ea580c";
const GRAY50 = "#f9fafb";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY600 = "#4b5563";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

/* ─────────────── inline styles ─────────────── */
const S = {
  page: {
    maxWidth: "1100px",
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
    gap: "8px",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    width: "fit-content",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  btn: {
    padding: "9px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "transform 0.12s, box-shadow 0.12s",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    boxShadow: "0 2px 8px rgba(13,106,130,0.25)",
  },
  btnOutline: {
    background: WHITE,
    color: GRAY700,
    border: `1px solid ${GRAY200}`,
  },
  btnDanger: {
    background: WHITE,
    color: RED,
    border: `1px solid ${RED}`,
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  /* tabs */
  tabBar: {
    display: "flex",
    gap: "0",
    borderBottom: `2px solid ${GRAY200}`,
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: GRAY500,
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
    transition: "color 0.15s, border-color 0.15s",
  },
  tabActive: {
    color: TEAL,
    borderBottom: `2px solid ${TEAL}`,
  },

  /* card section */
  card: {
    background: WHITE,
    borderRadius: "14px",
    border: `1px solid ${GRAY200}`,
    padding: "24px",
    marginBottom: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: GRAY900,
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  /* field rows */
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  fieldGridFull: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },
  fieldRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  fieldValue: {
    fontSize: "14px",
    color: GRAY900,
    wordBreak: "break-word",
    lineHeight: 1.5,
  },
  fieldValueMono: {
    fontSize: "13px",
    color: GRAY700,
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    background: GRAY50,
    padding: "4px 8px",
    borderRadius: "6px",
    wordBreak: "break-all",
  },

  /* edit input */
  inputWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  input: {
    fontSize: "14px",
    color: GRAY900,
    padding: "9px 12px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  inputFocused: {
    borderColor: TEAL,
    boxShadow: `0 0 0 3px ${TEAL_LIGHT}`,
  },
  inputMono: {
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    fontSize: "13px",
  },
  textarea: {
    fontSize: "13px",
    color: GRAY900,
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    outline: "none",
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "180px",
    lineHeight: 1.6,
  },
  select: {
    fontSize: "14px",
    color: GRAY900,
    padding: "9px 12px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    outline: "none",
    background: WHITE,
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  },

  /* JSON viewer */
  jsonContainer: {
    background: GRAY50,
    borderRadius: "10px",
    border: `1px solid ${GRAY200}`,
    padding: "16px",
    overflow: "auto",
    maxHeight: "500px",
  },
  jsonPre: {
    margin: 0,
    fontSize: "12.5px",
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    lineHeight: 1.6,
    color: GRAY700,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  jsonKey: { color: "#0550ae" },
  jsonStr: { color: "#0a3069" },
  jsonNum: { color: "#0550ae" },
  jsonBool: { color: ORANGE },
  jsonNull: { color: GRAY400, fontStyle: "italic" },

  /* audit row */
  auditGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
  },

  /* toast */
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
    color: WHITE,
    zIndex: 9999,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    animation: "slideUp 0.3s ease-out",
  },
  toastSuccess: { background: GREEN },
  toastError: { background: RED },

  /* toggle */
  toggleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  toggleTrack: {
    width: "44px",
    height: "24px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background 0.2s",
    position: "relative",
    flexShrink: 0,
  },
  toggleThumb: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: WHITE,
    position: "absolute",
    top: "3px",
    transition: "left 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },

  /* collapsible */
  collapseHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    userSelect: "none",
  },
  collapseArrow: {
    fontSize: "12px",
    color: GRAY400,
    transition: "transform 0.2s",
  },

  /* empty */
  emptyMsg: {
    textAlign: "center",
    color: GRAY400,
    padding: "40px 20px",
    fontSize: "14px",
  },
};

/* ═══════════════════════════════════════════════
   JSON Syntax Highlighter (read-only view)
   ═══════════════════════════════════════════════ */
const JsonHighlight = ({ data }) => {
  const json = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  const highlighted = useMemo(() => {
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = "jsonNum";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "jsonKey" : "jsonStr";
      } else if (/true|false/.test(match)) {
        cls = "jsonBool";
      } else if (/null/.test(match)) {
        cls = "jsonNull";
      }
      const style = S[cls] || {};
      return `<span style="color:${style.color || GRAY700};${style.fontStyle ? `font-style:${style.fontStyle}` : ""}">${match}</span>`;
    });
  }, [json]);

  return (
    <div style={S.jsonContainer}>
      <pre style={S.jsonPre} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Toggle Switch
   ═══════════════════════════════════════════════ */
const Toggle = ({ checked, onChange, disabled }) => (
  <div style={S.toggleWrap}>
    <div
      style={{
        ...S.toggleTrack,
        background: checked ? GREEN : GRAY200,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div style={{ ...S.toggleThumb, left: checked ? "22px" : "3px" }} />
    </div>
    <span style={{ fontSize: "13px", fontWeight: 600, color: checked ? GREEN : GRAY500 }}>{checked ? "Active" : "Inactive"}</span>
  </div>
);

/* ═══════════════════════════════════════════════
   Toast notification
   ═══════════════════════════════════════════════ */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ ...S.toast, ...(type === "error" ? S.toastError : S.toastSuccess) }}>
      {type === "error" ? "\u26A0" : "\u2714"} {message}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   JSON textarea editor (separate component to avoid conditional hooks)
   ═══════════════════════════════════════════════ */
const JsonFieldEditor = ({ fieldKey, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const [localJson, setLocalJson] = useState(JSON.stringify(value, null, 2));
  const [jsonError, setJsonError] = useState(null);

  const handleJsonChange = (e) => {
    const raw = e.target.value;
    setLocalJson(raw);
    try {
      const parsed = JSON.parse(raw);
      setJsonError(null);
      onChange(fieldKey, parsed);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  return (
    <div>
      <textarea
        style={{
          ...S.textarea,
          ...(focused ? S.inputFocused : {}),
          ...(jsonError ? { borderColor: RED } : {}),
        }}
        value={localJson}
        onChange={handleJsonChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {jsonError && <div style={{ color: RED, fontSize: "12px", marginTop: "4px" }}>Invalid JSON: {jsonError}</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Smart field editor per type
   ═══════════════════════════════════════════════ */
const FieldEditor = ({ fieldKey, value, onChange, editing }) => {
  const [focused, setFocused] = useState(false);

  if (!editing) {
    /* Read-only display */
    if (value === null || value === undefined) {
      return <span style={{ color: GRAY400, fontStyle: "italic" }}>null</span>;
    }
    if (typeof value === "boolean") {
      return (
        <span
          style={{
            ...S.badge,
            background: value ? GREEN_BG : RED_BG,
            color: value ? GREEN : RED,
          }}
        >
          {String(value)}
        </span>
      );
    }
    if (typeof value === "object") {
      return <JsonHighlight data={value} />;
    }
    return <span style={S.fieldValue}>{String(value)}</span>;
  }

  /* Editable */
  if (typeof value === "boolean") {
    return <Toggle checked={value} onChange={(v) => onChange(fieldKey, v)} />;
  }
  if (typeof value === "number") {
    return (
      <input
        type="number"
        style={{ ...S.input, ...(focused ? S.inputFocused : {}) }}
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value === "" ? "" : Number(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  }
  if (typeof value === "object" && value !== null) {
    return <JsonFieldEditor fieldKey={fieldKey} value={value} onChange={onChange} />;
  }
  /* String or fallback */
  const strVal = value === null || value === undefined ? "" : String(value);
  const isLong = strVal.length > 80;
  if (isLong) {
    return (
      <textarea
        style={{ ...S.textarea, minHeight: "80px", ...(focused ? S.inputFocused : {}) }}
        value={strVal}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  }
  return (
    <input
      type="text"
      style={{ ...S.input, ...(focused ? S.inputFocused : {}) }}
      value={strVal}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

/* ═══════════════════════════════════════════════
   MDMSDetailV2 — main component
   ═══════════════════════════════════════════════ */
const MDMSDetailV2 = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const params = new URLSearchParams(location.search);
  const moduleName = params.get("module");
  const masterName = params.get("master");
  const schemaCode = moduleName && masterName ? `${moduleName}.${masterName}` : "";

  const rowData = location.state?.rowData || null;

  const [activeTab, setActiveTab] = useState("fields");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isActiveState, setIsActiveState] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── initialise from row data ── */
  useEffect(() => {
    if (rowData) {
      const { _mdmsId, _mdmsUniqueIdentifier, _mdmsAuditDetails, isActive, ...dataFields } = rowData;
      setEditData(dataFields);
      setIsActiveState(isActive !== undefined ? isActive : true);
    }
  }, [rowData]);

  const mdmsId = rowData?._mdmsId || null;
  const uniqueId = rowData?._mdmsUniqueIdentifier || null;
  const auditDetails = rowData?._mdmsAuditDetails || null;

  /* ── field keys (non-internal) ── */
  const fieldKeys = useMemo(() => {
    return Object.keys(editData).filter((k) => !k.startsWith("_mdms"));
  }, [editData]);

  const simpleFields = useMemo(() => fieldKeys.filter((k) => typeof editData[k] !== "object" || editData[k] === null), [fieldKeys, editData]);
  const complexFields = useMemo(() => fieldKeys.filter((k) => typeof editData[k] === "object" && editData[k] !== null), [fieldKeys, editData]);

  /* ── change handler ── */
  const handleFieldChange = useCallback((key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ── cancel editing ── */
  const handleCancel = useCallback(() => {
    if (rowData) {
      const { _mdmsId, _mdmsUniqueIdentifier, _mdmsAuditDetails, isActive, ...dataFields } = rowData;
      setEditData(dataFields);
      setIsActiveState(isActive !== undefined ? isActive : true);
    }
    setEditing(false);
  }, [rowData]);

  /* ── save handler ── */
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const body = {
        Mdms: {
          tenantId: stateId || tenantId,
          schemaCode,
          uniqueIdentifier: uniqueId,
          data: editData,
          isActive: isActiveState,
        },
      };
      if (mdmsId) {
        body.Mdms.id = mdmsId;
      }
      if (auditDetails) {
        body.Mdms.auditDetails = auditDetails;
      }

      await Digit.CustomService.getResponse({
        url: "/egov-mdms-service/v2/_update",
        params: {},
        body,
      });

      setEditing(false);
      setToast({ message: t("WB_RECORD_UPDATED") || "Record updated successfully", type: "success" });
    } catch (err) {
      console.error("[WB Detail] Save error:", err);
      setToast({ message: err?.response?.data?.Errors?.[0]?.message || t("WB_SAVE_FAILED") || "Failed to save record", type: "error" });
    }
    setSaving(false);
  }, [editData, isActiveState, schemaCode, uniqueId, mdmsId, tenantId, stateId, t]);

  /* ── format date ── */
  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ── back URL ── */
  const backUrl = `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(moduleName || "")}&master=${encodeURIComponent(
    masterName || ""
  )}`;

  /* ── no data guard ── */
  if (!rowData) {
    return (
      <div style={S.page}>
        <Link to={backUrl} style={S.backLink}>
          &larr; Back to results
        </Link>
        <div style={S.emptyMsg}>
          <p>No record data available. Please navigate from the results table.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ── back link ── */}
      <Link to={backUrl} style={S.backLink}>
        &larr; {t("WB_BACK_TO_RESULTS") || "Back to Results"}
      </Link>

      {/* ── header ── */}
      <div style={S.header}>
        <div style={S.titleWrap}>
          <h1 style={S.title}>{masterName}</h1>
          <p style={S.subtitle}>
            <span style={{ ...S.badge, background: TEAL_LIGHT, color: TEAL }}>{moduleName}</span>
            {uniqueId && <span style={{ ...S.badge, background: GRAY100, color: GRAY600 }}>ID: {uniqueId}</span>}
            <span
              style={{
                ...S.badge,
                background: isActiveState ? GREEN_BG : RED_BG,
                color: isActiveState ? GREEN : RED,
              }}
            >
              {isActiveState ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
        <div style={S.headerActions}>
          {!editing ? (
            <button type="button" style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setEditing(true)}>
              &#9998; {t("WB_EDIT") || "Edit Record"}
            </button>
          ) : (
            <Fragment>
              <button type="button" style={{ ...S.btn, ...S.btnOutline }} onClick={handleCancel} disabled={saving}>
                {t("ES_COMMON_CANCEL") || "Cancel"}
              </button>
              <button type="button" style={{ ...S.btn, ...S.btnPrimary, ...(saving ? S.btnDisabled : {}) }} onClick={handleSave} disabled={saving}>
                {saving ? "\u23F3 Saving..." : "\u2714 " + (t("WB_SAVE") || "Save Changes")}
              </button>
            </Fragment>
          )}
        </div>
      </div>

      {/* ── tabs ── */}
      <div style={S.tabBar}>
        {[
          { key: "fields", label: t("WB_DATA_FIELDS") || "Data Fields" },
          { key: "json", label: t("WB_JSON_VIEW") || "JSON View" },
          { key: "audit", label: t("WB_AUDIT_DETAILS") || "Audit Details" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            style={{ ...S.tab, ...(activeTab === tab.key ? S.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: Data Fields ═══ */}
      {activeTab === "fields" && (
        <>
          {/* isActive toggle */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>Record Status</h3>
            <div style={S.fieldRow}>
              <span style={S.fieldLabel}>IS ACTIVE</span>
              {editing ? (
                <Toggle checked={isActiveState} onChange={setIsActiveState} />
              ) : (
                <span
                  style={{
                    ...S.badge,
                    background: isActiveState ? GREEN_BG : RED_BG,
                    color: isActiveState ? GREEN : RED,
                  }}
                >
                  {isActiveState ? "Active" : "Inactive"}
                </span>
              )}
            </div>
          </div>

          {/* Simple fields card */}
          {simpleFields.length > 0 && (
            <div style={S.card}>
              <h3 style={S.cardTitle}>
                {t("WB_PROPERTIES") || "Properties"}
                <span style={{ fontSize: "12px", fontWeight: 400, color: GRAY400 }}>({simpleFields.length} fields)</span>
              </h3>
              <div style={S.fieldGrid}>
                {simpleFields.map((key) => (
                  <div key={key} style={S.fieldRow}>
                    <span style={S.fieldLabel}>{key}</span>
                    <FieldEditor fieldKey={key} value={editData[key]} onChange={handleFieldChange} editing={editing} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complex fields (objects/arrays) each in its own card */}
          {complexFields.map((key) => (
            <div key={key} style={S.card}>
              <h3 style={S.cardTitle}>
                {key}
                <span style={{ fontSize: "12px", fontWeight: 400, color: GRAY400 }}>
                  ({Array.isArray(editData[key]) ? `${editData[key].length} items` : "object"})
                </span>
              </h3>
              <FieldEditor fieldKey={key} value={editData[key]} onChange={handleFieldChange} editing={editing} />
            </div>
          ))}
        </>
      )}

      {/* ═══ TAB: JSON View ═══ */}
      {activeTab === "json" && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>
            Raw JSON Data
            <button
              type="button"
              style={{ ...S.btn, ...S.btnOutline, padding: "4px 12px", fontSize: "12px" }}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(editData, null, 2));
                setToast({ message: "Copied to clipboard", type: "success" });
              }}
            >
              &#128203; Copy
            </button>
          </h3>
          <JsonHighlight data={editData} />
        </div>
      )}

      {/* ═══ TAB: Audit Details ═══ */}
      {activeTab === "audit" && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>Audit Information</h3>
          {auditDetails ? (
            <div style={S.auditGrid}>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>MDMS Record ID</span>
                <span style={S.fieldValueMono}>{mdmsId || "—"}</span>
              </div>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>Unique Identifier</span>
                <span style={S.fieldValueMono}>{uniqueId || "—"}</span>
              </div>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>Schema Code</span>
                <span style={S.fieldValueMono}>{schemaCode}</span>
              </div>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>Created By</span>
                <span style={S.fieldValueMono}>{auditDetails.createdBy || "—"}</span>
              </div>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>Created At</span>
                <span style={S.fieldValue}>{formatDate(auditDetails.createdTime)}</span>
              </div>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>Last Modified By</span>
                <span style={S.fieldValueMono}>{auditDetails.lastModifiedBy || "—"}</span>
              </div>
              <div style={S.fieldRow}>
                <span style={S.fieldLabel}>Last Modified At</span>
                <span style={S.fieldValue}>{formatDate(auditDetails.lastModifiedTime)}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: GRAY400, fontSize: "13px" }}>No audit details available for this record.</p>
          )}
        </div>
      )}

      {/* ── toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MDMSDetailV2;
