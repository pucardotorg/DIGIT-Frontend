import React, { useState, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const GREEN_BG = "#dcfce7";
const RED = "#dc2626";
const RED_BG = "#fee2e2";
const GRAY50 = "#f9fafb";
const GRAY200 = "#e5e7eb";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY600 = "#4b5563";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

/* ─────────────── default JSON schema template ─────────────── */
const DEFAULT_SCHEMA = JSON.stringify(
  {
    type: "object",
    $schema: "http://json-schema.org/draft-07/schema#",
    required: [],
    "x-unique": [],
    properties: {},
    additionalProperties: false,
  },
  null,
  2
);

const DEFAULT_DATA = JSON.stringify({}, null, 2);

/* ─────────────── inline styles ─────────────── */
const S = {
  page: {
    maxWidth: "960px",
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
    marginBottom: "24px",
  },
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
  },

  /* stepper */
  stepper: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    marginBottom: "28px",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
    transition: "background 0.2s, color 0.2s",
  },
  stepCircleActive: {
    background: TEAL,
    color: WHITE,
  },
  stepCircleDone: {
    background: GREEN,
    color: WHITE,
  },
  stepCircleDefault: {
    background: GRAY200,
    color: GRAY500,
  },
  stepLabel: {
    fontSize: "13px",
    fontWeight: 600,
    transition: "color 0.2s",
  },
  stepLine: {
    flex: 1,
    height: "2px",
    background: GRAY200,
    margin: "0 12px",
    minWidth: "30px",
  },
  stepLineDone: {
    background: GREEN,
  },

  /* card */
  card: {
    background: WHITE,
    borderRadius: "14px",
    border: `1px solid ${GRAY200}`,
    padding: "28px 32px",
    marginBottom: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: GRAY900,
    margin: "0 0 6px",
  },
  cardDesc: {
    fontSize: "13px",
    color: GRAY500,
    margin: "0 0 20px",
    lineHeight: 1.5,
  },

  /* form fields */
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "20px",
  },
  fieldWrap: {
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
  required: { color: RED },
  input: {
    fontSize: "14px",
    color: GRAY900,
    padding: "10px 14px",
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
  inputError: {
    borderColor: RED,
    boxShadow: `0 0 0 3px ${RED_BG}`,
  },
  textarea: {
    fontSize: "13px",
    color: GRAY900,
    padding: "12px 14px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    outline: "none",
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "220px",
    lineHeight: 1.6,
  },
  textareaSmall: {
    minHeight: "100px",
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

  /* buttons */
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  btn: {
    padding: "10px 24px",
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
  },
  toastSuccess: { background: GREEN },
  toastError: { background: RED },

  /* preview */
  preview: {
    background: GRAY50,
    borderRadius: "10px",
    border: `1px solid ${GRAY200}`,
    padding: "16px",
    overflow: "auto",
    maxHeight: "300px",
  },
  previewPre: {
    margin: 0,
    fontSize: "12.5px",
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    lineHeight: 1.6,
    color: GRAY700,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  /* badge */
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    width: "fit-content",
  },

  /* info box */
  infoBox: {
    background: TEAL_LIGHT,
    border: `1px solid ${TEAL}33`,
    borderRadius: "10px",
    padding: "14px 18px",
    marginBottom: "20px",
    fontSize: "13px",
    color: GRAY700,
    lineHeight: 1.5,
  },

  /* success panel */
  successPanel: {
    textAlign: "center",
    padding: "40px 20px",
  },
  successIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: GREEN_BG,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    margin: "0 auto 16px",
  },
  successTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: GRAY900,
    margin: "0 0 8px",
  },
  successDesc: {
    fontSize: "14px",
    color: GRAY500,
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  successLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
};

/* ═══════════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════════ */
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ ...S.toast, ...(type === "error" ? S.toastError : S.toastSuccess) }}>
      {type === "error" ? "\u26A0" : "\u2714"} {message}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Step indicator
   ═══════════════════════════════════════════════ */
const STEPS = [
  { key: "schema", label: "Define Schema" },
  { key: "data", label: "Add Data" },
  { key: "review", label: "Review & Create" },
];

