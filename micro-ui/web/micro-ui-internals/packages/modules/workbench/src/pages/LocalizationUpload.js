import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Toast, Loader } from "@egovernments/digit-ui-react-components";
import XLSX from "xlsx";

const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GRAY50 = "#f9fafb";
const GRAY200 = "#e5e7eb";
const GRAY300 = "#d1d5db";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

const REQUIRED_COLUMNS = ["Code", "Module", "Message", "Locale"];

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
    padding: "32px",
  },
  heroIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  heroTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: GRAY900,
    marginBottom: "8px",
  },
  heroSub: {
    fontSize: "14px",
    color: GRAY500,
    lineHeight: 1.6,
  },
  formCard: {
    background: WHITE,
    borderRadius: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    padding: "32px",
    marginBottom: "24px",
  },
  uploadArea: {
    border: `2px dashed ${GRAY300}`,
    borderRadius: "12px",
    padding: "48px 32px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    background: GRAY50,
  },
  uploadAreaDragOver: {
    borderColor: TEAL,
    background: TEAL_LIGHT,
  },
  uploadIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    color: GRAY500,
  },
  uploadTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: GRAY900,
    marginBottom: "8px",
  },
  uploadDesc: {
    fontSize: "14px",
    color: GRAY500,
    marginBottom: "16px",
  },
  uploadButton: {
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
  },
  fileInput: {
    display: "none",
  },
  fileInfo: {
    marginTop: "24px",
    padding: "16px",
    background: GRAY50,
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
  },
  fileName: {
    fontSize: "14px",
    fontWeight: 600,
    color: GRAY900,
    marginBottom: "4px",
  },
  fileSize: {
    fontSize: "13px",
    color: GRAY500,
  },
  previewSection: {
    marginTop: "24px",
  },
  previewTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: GRAY900,
    marginBottom: "12px",
  },
  previewTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    marginBottom: "16px",
  },
  previewTh: {
    background: GRAY50,
    padding: "12px",
    textAlign: "left",
    fontWeight: 600,
    color: GRAY700,
    borderBottom: `2px solid ${GRAY200}`,
  },
  previewTd: {
    padding: "12px",
    borderBottom: `1px solid ${GRAY200}`,
    color: GRAY700,
  },
  previewCount: {
    fontSize: "13px",
    color: GRAY500,
    marginBottom: "16px",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
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
  },
  btnSecondary: {
    background: WHITE,
    color: GRAY700,
    padding: "10px 24px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  infoBox: {
    background: TEAL_LIGHT,
    border: `1px solid ${TEAL}`,
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: TEAL,
    marginBottom: "8px",
  },
  infoList: {
    fontSize: "13px",
    color: GRAY700,
    lineHeight: 1.8,
    paddingLeft: "20px",
  },
};

