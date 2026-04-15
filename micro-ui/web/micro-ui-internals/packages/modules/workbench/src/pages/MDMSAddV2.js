import React, { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory, Link } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";

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
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
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

  errorMsg: {
    fontSize: "12px",
    color: RED,
    marginTop: "2px",
  },
  hint: {
    fontSize: "11px",
    color: GRAY400,
    marginTop: "2px",
    fontStyle: "italic",
  },
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
   JSON textarea editor (separate component)
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
const FieldEditor = ({ fieldKey, value, onChange, expectedType }) => {
  const [focused, setFocused] = useState(false);

  /* Editable */
  if (expectedType === "boolean" || typeof value === "boolean") {
    return <Toggle checked={value || false} onChange={(v) => onChange(fieldKey, v)} />;
  }
  if (expectedType === "number" || expectedType === "integer" || typeof value === "number") {
    return (
      <input
        type="number"
        style={{ ...S.input, ...(focused ? S.inputFocused : {}) }}
        value={value !== null && value !== undefined ? value : ""}
        onChange={(e) => onChange(fieldKey, e.target.value === "" ? "" : Number(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  }
  if (expectedType === "object" || expectedType === "array" || (typeof value === "object" && value !== null)) {
    return <JsonFieldEditor fieldKey={fieldKey} value={value || (expectedType === "array" ? [] : {})} onChange={onChange} />;
  }

  /* String or fallback */
  const strVal = value === null || value === undefined ? "" : String(value);

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
   MDMSAddV2 — main component
   ═══════════════════════════════════════════════ */
const MDMSAddV2 = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const params = new URLSearchParams(location.search);
  const moduleName = params.get("module");
  const masterName = params.get("master");
  const schemaCode = moduleName && masterName ? `${moduleName}.${masterName}` : "";

  const [loadingSchema, setLoadingSchema] = useState(true);
  const [schemaDef, setSchemaDef] = useState(null);

  const [editData, setEditData] = useState({});
  const [isActiveState, setIsActiveState] = useState(true);
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  /* ── initialise fields from schema ── */
  useEffect(() => {
    if (!schemaCode) return;

    const fetchSchema = async () => {
      setLoadingSchema(true);
      try {
        const res = await Digit.CustomService.getResponse({
          url: "/egov-mdms-service/schema/v1/_search",
          body: {
            SchemaDefCriteria: {
              tenantId: stateId || tenantId,
              codes: [schemaCode],
            },
          },
        });

        const def = res?.SchemaDefinitions?.[0];
        if (def && def.definition && def.definition.properties) {
          setSchemaDef(def);

          // Pre-populate empty fields
          const initData = {};
          Object.keys(def.definition.properties).forEach((k) => {
            const type = def.definition.properties[k].type;
            if (type === "boolean") initData[k] = false;
            else if (type === "number" || type === "integer") initData[k] = null;
            else if (type === "array") initData[k] = [];
            else if (type === "object") initData[k] = {};
            else initData[k] = "";
          });
          setEditData(initData);
        } else {
          console.warn("No valid schema definition found. Starting with empty template based on existing record guess.");
          setSchemaDef({ definition: { properties: {} } });
        }
      } catch (err) {
        console.error("Failed to fetch schema definition", err);
        setToast({ message: "Failed to fetch schema. Form may be incomplete.", type: "error" });
        setSchemaDef({ definition: { properties: {} } });
      }
      setLoadingSchema(false);
    };

    fetchSchema();
  }, [schemaCode, stateId, tenantId]);

  /* ── field keys ── */
  const fieldKeys = useMemo(() => {
    return Object.keys(editData).filter((k) => !k.startsWith("_mdms"));
  }, [editData]);

  const simpleFields = useMemo(() => fieldKeys.filter((k) => typeof editData[k] !== "object" || editData[k] === null), [fieldKeys, editData]);
  const complexFields = useMemo(() => fieldKeys.filter((k) => typeof editData[k] === "object" && editData[k] !== null), [fieldKeys, editData]);

  /* ── change handler ── */
  const handleFieldChange = useCallback((key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ── cancel ── */
  const handleCancel = useCallback(() => {
    history.push(
      `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(moduleName || "")}&master=${encodeURIComponent(
        masterName || ""
      )}`
    );
  }, [history, moduleName, masterName]);

  /* ── save handler ── */
  const handleSave = useCallback(async () => {
    if (!uniqueIdentifier || !uniqueIdentifier.trim()) {
      setToast({ message: "Unique Identifier is required", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const body = {
        Mdms: {
          tenantId: stateId || tenantId,
          schemaCode,
          uniqueIdentifier: uniqueIdentifier.trim(),
          data: editData,
          isActive: isActiveState,
        },
      };

      await Digit.CustomService.getResponse({
        url: "/egov-mdms-service/v2/_create",
        body,
        useCache: false,
      });

      setToast({ message: t("WB_RECORD_CREATED") || "Record created successfully", type: "success" });

      // Delay navigation a bit to let user see toast
      setTimeout(() => {
        history.push(
          `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(moduleName || "")}&master=${encodeURIComponent(
            masterName || ""
          )}`
        );
      }, 1000);
    } catch (err) {
      console.error("[WB Add] Save error:", err);
      setToast({ message: err?.response?.data?.Errors?.[0]?.message || t("WB_SAVE_FAILED") || "Failed to create record", type: "error" });
    }
    setSaving(false);
  }, [editData, isActiveState, schemaCode, uniqueIdentifier, tenantId, stateId, t, history, moduleName, masterName]);

  /* ── back URL ── */
  const backUrl = `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(moduleName || "")}&master=${encodeURIComponent(
    masterName || ""
  )}`;

  if (loadingSchema) {
    return (
      <div style={S.page}>
        <Loader />
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
          <h1 style={S.title}>{t("WB_ADD_MDMS_DATA") || "Add Master Data"}</h1>
          <p style={S.subtitle}>
            <span style={{ ...S.badge, background: TEAL_LIGHT, color: TEAL }}>{schemaCode}</span>
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
          <button type="button" style={{ ...S.btn, ...S.btnOutline }} onClick={handleCancel} disabled={saving}>
            {t("ES_COMMON_CANCEL") || "Cancel"}
          </button>
          <button type="button" style={{ ...S.btn, ...S.btnPrimary, ...(saving ? S.btnDisabled : {}) }} onClick={handleSave} disabled={saving}>
            {saving ? "\u23F3 Creating..." : "\u2714 " + (t("WB_CREATE") || "Create Record")}
          </button>
        </div>
      </div>

      {/* ═══ UNIQUE IDENTIFIER (MANDATORY) ═══ */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>
          {t("WB_UNIQUE_IDENTIFIER") || "Unique Identifier"} <span style={{ color: RED }}>*</span>
        </h3>
        <div style={S.fieldGrid}>
          <div style={S.fieldRow}>
            <input
              type="text"
              style={{
                ...S.input,
                ...(focusedField === "uid" ? S.inputFocused : {}),
              }}
              value={uniqueIdentifier}
              onChange={(e) => setUniqueIdentifier(e.target.value)}
              onFocus={() => setFocusedField("uid")}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter a unique ID for this record"
            />
            <span style={S.hint}>Must be unique within {schemaCode}</span>
          </div>
        </div>
      </div>

      {/* ═══ TAB: Data Fields ═══ */}
      {/* isActive toggle */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>Record Status</h3>
        <div style={S.fieldRow}>
          <span style={S.fieldLabel}>IS ACTIVE</span>
          <Toggle checked={isActiveState} onChange={setIsActiveState} disabled={true} />{" "}
          {/* check:  if isActive should be required or its unnecessary */}
        </div>
      </div>

      {/* Simple fields card */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>
          {t("WB_PROPERTIES") || "Properties"}
          <span style={{ fontSize: "12px", fontWeight: 400, color: GRAY400 }}>({simpleFields.length} fields)</span>
        </h3>

        {simpleFields.length === 0 ? (
          <p style={{ color: GRAY500, fontStyle: "italic", fontSize: "13px" }}>No simple properties available.</p>
        ) : (
          <div style={S.fieldGrid}>
            {simpleFields.map((key) => {
              const propSchema = schemaDef?.definition?.properties?.[key] || {};
              return (
                <div key={key} style={S.fieldRow}>
                  <span style={S.fieldLabel}>{key}</span>
                  <FieldEditor fieldKey={key} value={editData[key]} onChange={handleFieldChange} expectedType={propSchema.type} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Complex fields (objects/arrays) each in its own card */}
      {complexFields.map((key) => {
        const propSchema = schemaDef?.definition?.properties?.[key] || {};
        return (
          <div key={key} style={S.card}>
            <h3 style={S.cardTitle}>
              {key}
              <span style={{ fontSize: "12px", fontWeight: 400, color: GRAY400 }}>(complex)</span>
            </h3>
            <FieldEditor fieldKey={key} value={editData[key]} onChange={handleFieldChange} expectedType={propSchema.type} />
          </div>
        );
      })}

      {/* ── toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MDMSAddV2;
