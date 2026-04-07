import { Loader } from "@egovernments/digit-ui-react-components";
import set from "lodash/set";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const RED = "#dc2626";
const RED_LIGHT = "#fee2e2";
const ORANGE = "#ea580c";
const GRAY50 = "#f9fafb";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY300 = "#d1d5db";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

/* ─────────────── inline styles ─────────────── */
const S = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: "20px",
  },
  modal: {
    background: WHITE,
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    maxWidth: "580px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "24px 28px",
    borderBottom: "1px solid " + GRAY200,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },
  closeBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: GRAY100,
    color: GRAY700,
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  closeBtnHover: {
    background: GRAY200,
  },
  body: {
    padding: "24px 28px",
    overflowY: "auto",
    flex: 1,
  },
  fieldWrap: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: GRAY700,
    marginBottom: "6px",
    display: "block",
  },
  required: {
    color: RED,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    fontSize: "14px",
    color: GRAY900,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
    background: WHITE,
  },
  inputFocus: {
    borderColor: TEAL,
  },
  inputDisabled: {
    background: GRAY50,
    color: GRAY500,
    cursor: "not-allowed",
  },
  textarea: {
    minHeight: "80px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  /* dropdown */
  ddWrap: {
    position: "relative",
  },
  ddBtn: {
    width: "100%",
    padding: "10px 12px",
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
  },
  ddPlaceholder: {
    color: GRAY400,
  },
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
    zIndex: 9999,
    maxHeight: "220px",
    overflowY: "auto",
  },
  ddItem: {
    padding: "10px 12px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  ddItemHover: {
    background: TEAL_LIGHT,
  },
  ddItemActive: {
    background: TEAL_LIGHT,
    color: TEAL,
    fontWeight: 600,
  },
  /* file upload */
  uploadWrap: {
    border: "1.5px dashed " + GRAY300,
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    background: GRAY50,
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
  },
  uploadWrapHover: {
    borderColor: TEAL,
    background: TEAL_LIGHT,
  },
  uploadIcon: {
    fontSize: "32px",
    color: GRAY400,
    marginBottom: "8px",
  },
  uploadText: {
    fontSize: "13px",
    color: GRAY500,
    marginBottom: "4px",
  },
  uploadHint: {
    fontSize: "11px",
    color: GRAY400,
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: GRAY50,
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
  },
  fileIcon: {
    fontSize: "24px",
    color: TEAL,
  },
  fileName: {
    flex: 1,
    fontSize: "13px",
    color: GRAY700,
    fontWeight: 500,
  },
  fileRemove: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "none",
    background: RED_LIGHT,
    color: RED,
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: "12px",
    color: RED,
    marginTop: "4px",
  },
  /* footer */
  footer: {
    padding: "20px 28px",
    borderTop: "1px solid " + GRAY200,
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
  btnCancel: {
    background: WHITE,
    color: GRAY700,
    border: "1px solid " + GRAY200,
  },
  btnSubmit: {
    background: "linear-gradient(135deg, " + TEAL + " 0%, #1aabb8 100%)",
    color: WHITE,
    boxShadow: "0 2px 6px rgba(13,106,130,0.18)",
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

/* ─────────────── sub-component: Dropdown ─────────────── */
const Dropdown = ({ label, required, options = [], selected, onSelect, placeholder, optionKey = "i18key" }) => {
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>
        {label} {required && <span style={S.required}>*</span>}
      </label>
      <div ref={ref} style={S.ddWrap}>
        <button type="button" style={S.ddBtn} onClick={() => setOpen(!open)}>
          <span style={selected ? {} : S.ddPlaceholder}>{selected ? selected[optionKey] : placeholder || "Select..."}</span>
          <span>&#9662;</span>
        </button>
        {open && (
          <div style={S.ddPanel}>
            {options.map((opt, idx) => {
              const isSelected = selected && selected.code === opt.code;
              return (
                <div
                  key={opt.code || idx}
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
                  }}
                >
                  {opt[optionKey]}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────── sub-component: FileUpload ─────────────── */
const FileUpload = ({ label, file, onFileSelect, onFileRemove, error }) => {
  const [hover, setHover] = useState(false);
  const inputRef = useRef(null);

  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>{label}</label>
      {!file ? (
        <div
          style={{ ...S.uploadWrap, ...(hover ? S.uploadWrapHover : {}) }}
          onClick={() => inputRef.current?.click()}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div style={S.uploadIcon}>&#128206;</div>
          <div style={S.uploadText}>Click to upload</div>
          <div style={S.uploadHint}>PDF, PNG, JPEG (max 5MB)</div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
          />
        </div>
      ) : (
        <div style={S.filePreview}>
          <div style={S.fileIcon}>&#128196;</div>
          <div style={S.fileName}>{file.name}</div>
          <button type="button" style={S.fileRemove} onClick={onFileRemove}>
            &times;
          </button>
        </div>
      )}
      {error && <div style={S.errorText}>{error}</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   EmployeeActionModal — main component
   ═══════════════════════════════════════════════ */
const EmployeeActionModal = ({ t, action, tenantId, closeModal, applicationData }) => {
  const history = useHistory();
  const [selectedReason, setSelectedReason] = useState(null);
  const [orderNo, setOrderNo] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  const tenant = Digit.ULBService.getStateId() || tenantId?.split(".")?.[0];
  const { isLoading, data } = Digit.Hooks.hrms.useHrmsMDMS(tenant, "egov-hrms", "DeactivationReason");

  const reasons =
    data?.["egov-hrms"]?.DeactivationReason?.map((ele) => ({
      ...ele,
      i18key: t("EGOV_HRMS_DEACTIVATIONREASON_" + ele.code),
    })) || [];

  const isDeactivate = action === "DEACTIVATE_EMPLOYEE_HEAD";
  const title = isDeactivate ? t("HR_DEACTIVATE_EMPLOYEE_HEAD") : t("HR_ACTIVATE_EMPLOYEE_HEAD");
  const reasonLabel = isDeactivate ? t("HR_DEACTIVATION_REASON") : t("HR_ACTIVATION_REASON");

  /* file upload handler */
  const handleFileSelect = async (selectedFile) => {
    setFileError(null);
    if (selectedFile.size >= 5242880) {
      setFileError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
      return;
    }
    setFile(selectedFile);
    setUploading(true);
    try {
      const response = await Digit.UploadServices.Filestorage("HRMS", selectedFile, Digit.ULBService.getStateId());
      if (response?.data?.files?.length > 0) {
        setUploadedFileId(response.data.files[0].fileStoreId);
      } else {
        setFileError(t("CS_FILE_UPLOAD_ERROR"));
      }
    } catch (err) {
      setFileError(t("CS_FILE_UPLOAD_ERROR"));
    } finally {
      setUploading(false);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setUploadedFileId(null);
    setFileError(null);
  };

  /* submit handler */
  const handleSubmit = () => {
    if (!selectedReason) return;

    const effectiveTimestamp = new Date(effectiveFrom).getTime();
    let Employees = [...applicationData.Employees];

    if (isDeactivate) {
      if (file && uploadedFileId) {
        const document = {
          referenceType: "DEACTIVATION",
          documentId: uploadedFileId,
          documentName: file.name,
        };
        Employees[0].documents = Employees[0].documents || [];
        Employees[0].documents.push(document);
      }

      set(Employees[0], "deactivationDetails[0].effectiveFrom", effectiveTimestamp);
      set(Employees[0], "deactivationDetails[0].orderNo", orderNo);
      set(Employees[0], "deactivationDetails[0].reasonForDeactivation", selectedReason.code);
      set(Employees[0], "deactivationDetails[0].remarks", remarks);
      Employees[0].isActive = false;

      history.replace(`/${window?.contextPath}/employee/hrms/response`, { Employees, key: "UPDATE", action: "DEACTIVATION" });
    } else {
      if (file && uploadedFileId) {
        const document = {
          referenceType: "ACTIVATION",
          documentId: uploadedFileId,
          documentName: file.name,
        };
        Employees[0].documents = Employees[0].documents || [];
        Employees[0].documents.push(document);
      }

      set(Employees[0], "reactivationDetails[0].effectiveFrom", effectiveTimestamp);
      set(Employees[0], "reactivationDetails[0].orderNo", orderNo);
      set(Employees[0], "reactivationDetails[0].reasonForDeactivation", selectedReason.code);
      set(Employees[0], "reactivationDetails[0].remarks", remarks);
      Employees[0].isActive = true;

      history.replace(`/${window?.contextPath}/employee/hrms/response`, { Employees, key: "UPDATE", action: "ACTIVATION" });
    }
  };

  const canSubmit = selectedReason && !uploading;

  if (isLoading) {
    return (
      <div style={S.overlay}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={S.overlay} onClick={closeModal}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        {/* ── header ── */}
        <div style={S.header}>
          <h2 style={S.title}>{title}</h2>
          <button
            type="button"
            style={{ ...S.closeBtn, ...(closeHover ? S.closeBtnHover : {}) }}
            onClick={closeModal}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
          >
            &times;
          </button>
        </div>

        {/* ── body ── */}
        <div style={S.body}>
          <Dropdown
            label={reasonLabel}
            required
            options={reasons}
            selected={selectedReason}
            onSelect={setSelectedReason}
            placeholder={t("HR_SELECT_REASON")}
            optionKey="i18key"
          />

          <div style={S.fieldWrap}>
            <label style={S.label}>{t("HR_ORDER_NO")}</label>
            <input type="text" style={S.input} value={orderNo} onChange={(e) => setOrderNo(e.target.value)} placeholder={t("HR_ENTER_ORDER_NO")} />
          </div>

          <div style={S.fieldWrap}>
            <label style={S.label}>
              {t("HR_EFFECTIVE_DATE")} <span style={S.required}>*</span>
            </label>
            <input type="date" style={{ ...S.input, ...S.inputDisabled }} value={effectiveFrom} disabled />
          </div>

          <FileUpload
            label={t("HR_APPROVAL_UPLOAD_HEAD")}
            file={file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            error={fileError}
          />

          <div style={S.fieldWrap}>
            <label style={S.label}>{t("HR_REMARKS")}</label>
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={t("HR_ENTER_REMARKS")}
            />
          </div>
        </div>

        {/* ── footer ── */}
        <div style={S.footer}>
          <button type="button" style={{ ...S.btn, ...S.btnCancel }} onClick={closeModal}>
            {t("HR_COMMON_BUTTON_CANCEL") || "Cancel"}
          </button>
          <button
            type="button"
            style={{ ...S.btn, ...S.btnSubmit, ...(canSubmit ? {} : S.btnDisabled) }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {uploading ? t("HR_UPLOADING") || "Uploading..." : title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeActionModal;
