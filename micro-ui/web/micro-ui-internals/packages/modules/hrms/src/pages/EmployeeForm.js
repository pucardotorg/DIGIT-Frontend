import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, Link } from "react-router-dom";
import { convertEpochToDate } from "../components/Utils";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const RED = "#dc2626";
const RED_LIGHT = "#fee2e2";
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
    marginBottom: "20px",
    cursor: "pointer",
  },
  heroCard: {
    background: WHITE,
    borderRadius: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    padding: "28px 32px",
    marginBottom: "20px",
    position: "relative",
    overflow: "hidden",
  },
  heroAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, " + TEAL + " 0%, #1aabb8 100%)" },
  heroTitle: { fontSize: "22px", fontWeight: 700, color: GRAY900, margin: 0 },
  heroSub: { fontSize: "13px", color: GRAY500, marginTop: "4px" },
  section: { background: WHITE, borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: "16px", overflow: "visible" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", padding: "18px 24px 14px", borderBottom: "1px solid " + GRAY100 },
  sectionIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
    background: TEAL_LIGHT,
    color: TEAL,
  },
  sectionTitle: { fontSize: "15px", fontWeight: 700, color: GRAY900, margin: 0 },
  sectionBody: { padding: "20px 24px 24px", overflow: "visible" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", fontWeight: 600, color: GRAY500, textTransform: "uppercase", letterSpacing: "0.4px" },
  required: { color: RED },
  input: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    fontSize: "14px",
    color: GRAY900,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
    background: WHITE,
  },
  inputFocus: { borderColor: TEAL },
  inputError: { borderColor: RED },
  inputDisabled: { background: GRAY50, color: GRAY500, cursor: "not-allowed" },
  errorText: { fontSize: "11px", color: RED, marginTop: "2px" },
  hintText: { fontSize: "11px", color: GRAY400, marginTop: "2px" },
  /* dropdown */
  ddWrap: { position: "relative" },
  ddBtn: {
    width: "100%",
    padding: "9px 12px",
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
    maxHeight: "260px",
    overflowY: "auto",
  },
  ddSearch: {
    width: "100%",
    padding: "8px 12px",
    border: "none",
    borderBottom: "1px solid " + GRAY100,
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  ddItem: { padding: "8px 12px", fontSize: "13px", cursor: "pointer", transition: "background 0.1s" },
  ddItemActive: { background: TEAL_LIGHT, color: TEAL, fontWeight: 600 },
  /* multi-select */
  msTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 500,
    background: TEAL_LIGHT,
    color: TEAL,
    marginRight: "4px",
    marginBottom: "4px",
  },
  msRemove: { cursor: "pointer", fontSize: "14px", lineHeight: 1, color: TEAL, fontWeight: 700 },
  msCheckLabel: { display: "flex", alignItems: "center", gap: "8px", padding: "7px 12px", cursor: "pointer", fontSize: "13px" },
  /* assignment card */
  assignCard: {
    border: "1px solid " + GRAY200,
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "12px",
    background: GRAY50,
    overflow: "visible",
  },
  assignHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" },
  assignIdx: { fontSize: "12px", fontWeight: 700, color: TEAL, background: TEAL_LIGHT, padding: "3px 10px", borderRadius: "12px" },
  removeBtn: { border: "none", background: "none", color: RED, fontSize: "18px", cursor: "pointer", fontWeight: 700, padding: "2px 6px" },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1.5px dashed " + TEAL,
    background: "transparent",
    color: TEAL,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  /* submit bar */
  submitBar: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" },
  submitBtn: {
    padding: "11px 28px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.12s, box-shadow 0.12s",
  },
  submitPrimary: { background: "linear-gradient(135deg, " + TEAL + " 0%, #1aabb8 100%)", color: WHITE, boxShadow: "0 2px 6px rgba(13,106,130,0.18)" },
  submitDisabled: { opacity: 0.5, cursor: "not-allowed" },
  /* toast */
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    zIndex: 9999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    maxWidth: "400px",
  },
  toastError: { background: RED_LIGHT, color: RED, border: "1px solid " + RED },
  toastSuccess: { background: "#dcfce7", color: GREEN, border: "1px solid " + GREEN },
};

