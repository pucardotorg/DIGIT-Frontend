import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Toast, Loader } from "@egovernments/digit-ui-react-components";

const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GRAY50 = "#f9fafb";
const GRAY200 = "#e5e7eb";
const GRAY500 = "#6b7280";
const GRAY900 = "#111827";
const WHITE = "#ffffff";
const RED = "#dc2626";

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
  formCard: {
    background: WHITE,
    borderRadius: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    padding: "28px 32px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: TEAL,
  },
  row: {
    background: GRAY50,
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "16px",
    border: `1px solid ${GRAY200}`,
  },
  rowHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  rowTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: GRAY900,
  },
  removeBtn: {
    padding: "6px 12px",
    fontSize: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "#fee2e2",
    color: RED,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(13,106,130,0.18)",
    transition: "transform 0.12s, box-shadow 0.12s",
  },
  btnSecondary: {
    background: WHITE,
    color: TEAL,
    padding: "12px 24px",
    borderRadius: "8px",
    border: `2px solid ${TEAL}`,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  btnGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  required: {
    color: RED,
  },
};

const LocalizationCreate = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [rows, setRows] = useState([{ id: Date.now(), code: "", message: "", module: "rainmaker-common", locale: "en_IN" }]);

  const [showToast, setShowToast] = useState(null);

  const { mutate: createLocalization, isLoading } = Digit.Hooks.workbench.useLocalizationCreate(tenantId);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), code: "", message: "", module: "rainmaker-common", locale: "en_IN" }]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleCreate = () => {
    const hasEmptyFields = rows.some((row) => !row.code || !row.message || !row.module);
    if (hasEmptyFields) {
      setShowToast({ error: true, label: "Please fill all required fields" });
      return;
    }

    const messages = rows.map((row) => ({
      code: row.code,
      message: row.message,
      module: row.module,
      locale: row.locale,
    }));

    createLocalization(
      { messages },
      {
        onSuccess: () => {
          setShowToast({ error: false, label: "Localization entries created successfully" });
          setTimeout(() => {
            history.push(`/${window?.contextPath}/employee/workbench/localization-search`);
          }, 2000);
        },
        onError: () => {
          setShowToast({ error: true, label: "Failed to create localization entries" });
        },
      }
    );
  };

  return (
    <div style={S.page}>
      {showToast && <Toast error={showToast.error} label={showToast.label} onClose={() => setShowToast(null)} />}

      <div style={S.breadcrumb}>
        <a
          href={`/${window?.contextPath}/employee/workbench/localization-search`}
          style={S.breadcrumbLink}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/${window?.contextPath}/employee/workbench/localization-search`);
          }}
        >
          &larr; {t("WB_BACK_TO_SEARCH") || "Back to Search"}
        </a>
      </div>

      <div style={S.heroCard}>
        <div style={S.heroAccent} />
        <div style={S.heroBody}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={S.heroIcon}>&#43;</div>
              <h1 style={S.heroTitle}>{t("WB_CREATE_LOCALIZATION") || "Create Localization"}</h1>
              <p style={S.heroSub}>
                {t("WB_CREATE_LOCALIZATION_DESC") || "Add new localization entries manually. You can add multiple entries at once."}
              </p>
            </div>
            <button
              type="button"
              style={{
                background: "linear-gradient(135deg, #0d6a82 0%, #1aabb8 100%)",
                color: "#ffffff",
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
              }}
              onClick={() => history.push(`/${window?.contextPath}/employee/workbench/localization-upload`)}
            >
              📤 {t("WB_UPLOAD_FILE") || "Upload File"}
            </button>
          </div>
        </div>
      </div>

      <div style={S.formCard}>
        {rows.map((row, index) => (
          <div key={row.id} style={S.row}>
            <div style={S.rowHeader}>
              <span style={S.rowTitle}>Entry {index + 1}</span>
              {rows.length > 1 && (
                <button type="button" style={S.removeBtn} onClick={() => handleRemoveRow(row.id)}>
                  Remove
                </button>
              )}
            </div>

            <div style={S.grid}>
              <div>
                <label style={S.label}>
                  Code <span style={S.required}>*</span>
                </label>
                <input
                  type="text"
                  style={S.input}
                  placeholder="e.g., CS_COMMON_SUBMIT"
                  value={row.code}
                  onChange={(e) => handleRowChange(row.id, "code", e.target.value)}
                />
              </div>

              <div>
                <label style={S.label}>
                  Module <span style={S.required}>*</span>
                </label>
                <input
                  type="text"
                  style={S.input}
                  placeholder="e.g., rainmaker-common"
                  value={row.module}
                  onChange={(e) => handleRowChange(row.id, "module", e.target.value)}
                />
              </div>

              <div style={S.fullWidth}>
                <label style={S.label}>
                  Message <span style={S.required}>*</span>
                </label>
                <input
                  type="text"
                  style={S.input}
                  placeholder="e.g., Submit"
                  value={row.message}
                  onChange={(e) => handleRowChange(row.id, "message", e.target.value)}
                />
              </div>

              <div>
                <label style={S.label}>Locale</label>
                <input
                  type="text"
                  style={S.input}
                  placeholder="e.g., en_IN"
                  value={row.locale}
                  onChange={(e) => handleRowChange(row.id, "locale", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" style={S.btnSecondary} onClick={handleAddRow}>
          &#43; Add More
        </button>

        <div style={S.btnGroup}>
          <button type="button" style={S.btnSecondary} onClick={() => history.push(`/${window?.contextPath}/employee/workbench/localization-search`)}>
            Cancel
          </button>
          <button type="button" style={S.btnPrimary} onClick={handleCreate} disabled={isLoading}>
            {isLoading ? <Loader /> : t("WB_CREATE") || "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalizationCreate;