const Stepper = ({ current }) => (
  <div style={S.stepper}>
    {STEPS.map((step, idx) => {
      const isDone = idx < current;
      const isActive = idx === current;
      return (
        <Fragment key={step.key}>
          {idx > 0 && <div style={{ ...S.stepLine, ...(isDone ? S.stepLineDone : {}) }} />}
          <div style={S.stepItem}>
            <div
              style={{
                ...S.stepCircle,
                ...(isDone ? S.stepCircleDone : isActive ? S.stepCircleActive : S.stepCircleDefault),
              }}
            >
              {isDone ? "\u2713" : idx + 1}
            </div>
            <span style={{ ...S.stepLabel, color: isDone ? GREEN : isActive ? TEAL : GRAY400 }}>{step.label}</span>
          </div>
        </Fragment>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════════
   MDMSCreateV2 — main component
   ═══════════════════════════════════════════════ */
const MDMSCreateV2 = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const tid = stateId || tenantId;

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Step 0: Schema fields ── */
  const [moduleName, setModuleName] = useState("");
  const [masterName, setMasterName] = useState("");
  const [description, setDescription] = useState("");
  const [schemaJson, setSchemaJson] = useState(DEFAULT_SCHEMA);
  const [schemaError, setSchemaError] = useState(null);

  /* ── Step 1: Data fields ── */
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");
  const [dataJson, setDataJson] = useState(DEFAULT_DATA);
  const [dataError, setDataError] = useState(null);

  /* ── focus tracking ── */
  const [focusedField, setFocusedField] = useState(null);

  const schemaCode = moduleName && masterName ? `${moduleName}.${masterName}` : "";

  /* ── validation ── */
  const validateSchema = useCallback(() => {
    if (!moduleName.trim()) return "Module name is required";
    if (/\s/.test(moduleName.trim())) return "Module name must not contain spaces";
    if (!masterName.trim()) return "Master name is required";
    if (/\s/.test(masterName.trim())) return "Master name must not contain spaces";
    try {
      const parsed = JSON.parse(schemaJson);
      if (typeof parsed !== "object" || parsed === null) return "Schema must be a JSON object";
    } catch (e) {
      return "Invalid JSON schema: " + e.message;
    }
    return null;
  }, [moduleName, masterName, schemaJson]);

  const validateData = useCallback(() => {
    if (!uniqueIdentifier.trim()) return "Unique identifier is required";
    try {
      const parsed = JSON.parse(dataJson);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return "Data must be a JSON object";
    } catch (e) {
      return "Invalid JSON data: " + e.message;
    }
    return null;
  }, [uniqueIdentifier, dataJson]);

  /* ── schema JSON change ── */
  const handleSchemaChange = (e) => {
    setSchemaJson(e.target.value);
    try {
      JSON.parse(e.target.value);
      setSchemaError(null);
    } catch (err) {
      setSchemaError(err.message);
    }
  };

  /* ── data JSON change ── */
  const handleDataChange = (e) => {
    setDataJson(e.target.value);
    try {
      JSON.parse(e.target.value);
      setDataError(null);
    } catch (err) {
      setDataError(err.message);
    }
  };

  /* ── step navigation ── */
  const handleNext = () => {
    if (step === 0) {
      const err = validateSchema();
      if (err) {
        setToast({ message: err, type: "error" });
        return;
      }
    }
    if (step === 1) {
      const err = validateData();
      if (err) {
        setToast({ message: err, type: "error" });
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  /* ── create handler ── */
  const handleCreate = useCallback(async () => {
    setSaving(true);
    try {
      /* Step 1: Create Schema Definition */
      const schemaDef = {
        SchemaDefinition: {
          tenantId: tid,
          code: schemaCode,
          description: description.trim() || null,
          definition: JSON.parse(schemaJson),
          isActive: true,
        },
      };

      console.log("[WB Create] Creating schema:", schemaCode);
      const schemaRes = await Digit.CustomService.getResponse({
        url: "/egov-mdms-service/schema/v1/_create",
        body: schemaDef,
        useCache: false,
      });
      console.log("[WB Create] Schema created:", schemaRes);

      /* Step 2: Create Data Record */
      const dataBody = {
        Mdms: {
          tenantId: tid,
          schemaCode: schemaCode,
          uniqueIdentifier: uniqueIdentifier.trim(),
          data: JSON.parse(dataJson),
          isActive: true,
        },
      };

      console.log("[WB Create] Creating data record for:", schemaCode);
      const dataRes = await Digit.CustomService.getResponse({
        url: "/egov-mdms-service/v2/_create",
        body: dataBody,
        useCache: false,
      });
      console.log("[WB Create] Data record created:", dataRes);

      setStep(3); // success
    } catch (err) {
      console.error("[WB Create] Error:", err);
      const errMsg =
        err?.response?.data?.Errors?.[0]?.message || err?.response?.data?.Errors?.[0]?.description || err?.message || "Failed to create record";
      setToast({ message: errMsg, type: "error" });
    }
    setSaving(false);
  }, [tid, schemaCode, description, schemaJson, uniqueIdentifier, dataJson]);

  /* ── back URL ── */
  const backUrl = `/${window?.contextPath}/employee/workbench/manage-master-data`;

  return (
    <div style={S.page}>
      {/* ── back link ── */}
      <Link to={backUrl} style={S.backLink}>
        &larr; {t("WB_BACK_TO_SEARCH") || "Back to Search"}
      </Link>

      {/* ── header ── */}
      <div style={S.header}>
        <h1 style={S.title}>{t("WB_CREATE_MDMS") || "Create MDMS Entry"}</h1>
        <p style={S.subtitle}>{t("WB_CREATE_MDMS_DESC") || "Define a new module/master schema and add an initial data record."}</p>
      </div>

      {/* ── stepper ── */}
      {step < 3 && <Stepper current={step} />}

      {/* ═══ STEP 0: Define Schema ═══ */}
      {step === 0 && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>{t("WB_DEFINE_SCHEMA") || "Define Schema"}</h3>
          <p style={S.cardDesc}>
            {t("WB_DEFINE_SCHEMA_DESC") ||
              "Specify the module name, master name, and JSON schema definition. The schema code will be generated as module.master."}
          </p>

          <div style={S.fieldGrid}>
            <div style={S.fieldWrap}>
              <label style={S.fieldLabel}>
                {t("WB_MODULE_NAME") || "Module Name"} <span style={S.required}>*</span>
              </label>
              <input
                type="text"
                style={{
                  ...S.input,
                  ...(focusedField === "module" ? S.inputFocused : {}),
                }}
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                onFocus={() => setFocusedField("module")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. common-masters"
              />
              <span style={S.hint}>No spaces allowed. Use camelCase or hyphen-separated.</span>
            </div>

            <div style={S.fieldWrap}>
              <label style={S.fieldLabel}>
                {t("WB_MASTER_NAME") || "Master Name"} <span style={S.required}>*</span>
              </label>
              <input
                type="text"
                style={{
                  ...S.input,
                  ...(focusedField === "master" ? S.inputFocused : {}),
                }}
                value={masterName}
                onChange={(e) => setMasterName(e.target.value)}
                onFocus={() => setFocusedField("master")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Department"
              />
              <span style={S.hint}>No spaces allowed. Use camelCase or PascalCase.</span>
            </div>
          </div>

          {schemaCode && (
            <div style={{ ...S.infoBox, marginBottom: "18px" }}>
              Schema Code: <strong>{schemaCode}</strong>
            </div>
          )}

          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>{t("WB_DESCRIPTION") || "Description"}</label>
            <input
              type="text"
              style={{
                ...S.input,
                ...(focusedField === "desc" ? S.inputFocused : {}),
                marginBottom: "18px",
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocusedField("desc")}
              onBlur={() => setFocusedField(null)}
              placeholder="Optional description for this schema"
            />
          </div>

          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>
              {t("WB_JSON_SCHEMA") || "JSON Schema Definition"} <span style={S.required}>*</span>
            </label>
            <textarea
              style={{
                ...S.textarea,
                ...(focusedField === "schema" ? S.inputFocused : {}),
                ...(schemaError ? S.inputError : {}),
              }}
              value={schemaJson}
              onChange={handleSchemaChange}
              onFocus={() => setFocusedField("schema")}
              onBlur={() => setFocusedField(null)}
            />
            {schemaError && <div style={S.errorMsg}>Invalid JSON: {schemaError}</div>}
            <span style={S.hint}>Must be a valid JSON Schema (draft-07 recommended).</span>
          </div>

          <div style={S.btnRow}>
            <button type="button" style={{ ...S.btn, ...S.btnPrimary }} onClick={handleNext}>
              Next: Add Data &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 1: Add Data ═══ */}
      {step === 1 && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>{t("WB_ADD_DATA") || "Add Initial Data"}</h3>
          <p style={S.cardDesc}>
            {t("WB_ADD_DATA_DESC") || "Add the first data record for this master. The data must conform to the schema defined in the previous step."}
          </p>

          <div style={{ ...S.infoBox, marginBottom: "18px" }}>
            Creating data for: <strong>{schemaCode}</strong>
          </div>

          <div style={{ ...S.fieldGrid, gridTemplateColumns: "1fr" }}>
            <div style={S.fieldWrap}>
              <label style={S.fieldLabel}>
                {t("WB_UNIQUE_ID") || "Unique Identifier"} <span style={S.required}>*</span>
              </label>
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
                placeholder="e.g. 1 or DEPT_001"
              />
              <span style={S.hint}>A unique key to identify this record within the master. Usually an id, code, or name.</span>
            </div>
          </div>

          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>
              {t("WB_DATA_JSON") || "Data (JSON)"} <span style={S.required}>*</span>
            </label>
            <textarea
              style={{
                ...S.textarea,
                ...(focusedField === "data" ? S.inputFocused : {}),
                ...(dataError ? S.inputError : {}),
              }}
              value={dataJson}
              onChange={handleDataChange}
              onFocus={() => setFocusedField("data")}
              onBlur={() => setFocusedField(null)}
            />
            {dataError && <div style={S.errorMsg}>Invalid JSON: {dataError}</div>}
            <span style={S.hint}>Must be a valid JSON object conforming to the schema definition.</span>
          </div>

          <div style={S.btnRow}>
            <button type="button" style={{ ...S.btn, ...S.btnOutline }} onClick={handleBack}>
              &larr; Back
            </button>
            <button type="button" style={{ ...S.btn, ...S.btnPrimary }} onClick={handleNext}>
              Next: Review &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: Review & Create ═══ */}
      {step === 2 && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>{t("WB_REVIEW") || "Review & Confirm"}</h3>
          <p style={S.cardDesc}>{t("WB_REVIEW_DESC") || "Review the details below before creating the schema and data record."}</p>

          {/* Schema summary */}
          <div style={{ ...S.card, border: `1px solid ${GRAY200}`, boxShadow: "none", marginBottom: "16px" }}>
            <h4 style={{ ...S.cardTitle, fontSize: "14px" }}>Schema Definition</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div style={S.fieldWrap}>
                <span style={S.fieldLabel}>Module</span>
                <span style={{ fontSize: "14px", color: GRAY900, fontWeight: 600 }}>{moduleName}</span>
              </div>
              <div style={S.fieldWrap}>
                <span style={S.fieldLabel}>Master</span>
                <span style={{ fontSize: "14px", color: GRAY900, fontWeight: 600 }}>{masterName}</span>
              </div>
              <div style={S.fieldWrap}>
                <span style={S.fieldLabel}>Schema Code</span>
                <span style={{ ...S.badge, background: TEAL_LIGHT, color: TEAL }}>{schemaCode}</span>
              </div>
              {description && (
                <div style={S.fieldWrap}>
                  <span style={S.fieldLabel}>Description</span>
                  <span style={{ fontSize: "13px", color: GRAY600 }}>{description}</span>
                </div>
              )}
            </div>
            <div style={S.fieldWrap}>
              <span style={S.fieldLabel}>JSON Schema</span>
              <div style={S.preview}>
                <pre style={S.previewPre}>{schemaJson}</pre>
              </div>
            </div>
          </div>

          {/* Data summary */}
          <div style={{ ...S.card, border: `1px solid ${GRAY200}`, boxShadow: "none" }}>
            <h4 style={{ ...S.cardTitle, fontSize: "14px" }}>Data Record</h4>
            <div style={{ marginBottom: "14px" }}>
              <div style={S.fieldWrap}>
                <span style={S.fieldLabel}>Unique Identifier</span>
                <span style={{ fontSize: "14px", color: GRAY900, fontWeight: 600 }}>{uniqueIdentifier}</span>
              </div>
            </div>
            <div style={S.fieldWrap}>
              <span style={S.fieldLabel}>Data</span>
              <div style={S.preview}>
                <pre style={S.previewPre}>{dataJson}</pre>
              </div>
            </div>
          </div>

          <div style={S.btnRow}>
            <button type="button" style={{ ...S.btn, ...S.btnOutline }} onClick={handleBack}>
              &larr; Back
            </button>
            <button type="button" style={{ ...S.btn, ...S.btnPrimary, ...(saving ? S.btnDisabled : {}) }} onClick={handleCreate} disabled={saving}>
              {saving ? "\u23F3 Creating..." : "\u2714 Create"}
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Success ═══ */}
      {step === 3 && (
        <div style={S.card}>
          <div style={S.successPanel}>
            <div style={S.successIcon}>&#10003;</div>
            <h2 style={S.successTitle}>{t("WB_CREATE_SUCCESS") || "Successfully Created!"}</h2>
            <p style={S.successDesc}>
              Schema <strong>{schemaCode}</strong> and its initial data record have been created.
            </p>
            <div style={S.successLinks}>
              <button
                type="button"
                style={{ ...S.btn, ...S.btnPrimary }}
                onClick={() =>
                  history.push(
                    `/${window?.contextPath}/employee/workbench/mdms-view?module=${encodeURIComponent(moduleName)}&master=${encodeURIComponent(
                      masterName
                    )}`
                  )
                }
              >
                &#128269; View Records
              </button>
              <button
                type="button"
                style={{ ...S.btn, ...S.btnOutline }}
                onClick={() => {
                  setStep(0);
                  setModuleName("");
                  setMasterName("");
                  setDescription("");
                  setSchemaJson(DEFAULT_SCHEMA);
                  setSchemaError(null);
                  setUniqueIdentifier("");
                  setDataJson(DEFAULT_DATA);
                  setDataError(null);
                }}
              >
                &#43; Create Another
              </button>
              <Link to={backUrl} style={{ ...S.btn, ...S.btnOutline, textDecoration: "none" }}>
                &larr; Back to Search
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MDMSCreateV2;