const LocalizationUpload = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutate: updateLocalization, isLoading } = Digit.Hooks.workbench.useLocalizationUpdate(tenantId);

  const validateColumns = (columns) => {
    const missingColumns = REQUIRED_COLUMNS.filter((col) => !columns.includes(col));
    if (missingColumns.length > 0) {
      return {
        valid: false,
        message: `Missing required columns: ${missingColumns.join(", ")}. Required columns are: ${REQUIRED_COLUMNS.join(", ")}`,
      };
    }
    return { valid: true };
  };

  const parseExcelFile = (file) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length === 0) {
          setShowToast({ error: true, label: "Excel file is empty" });
          setIsProcessing(false);
          return;
        }

        const columns = Object.keys(jsonData[0]);
        const validation = validateColumns(columns);

        if (!validation.valid) {
          setShowToast({ error: true, label: validation.message });
          setFile(null);
          setParsedData([]);
          setIsProcessing(false);
          return;
        }

        const validData = jsonData.filter((row) => row.Code && row.Module && row.Message && row.Locale);

        if (validData.length === 0) {
          setShowToast({ error: true, label: "No valid data found in the file" });
          setIsProcessing(false);
          return;
        }

        setParsedData(validData);
        setShowToast({ error: false, label: `Successfully parsed ${validData.length} entries` });
        setIsProcessing(false);
      } catch (error) {
        console.error("Excel parsing error:", error);
        setShowToast({ error: true, label: `Failed to parse Excel file: ${error.message}` });
        setFile(null);
        setParsedData([]);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setShowToast({ error: true, label: "Failed to read file" });
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setShowToast({ error: true, label: "Please upload an Excel file (.xlsx or .xls)" });
      return;
    }

    setFile(selectedFile);
    parseExcelFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = () => {
    if (parsedData.length === 0) {
      setShowToast({ error: true, label: "No data to upload" });
      return;
    }

    // Group messages by locale and module for update API
    const groupedMessages = {};
    parsedData.forEach((row) => {
      const key = `${row.Locale}|${row.Module}`;
      if (!groupedMessages[key]) {
        groupedMessages[key] = [];
      }
      groupedMessages[key].push({
        code: row.Code,
        message: row.Message,
      });
    });

    // Process each group
    const updatePromises = Object.entries(groupedMessages).map(([key, messages]) => {
      const [locale, module] = key.split("|");
      return updateLocalization({
        locale,
        module,
        messages,
      });
    });

    // Execute all updates
    Promise.all(updatePromises)
      .then(() => {
        setShowToast({ error: false, label: "Localization entries updated successfully" });
        setTimeout(() => {
          history.push(`/${window?.contextPath}/employee/workbench/localization-search`);
        }, 1500);
      })
      .catch(() => {
        setShowToast({ error: true, label: "Failed to update localization entries" });
      });
  };

  const handleClear = () => {
    setFile(null);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div style={S.page}>
      {showToast && <Toast error={showToast.error} label={showToast.label} onClose={() => setShowToast(null)} />}

      <div style={S.breadcrumb}>
        <a
          href={`/${window?.contextPath}/employee/workbench/localization-create`}
          style={S.breadcrumbLink}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/${window?.contextPath}/employee/workbench/localization-create`);
          }}
        >
          &larr; {t("WB_BACK_TO_CREATE") || "Back to Create"}
        </a>
      </div>

      <div style={S.heroCard}>
        <div style={S.heroAccent} />
        <div style={S.heroBody}>
          <div style={S.heroIcon}>📤</div>
          <h1 style={S.heroTitle}>{t("WB_UPLOAD_LOCALIZATION") || "Upload Localization File"}</h1>
          <p style={S.heroSub}>
            {t("WB_UPLOAD_LOCALIZATION_DESC") || "Upload an Excel file containing localization entries. The file must have the required columns."}
          </p>
        </div>
      </div>

      <div style={S.formCard}>
        <div style={S.infoBox}>
          <div style={S.infoTitle}>📋 Required Excel Format</div>
          <ul style={S.infoList}>
            <li>File must be in Excel format (.xlsx or .xls)</li>
            <li>
              Required columns (exact names): <strong>Code</strong>, <strong>Module</strong>, <strong>Message</strong>, <strong>Locale</strong>
            </li>
            <li>All four columns must have values for each row</li>
            <li>Column headers are case-sensitive</li>
          </ul>
        </div>

        <div
          style={{
            ...S.uploadArea,
            ...(dragOver ? S.uploadAreaDragOver : {}),
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={S.uploadIcon}>📁</div>
          <div style={S.uploadTitle}>{t("WB_DRAG_DROP_FILE") || "Drag and drop your Excel file here"}</div>
          <div style={S.uploadDesc}>{t("WB_OR_CLICK_TO_BROWSE") || "or click to browse"}</div>
          <button type="button" style={S.uploadButton}>
            {t("WB_SELECT_FILE") || "Select File"}
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={S.fileInput} onChange={(e) => handleFileSelect(e.target.files[0])} />
        </div>

        {file && (
          <div style={S.fileInfo}>
            <div style={S.fileName}>📄 {file.name}</div>
            <div style={S.fileSize}>{formatFileSize(file.size)}</div>
          </div>
        )}

        {isProcessing && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Loader />
            <div style={{ marginTop: "12px", fontSize: "14px", color: GRAY500 }}>Processing file...</div>
          </div>
        )}

        {parsedData.length > 0 && !isProcessing && (
          <div style={S.previewSection}>
            <div style={S.previewTitle}>Preview Data</div>
            <div style={S.previewCount}>
              {parsedData.length} {parsedData.length === 1 ? "entry" : "entries"} found
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={S.previewTable}>
                <thead>
                  <tr>
                    <th style={S.previewTh}>Code</th>
                    <th style={S.previewTh}>Module</th>
                    <th style={S.previewTh}>Message</th>
                    <th style={S.previewTh}>Locale</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      <td style={S.previewTd}>{row.Code}</td>
                      <td style={S.previewTd}>{row.Module}</td>
                      <td style={S.previewTd}>{row.Message}</td>
                      <td style={S.previewTd}>{row.Locale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 10 && (
              <div style={{ fontSize: "13px", color: GRAY500, marginTop: "8px" }}>Showing first 10 entries. Total: {parsedData.length}</div>
            )}
          </div>
        )}

        <div style={S.actionButtons}>
          <button type="button" style={S.btnSecondary} onClick={handleClear} disabled={!file}>
            {t("WB_CLEAR") || "Clear"}
          </button>
          <button type="button" style={S.btnPrimary} onClick={handleUpload} disabled={parsedData.length === 0 || isLoading}>
            {isLoading ? "Uploading..." : t("WB_UPLOAD") || "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalizationUpload;