/* ─────────── helpers ─────────── */
const getInitials = (name) => {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : p[0].substring(0, 2).toUpperCase();
};

/* ─────────── sub: SectionCard ─────────── */
const SectionCard = ({ icon, title, children }) => (
  <div style={S.section}>
    <div style={S.sectionHeader}>
      <div style={S.sectionIcon}>{icon}</div>
      <h3 style={S.sectionTitle}>{title}</h3>
    </div>
    <div style={S.sectionBody}>{children}</div>
  </div>
);

/* ─────────── sub: FormInput ─────────── */
const FormInput = ({ label, required: req, value, onChange, error, hint, disabled, type, prefix, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.fieldWrap}>
      <span style={S.label}>
        {label}
        {req && <span style={S.required}> *</span>}
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        {prefix && (
          <span
            style={{
              padding: "9px 8px 9px 12px",
              background: GRAY50,
              border: "1px solid " + GRAY200,
              borderRight: "none",
              borderRadius: "8px 0 0 8px",
              fontSize: "13px",
              color: GRAY700,
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type || "text"}
          style={{
            ...S.input,
            ...(focused ? S.inputFocus : {}),
            ...(error ? S.inputError : {}),
            ...(disabled ? S.inputDisabled : {}),
            ...(prefix ? { borderRadius: "0 8px 8px 0" } : {}),
          }}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={placeholder || ""}
        />
      </div>
      {error && <span style={S.errorText}>{error}</span>}
      {hint && !error && <span style={S.hintText}>{hint}</span>}
    </div>
  );
};

/* ─────────── sub: FormSelect ─────────── */
const FormSelect = ({ label, required: req, options, selected, onSelect, optionKey, disabled, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = useMemo(() => {
    if (!options) return [];
    const q = search.toLowerCase();
    return q ? options.filter((o) => (t(o[optionKey]) || "").toLowerCase().includes(q)) : options;
  }, [options, search, t, optionKey]);

  return (
    <div style={S.fieldWrap}>
      <span style={S.label}>
        {label}
        {req && <span style={S.required}> *</span>}
      </span>
      <div style={S.ddWrap} ref={ref}>
        <button
          type="button"
          style={{ ...S.ddBtn, ...(disabled ? S.inputDisabled : {}), ...(error ? S.inputError : {}) }}
          onClick={() => !disabled && setOpen(!open)}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: selected ? GRAY900 : GRAY400 }}>
            {selected ? t(selected[optionKey]) : placeholder || "Select..."}
          </span>
          <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", fontSize: "12px" }}>{"\u25BC"}</span>
        </button>
        {open && (
          <div style={S.ddPanel}>
            <input style={S.ddSearch} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            {filtered.map((opt, i) => {
              const isActive = selected && selected[optionKey] === opt[optionKey];
              return (
                <div
                  key={i}
                  style={{ ...S.ddItem, ...(isActive ? S.ddItemActive : {}) }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = GRAY50;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "";
                  }}
                  onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {t(opt[optionKey])}
                </div>
              );
            })}
            {filtered.length === 0 && <div style={{ ...S.ddItem, color: GRAY400 }}>No options</div>}
          </div>
        )}
      </div>
      {error && <span style={S.errorText}>{error}</span>}
    </div>
  );
};

/* ─────────── sub: FormMultiSelect ─────────── */
const FormMultiSelect = ({ label, required: req, options, selected, onToggle, onRemove, optionKey, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = useMemo(() => {
    if (!options) return [];
    const q = search.toLowerCase();
    return q ? options.filter((o) => (t(o[optionKey]) || "").toLowerCase().includes(q)) : options;
  }, [options, search, t, optionKey]);

  const count = (selected || []).length;

  return (
    <div style={S.fieldWrap}>
      <span style={S.label}>
        {label}
        {req && <span style={S.required}> *</span>}
      </span>
      <div style={S.ddWrap} ref={ref}>
        <button type="button" style={{ ...S.ddBtn, ...(error ? S.inputError : {}) }} onClick={() => setOpen(!open)}>
          <span style={{ color: count > 0 ? GRAY900 : GRAY400 }}>{count > 0 ? count + " selected" : "Select roles..."}</span>
          <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", fontSize: "12px" }}>{"\u25BC"}</span>
        </button>
        {open && (
          <div style={S.ddPanel}>
            <input style={S.ddSearch} placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            {filtered.map((opt, i) => {
              const checked = (selected || []).some((s) => s.code === opt.code);
              return (
                <label key={i} style={S.msCheckLabel}>
                  <input type="checkbox" checked={checked} onChange={() => onToggle(opt)} style={{ width: "16px", height: "16px" }} />
                  <span>{t(opt[optionKey])}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      {count > 0 && (
        <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap" }}>
          {selected.map((role, i) => (
            <span key={i} style={S.msTag}>
              {t(role.labelKey || "ACCESSCONTROL_ROLES_ROLES_" + role.code)}{" "}
              <span style={S.msRemove} onClick={() => onRemove(i)}>
                &times;
              </span>
            </span>
          ))}
        </div>
      )}
      {error && <span style={S.errorText}>{error}</span>}
    </div>
  );
};

/* ─────────── sub: FormDate ─────────── */
const FormDate = ({ label, required: req, value, onChange, disabled, min, max, error, hint }) => (
  <div style={S.fieldWrap}>
    <span style={S.label}>
      {label}
      {req && <span style={S.required}> *</span>}
    </span>
    <input
      type="date"
      style={{ ...S.input, ...(disabled ? S.inputDisabled : {}), ...(error ? S.inputError : {}) }}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
    />
    {error && <span style={S.errorText}>{error}</span>}
    {hint && !error && <span style={S.hintText}>{hint}</span>}
  </div>
);

/* ─────────── sub: Toast ─────────── */
const ToastNotif = ({ message, isError, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div style={{ ...S.toast, ...(isError ? S.toastError : S.toastSuccess) }}>
      <span>{isError ? "\u26A0" : "\u2714"}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <span style={{ cursor: "pointer", fontWeight: 700, fontSize: "16px" }} onClick={onClose}>
        &times;
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   EmployeeForm — unified Create / Edit component
   ═══════════════════════════════════════════════ */
const EmployeeForm = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  /* ── mode detection ── */
  const isEdit = window.location.pathname.includes("/hrms/edit/");
  const employeeId = params.id;
  const empTenantId = params.tenantId || tenantId;

  /* ── data hooks ── */
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { data: empData, isLoading: empLoading } = Digit.Hooks.hrms.useHRMSSearch(
    isEdit ? { codes: employeeId } : null,
    empTenantId,
    null,
    isEdit ? isupdate : null
  );
  const { data: mdmsData, isLoading: mdmsLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  const { data: empTypeData, isLoading: empTypeLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "EmployeeType") || {};
  const { data: employeeRoleMapping } = Digit.Hooks.useCustomMDMS(stateId, "egov-hrms", [{ name: "EmployeeRolesMapping" }], {
    retry: false,
    enable: true,
  });

  const [mutationHappened, setMutationHappened, clearMutation] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  /* ── toast ── */
  const [toast, setToast] = useState(null);

  /* ── MDMS option getters ── */
  const employeeTypes = useMemo(() => {
    const raw = empTypeData && empTypeData["egov-hrms"] && empTypeData["egov-hrms"].EmployeeType;
    if (!raw) return [];
    return raw.map((a) => ({ ...a, i18key: t(a.code) })).sort((a, b) => (a.i18key || "").localeCompare(b.i18key || ""));
  }, [empTypeData, t]);

  const districts = useMemo(() => {
    const raw = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["common-masters"] && mdmsData.MdmsRes["common-masters"].District;
    if (!raw) return [];
    return raw.map((e) => ({ ...e, i18key: t("COMMON_MASTERS_DISTRICT_" + e.code) })).sort((a, b) => (a.i18key || "").localeCompare(b.i18key || ""));
  }, [mdmsData, t]);

  const courtEstablishments = useMemo(() => {
    const raw = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["common-masters"] && mdmsData.MdmsRes["common-masters"].CourtEstablishment;
    if (!raw) return [];
    return raw
      .map((e) => ({ ...e, i18key: t("COMMON_MASTERS_COURT_ESTABLISHMENT_" + e.code) }))
      .sort((a, b) => (a.i18key || "").localeCompare(b.i18key || ""));
  }, [mdmsData, t]);

  const courtRooms = useMemo(() => {
    const raw = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["common-masters"] && mdmsData.MdmsRes["common-masters"].Court_Rooms;
    if (!raw) return [];
    return raw
      .map((e) => ({ ...e, i18key: t("COMMON_MASTERS_COURT_ROOM_" + e.code) }))
      .sort((a, b) => (a.i18key || "").localeCompare(b.i18key || ""));
  }, [mdmsData, t]);

  const designations = useMemo(() => {
    const raw = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["common-masters"] && mdmsData.MdmsRes["common-masters"].Designation;
    if (!raw) return [];
    return raw
      .map((e) => ({ ...e, i18key: t("COMMON_MASTERS_DESIGNATION_" + e.code) }))
      .sort((a, b) => (a.i18key || "").localeCompare(b.i18key || ""));
  }, [mdmsData, t]);

  const allRoles = useMemo(() => {
    const raw = mdmsData && mdmsData.MdmsRes && mdmsData.MdmsRes["ACCESSCONTROL-ROLES"] && mdmsData.MdmsRes["ACCESSCONTROL-ROLES"].roles;
    if (!raw) return [];
    return raw
      .filter((r) => r && r.code)
      .map((r) => ({ code: r.code, name: r.name || " ", labelKey: "ACCESSCONTROL_ROLES_ROLES_" + r.code }))
      .sort((a, b) => (t(a.labelKey) || "").localeCompare(t(b.labelKey) || ""));
  }, [mdmsData, t]);

  /* ── form state ── */
  const emptyAssignment = {
    key: 0,
    fromDate: "",
    toDate: "",
    district: null,
    courtEstablishment: null,
    courtroom: null,
    designation: null,
    roles: [],
  };
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [empType, setEmpType] = useState(null);
  const [empCode, setEmpCode] = useState("");
  const [assignments, setAssignments] = useState([{ ...emptyAssignment }]);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [initialized, setInitialized] = useState(!isEdit);
  const [prevEmpType, setPrevEmpType] = useState(null);

  /* ── populate form for edit mode ── */
  useEffect(() => {
    if (!isEdit || !empData || !empData.Employees || empData.Employees.length === 0) return;
    const emp = empData.Employees[0];
    setName((emp.user && emp.user.name) || "");
    setPhone((emp.user && emp.user.mobileNumber) || "");
    setEmail((emp.user && emp.user.emailId) || "");
    setEmpType(emp.employeeType ? { code: emp.employeeType, active: true, i18key: t(emp.employeeType) } : null);
    setEmpCode(emp.code || "");
    const mapped = (emp.assignments || []).map((a, idx) => ({
      key: idx,
      id: a.id,
      auditDetails: a.auditDetails,
      position: a.position,
      govtOrderNumber: a.govtOrderNumber,
      tenantid: a.tenantid,
      fromDate: a.fromDate ? convertEpochToDate(a.fromDate) : "",
      toDate: a.toDate ? convertEpochToDate(a.toDate) : "",
      district: a.district ? { code: a.district, i18key: t("COMMON_MASTERS_DISTRICT_" + a.district) } : null,
      courtEstablishment: a.courtEstablishment
        ? { code: a.courtEstablishment, i18key: t("COMMON_MASTERS_COURT_ESTABLISHMENT_" + a.courtEstablishment) }
        : null,
      courtroom: a.courtroom ? { code: a.courtroom, i18key: t("COMMON_MASTERS_COURT_ROOM_" + a.courtroom) } : null,
      designation: a.designation ? { code: a.designation, i18key: t("COMMON_MASTERS_DESIGNATION_" + a.designation) } : null,
      roles: (a.roles || (emp.user && emp.user.roles) || []).map((r) => ({
        code: r.code,
        name: r.name || " ",
        labelKey: "ACCESSCONTROL_ROLES_ROLES_" + r.code,
      })),
    }));
    setAssignments(mapped.length > 0 ? mapped : [{ ...emptyAssignment }]);
    setPhoneChecked(true);
    setInitialized(true);
  }, [empData, isEdit, t]);

  /* ── phone duplicate check ── */
  useEffect(() => {
    if (!phone || phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
      setPhoneChecked(false);
      return;
    }
    if (
      isEdit &&
      empData &&
      empData.Employees &&
      empData.Employees[0] &&
      empData.Employees[0].user &&
      empData.Employees[0].user.mobileNumber === phone
    ) {
      setPhoneChecked(true);
      return;
    }
    const timer = setTimeout(() => {
      Digit.HRMSService.search(tenantId, null, { phone: phone })
        .then((result) => {
          if (result.Employees.length > 0) {
            setToast({ msg: t("ERR_HRMS_USER_EXIST_MOB"), err: true });
            setPhoneChecked(false);
          } else {
            setPhoneChecked(true);
          }
        })
        .catch(() => setPhoneChecked(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [phone, tenantId, isEdit, empData, t]);

  /* ── auto-fill roles when employee type changes ── */
  useEffect(() => {
    if (!empType || !employeeRoleMapping || !initialized) return;

    const currentEmpTypeCode = empType?.code;
    const prevEmpTypeCode = prevEmpType?.code;

    // Only auto-fill if employee type actually changed
    if (currentEmpTypeCode === prevEmpTypeCode) return;

    const roleMapping = employeeRoleMapping?.["egov-hrms"]?.EmployeeRolesMapping;

    if (!roleMapping || roleMapping.length === 0) {
      return;
    }

    // Filter role mapping for selected employee type
    const filteredRoleMapping = roleMapping.filter((role) => role.employeeCode === currentEmpTypeCode);

    if (filteredRoleMapping.length === 0) {
      setPrevEmpType(empType);
      return;
    }

    // Map role codes to role objects
    const mappedRoles = filteredRoleMapping.flatMap((role) =>
      (role.roleCodes || [])
        .map((roleItem) => {
          return roleItem
            ? {
                code: roleItem,
                name: roleItem || " ",
                labelKey: "ACCESSCONTROL_ROLES_ROLES_" + roleItem,
              }
            : null;
        })
        .filter((item) => item !== null)
    );

    // Update all assignments with the new roles
    setAssignments((prev) =>
      prev.map((assignment) => ({
        ...assignment,
        roles: mappedRoles,
      }))
    );

    setPrevEmpType(empType);
  }, [empType, employeeRoleMapping, initialized, prevEmpType]);

  /* ── validation ── */
  const nameValid = name && name.length > 0 && (Digit.Utils.getPattern("Name") ? name.match(Digit.Utils.getPattern("Name")) : true);
  const phoneValid = phone && phone.length === 10 && /^[6-9]\d{9}$/.test(phone);
  const emailValid = !email || email.length === 0 || (Digit.Utils.getPattern("Email") ? email.match(Digit.Utils.getPattern("Email")) : true);
  const assignmentsValid = assignments.every((a) => a.courtEstablishment && a.designation && a.fromDate);

  const canSubmit = nameValid && phoneValid && phoneChecked && emailValid && empType && assignmentsValid;

  /* ── assignment handlers ── */
  const updateAssignment = useCallback((key, field, value) => {
    setAssignments((prev) => prev.map((a) => (a.key === key ? { ...a, [field]: value } : a)));
  }, []);

  const selectDistrict = useCallback((key, value) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.key !== key) return a;
        const newEst = a.courtEstablishment && a.courtEstablishment.district === value.code ? a.courtEstablishment : null;
        const newRoom = newEst && a.courtroom && a.courtroom.establishment === newEst.code ? a.courtroom : null;
        return { ...a, district: value, courtEstablishment: newEst, courtroom: newRoom };
      })
    );
  }, []);

  const selectCourtEstablishment = useCallback(
    (key, value) => {
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.key !== key) return a;
          const dist = districts.find((d) => d.code === value.district) || a.district;
          const newRoom = a.courtroom && a.courtroom.establishment === value.code ? a.courtroom : null;
          return { ...a, courtEstablishment: value, district: dist, courtroom: newRoom };
        })
      );
    },
    [districts]
  );

  const selectCourtroom = useCallback(
    (key, value) => {
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.key !== key) return a;
          const est = courtEstablishments.find((e) => e.code === value.establishment) || a.courtEstablishment;
          const dist = est ? districts.find((d) => d.code === est.district) || a.district : a.district;
          return { ...a, courtroom: value, courtEstablishment: est, district: dist };
        })
      );
    },
    [courtEstablishments, districts]
  );

  const toggleRole = useCallback((key, role) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.key !== key) return a;
        const exists = (a.roles || []).some((r) => r.code === role.code);
        const updated = exists
          ? a.roles.filter((r) => r.code !== role.code)
          : [...(a.roles || []), { code: role.code, name: role.name, labelKey: role.labelKey }];
        return { ...a, roles: updated };
      })
    );
  }, []);

  const removeRole = useCallback((key, idx) => {
    setAssignments((prev) => prev.map((a) => (a.key === key ? { ...a, roles: a.roles.filter((_, i) => i !== idx) } : a)));
  }, []);

  const addAssignment = () => {
    setAssignments((prev) => [...prev, { ...emptyAssignment, key: prev.length > 0 ? Math.max(...prev.map((a) => a.key)) + 1 : 0 }]);
  };

  const removeAssignment = (key) => {
    setAssignments((prev) => prev.filter((a) => a.key !== key));
  };

  const getFilteredEstablishments = (assignment) => {
    if (!assignment.district) return courtEstablishments;
    return courtEstablishments.filter((e) => e.district === assignment.district.code);
  };

  const getFilteredCourtrooms = (assignment) => {
    if (assignment.courtEstablishment) return courtRooms.filter((r) => r.establishment === assignment.courtEstablishment.code);
    if (assignment.district) {
      const validEsts = courtEstablishments.filter((e) => e.district === assignment.district.code);
      return courtRooms.filter((r) => validEsts.some((e) => e.code === r.establishment));
    }
    return courtRooms;
  };

  /* ── submit ── */
  const handleSubmit = () => {
    if (!canSubmit) return;

    const buildAssignments = assignments.map((a) => {
      const obj = {
        fromDate: a.fromDate ? new Date(a.fromDate).getTime() : undefined,
        toDate: a.toDate ? new Date(a.toDate).getTime() : undefined,
        courtEstablishment: a.courtEstablishment ? a.courtEstablishment.code : undefined,
        district: a.district ? a.district.code : undefined,
        designation: a.designation ? a.designation.code : undefined,
        courtroom: a.courtroom ? a.courtroom.code : undefined,
      };
      if (a.id) {
        obj.id = a.id;
        obj.position = a.position;
        obj.govtOrderNumber = a.govtOrderNumber;
        obj.tenantid = a.tenantid;
        obj.auditDetails = a.auditDetails;
      }
      obj.roles = (a.roles || []).map((r) => ({ code: r.code, name: r.name || " ", labelKey: r.labelKey }));
      /* remove undefined keys */
      Object.keys(obj).forEach((k) => {
        if (obj[k] === undefined) delete obj[k];
      });
      return obj;
    });

    const allRolesFlat = [].concat.apply(
      [],
      buildAssignments.map((a) => a.roles || [])
    );

    if (isEdit) {
      const emp = empData.Employees[0];
      let requestdata = Object.assign({}, emp);
      requestdata.assignments = buildAssignments;
      requestdata.code = empCode || (emp.user && emp.user.userName);
      requestdata.jurisdictions = emp.jurisdictions;
      requestdata.user = Object.assign({}, emp.user, {
        mobileNumber: phone,
        name: name,
        emailId: email || undefined,
        roles: allRolesFlat.filter((r) => r && r.name),
      });
      let Employees = [requestdata];
      Employees =
        Digit && Digit.Customizations && Digit.Customizations.HRMS && Digit.Customizations.HRMS.customiseUpdateFormData
          ? Digit.Customizations.HRMS.customiseUpdateFormData(empData.Employees[0], Employees)
          : Employees;
      history.replace("/" + (window.contextPath || "digit-ui") + "/employee/hrms/response", {
        Employees: Employees,
        key: "UPDATE",
        action: "UPDATE",
      });
    } else {
      /* create: check duplicate employee id */
      const doCreate = (Employees) => {
        Employees =
          Digit && Digit.Customizations && Digit.Customizations.HRMS && Digit.Customizations.HRMS.customiseCreateFormData
            ? Digit.Customizations.HRMS.customiseCreateFormData(null, Employees)
            : Employees;
        history.replace("/" + (window.contextPath || "digit-ui") + "/employee/hrms/response", {
          Employees: Employees,
          key: "CREATE",
          action: "CREATE",
        });
      };

      let Employees = [
        {
          tenantId: tenantId,
          employeeStatus: "EMPLOYED",
          assignments: buildAssignments,
          code: empCode || undefined,
          employeeType: empType.code,
          jurisdictions: [{ hierarchy: "COURT_DISTRICT_HIERARCHY", boundaryType: "state", boundary: tenantId, tenantId: tenantId }],
          user: {
            mobileNumber: phone,
            name: name,
            emailId: email || undefined,
            roles: allRolesFlat,
            tenantId: tenantId,
          },
          serviceHistory: [],
          education: [],
          tests: [],
        },
      ];

      if (empCode && empCode.trim().length > 0) {
        Digit.HRMSService.search(tenantId, null, { codes: empCode })
          .then((result) => {
            if (result.Employees.length > 0) {
              setToast({ msg: t("ERR_HRMS_USER_EXIST_ID"), err: true });
            } else {
              doCreate(Employees);
            }
          })
          .catch(() => doCreate(Employees));
      } else {
        doCreate(Employees);
      }
    }
  };

  /* ── loading ── */
  if ((isEdit && empLoading) || mdmsLoading || empTypeLoading || !initialized) return <Loader />;

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div style={S.page}>
      <Link to={"/" + (window.contextPath || "digit-ui") + "/employee/hrms/inbox"} style={S.backLink}>
        &#8592; {t("HR_COMMON_BACK_TO_INBOX") || "Back to Employee List"}
      </Link>

      {/* hero header */}
      <div style={S.heroCard}>
        <div style={S.heroAccent} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isEdit && (
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, " + TEAL + " 0%, #1aabb8 100%)",
                color: WHITE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {getInitials(name)}
            </div>
          )}
          <div>
            <h1 style={S.heroTitle}>
              {isEdit ? t("HR_COMMON_EDIT_EMPLOYEE_HEADER") || "Edit Employee" : t("HR_COMMON_CREATE_EMPLOYEE_HEADER") || "Create Employee"}
            </h1>
            <p style={S.heroSub}>
              {isEdit
                ? t("HR_EDIT_EMPLOYEE_DESC") || "Update employee details below"
                : t("HR_CREATE_EMPLOYEE_DESC") || "Fill in the details to create a new employee"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Personal Details ── */}
      <SectionCard icon="&#128100;" title={t("HR_PERSONAL_DETAILS_FORM_HEADER") || "Personal Details"}>
        <div style={S.grid2}>
          <FormInput
            label={t("HR_EMP_NAME_LABEL") || "Name"}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name.length > 0 && !nameValid ? t("CORE_COMMON_APPLICANT_NAME_INVALID") : ""}
          />
          <FormInput
            label={t("HR_MOB_NO_LABEL") || "Mobile Number"}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            prefix="+91"
            error={phone.length > 0 && !phoneValid ? t("CORE_COMMON_MOBILE_ERROR") : ""}
            hint={t("HR_MOBILE_NO_CHECK")}
          />
          <FormInput
            label={t("HR_EMAIL_LABEL") || "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            error={email.length > 0 && !emailValid ? t("CS_PROFILE_EMAIL_ERRORMSG") : ""}
          />
        </div>
      </SectionCard>

      {/* ── Employee Details ── */}
      <SectionCard icon="&#128188;" title={t("HR_NEW_EMPLOYEE_FORM_HEADER") || "Employee Details"}>
        <div style={S.grid2}>
          <FormSelect
            label={t("HR_EMPLOYMENT_TYPE_LABEL") || "Employee Type"}
            required
            options={employeeTypes}
            selected={empType}
            onSelect={setEmpType}
            optionKey="i18key"
          />
          <FormInput
            label={t("HR_EMP_ID_LABEL") || "Employee ID"}
            value={empCode}
            onChange={(e) => setEmpCode(e.target.value)}
            disabled={isEdit}
            hint={t("HR_EMP_ID_MESSAGE") || "Leave blank for auto-generated ID"}
          />
        </div>
      </SectionCard>

      {/* ── Assignment Details ── */}
      <SectionCard icon="&#128203;" title={t("HR_ASSIGN_DET_HEADER") || "Assignment Details"}>
        <p style={{ fontSize: "12px", color: GRAY400, marginTop: 0, marginBottom: "16px" }}>
          {t("HR_ASSIGN_DET_SUB_HEADER") || "Add assignment details for the employee"}
        </p>
        {assignments.map((assgn, idx) => {
          const isExisting = !!assgn.id;
          return (
            <div key={assgn.key} style={S.assignCard}>
              <div style={S.assignHeader}>
                <span style={S.assignIdx}>
                  {t("HR_ASSIGNMENT")} {idx + 1}
                </span>
                {assignments.length > 1 && !isExisting && (
                  <button type="button" style={S.removeBtn} onClick={() => removeAssignment(assgn.key)} title="Remove">
                    &times;
                  </button>
                )}
              </div>
              <div style={S.grid3}>
                <FormDate
                  label={t("HR_ASMT_FROM_DATE_LABEL") || "From Date"}
                  required
                  value={assgn.fromDate}
                  onChange={(v) => updateAssignment(assgn.key, "fromDate", v)}
                  disabled={isExisting}
                  max={todayStr}
                />
                <FormDate
                  label={t("HR_ASMT_TO_DATE_LABEL") || "To Date"}
                  value={assgn.toDate}
                  onChange={(v) => updateAssignment(assgn.key, "toDate", v)}
                  min={tomorrowStr}
                  hint={t("HRMS_EMP_ID_DISCRIPTION")}
                />
                <FormSelect
                  label={t("HR_DISTRICT") || "District"}
                  options={districts}
                  selected={assgn.district}
                  onSelect={(v) => selectDistrict(assgn.key, v)}
                  optionKey="i18key"
                  disabled={isExisting}
                />
                <FormSelect
                  label={t("HR_COURT_ESTABLISHMENT") || "Court Establishment"}
                  required
                  options={getFilteredEstablishments(assgn)}
                  selected={assgn.courtEstablishment}
                  onSelect={(v) => selectCourtEstablishment(assgn.key, v)}
                  optionKey="i18key"
                  disabled={isExisting}
                />
                <FormSelect
                  label={t("HR_COURTRROOM_LABEL") || "Courtroom"}
                  required
                  options={getFilteredCourtrooms(assgn)}
                  selected={assgn.courtroom}
                  onSelect={(v) => selectCourtroom(assgn.key, v)}
                  optionKey="i18key"
                  disabled={isExisting}
                />
                <FormSelect
                  label={t("HR_DESG_LABEL") || "Designation"}
                  required
                  options={designations}
                  selected={assgn.designation}
                  onSelect={(v) => updateAssignment(assgn.key, "designation", v)}
                  optionKey="i18key"
                  disabled={isExisting}
                />
              </div>
              <div style={{ marginTop: "12px" }}>
                <FormMultiSelect
                  label={t("HR_COMMON_TABLE_COL_ROLE") || "Roles"}
                  required
                  options={allRoles}
                  selected={assgn.roles}
                  onToggle={(role) => toggleRole(assgn.key, role)}
                  onRemove={(i) => removeRole(assgn.key, i)}
                  optionKey="labelKey"
                />
              </div>
            </div>
          );
        })}
        <button type="button" style={S.addBtn} onClick={addAssignment}>
          + {t("HR_ADD_ASSIGNMENT") || "Add Assignment"}
        </button>
      </SectionCard>

      {/* ── submit bar ── */}
      <div style={S.submitBar}>
        <button
          type="button"
          style={{ ...S.submitBtn, background: WHITE, color: GRAY700, border: "1px solid " + GRAY200 }}
          onClick={() => history.goBack()}
        >
          {t("HR_COMMON_BUTTON_CANCEL") || "Cancel"}
        </button>
        <button
          type="button"
          style={{ ...S.submitBtn, ...S.submitPrimary, ...(canSubmit ? {} : S.submitDisabled) }}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {t("HR_COMMON_BUTTON_SUBMIT") || "Submit"}
        </button>
      </div>

      {/* ── toast ── */}
      {toast && <ToastNotif message={toast.msg} isError={toast.err} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EmployeeForm;
