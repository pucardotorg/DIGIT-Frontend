import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, Link } from "react-router-dom";
import ActionModal from "../components/Modal";
import { convertEpochFormateToDate, pdfDownloadLink } from "../components/Utils";

/* ─────────────── colour tokens ─────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GREEN = "#16a34a";
const GREEN_LIGHT = "#dcfce7";
const RED = "#dc2626";
const RED_LIGHT = "#fee2e2";
const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fff7ed";
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
const styles = {
  /* page wrapper */
  page: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px 16px 80px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  /* back link */
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
    transition: "color 0.15s",
  },

  /* hero header card */
  heroCard: {
    background: WHITE,
    borderRadius: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    padding: "28px 32px",
    marginBottom: "20px",
    position: "relative",
    overflow: "hidden",
  },
  heroAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${TEAL} 0%, #1aabb8 100%)`,
  },
  heroBody: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "1px",
    flexShrink: 0,
  },
  heroInfo: {
    flex: 1,
    minWidth: "200px",
  },
  heroName: {
    fontSize: "22px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
    lineHeight: 1.3,
  },
  heroMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "6px",
    flexWrap: "wrap",
  },
  heroCode: {
    fontSize: "14px",
    color: GRAY500,
    fontWeight: 500,
    fontFamily: "monospace",
  },
  heroDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: GRAY300,
  },
  heroType: {
    fontSize: "13px",
    color: GRAY500,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  statusActive: {
    background: GREEN_LIGHT,
    color: GREEN,
  },
  statusInactive: {
    background: RED_LIGHT,
    color: RED,
  },
  heroActions: {
    display: "flex",
    gap: "8px",
    flexShrink: 0,
    position: "relative",
  },
  actionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "transform 0.12s, box-shadow 0.12s",
    whiteSpace: "nowrap",
  },
  editBtn: {
    background: WHITE,
    color: TEAL,
    border: "1.5px solid " + TEAL,
  },
  primaryBtn: {
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    boxShadow: "0 2px 6px rgba(13,106,130,0.18)",
  },
  dangerBtn: {
    background: WHITE,
    color: RED,
    border: "1.5px solid " + RED,
  },

  /* dropdown menu */
  menuWrap: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "6px",
    background: WHITE,
    borderRadius: "10px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    border: "1px solid " + GRAY100,
    minWidth: "180px",
    zIndex: 100,
    overflow: "hidden",
  },
  menuItem: {
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 500,
    color: GRAY700,
    cursor: "pointer",
    transition: "background 0.12s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid " + GRAY50,
  },
  menuItemDanger: {
    color: RED,
  },

  /* section cards */
  section: {
    background: WHITE,
    borderRadius: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    marginBottom: "16px",
    overflow: "hidden",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "18px 24px 14px",
    borderBottom: "1px solid " + GRAY100,
  },
  sectionIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },
  sectionBody: {
    padding: "16px 24px 20px",
  },

  /* detail row */
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY400,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: 500,
    color: GRAY900,
    wordBreak: "break-word",
  },

  /* sub-cards (jurisdictions, assignments) */
  subCard: {
    border: "1px solid " + GRAY200,
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "12px",
    background: GRAY50,
  },
  subCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  subCardIndex: {
    fontSize: "12px",
    fontWeight: 700,
    color: TEAL,
    background: TEAL_LIGHT,
    padding: "3px 10px",
    borderRadius: "12px",
  },

  /* documents */
  docGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  docItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid " + GRAY200,
    background: WHITE,
    cursor: "pointer",
    transition: "border-color 0.15s, box-shadow 0.15s",
    maxWidth: "260px",
  },
  docIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: TEAL_LIGHT,
    color: TEAL,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  docName: {
    fontSize: "13px",
    fontWeight: 500,
    color: GRAY700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "170px",
  },

  /* deactivation banner */
  deactivationBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 18px",
    borderRadius: "10px",
    background: ORANGE_LIGHT,
    border: "1px solid #fed7aa",
    marginBottom: "16px",
  },
  deactivationIcon: {
    fontSize: "20px",
    flexShrink: 0,
    marginTop: "1px",
  },

  /* roles tag list */
  roleTag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    background: GRAY100,
    color: GRAY700,
    marginRight: "6px",
    marginBottom: "4px",
  },

  /* roles toggle button */
  rolesToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid " + GRAY200,
    background: WHITE,
    color: TEAL,
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
  },
  rolesToggleHover: {
    background: TEAL_LIGHT,
    borderColor: TEAL,
  },
  rolesContent: {
    marginTop: "8px",
  },

  /* skeleton shimmer */
  shimmer: {
    background: `linear-gradient(90deg, ${GRAY100} 25%, ${GRAY50} 50%, ${GRAY100} 75%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "6px",
  },
};

/* ─────────────── helper: initials ─────────────── */
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

/* ─────────────── sub-component: DetailField ─────────────── */
const DetailField = ({ label, value }) => (
  <div style={styles.detailItem}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value || "—"}</span>
  </div>
);

/* ─────────────── sub-component: SectionCard ─────────────── */
const SectionCard = ({ icon, iconBg, title, children }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <div style={{ ...styles.sectionIcon, background: iconBg || TEAL_LIGHT, color: TEAL }}>{icon}</div>
      <h3 style={styles.sectionTitle}>{title}</h3>
    </div>
    <div style={styles.sectionBody}>{children}</div>
  </div>
);

/* ═══════════════════════════════════════════════
   Details — Employee Details page (redesigned)
   ═══════════════════════════════════════════════ */
const Details = () => {
  const activeworkflowActions = ["DEACTIVATE_EMPLOYEE_HEAD", "COMMON_EDIT_EMPLOYEE_HEADER"];
  const deactiveworkflowActions = ["ACTIVATE_EMPLOYEE_HEAD"];
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { id: employeeId } = useParams();
  const { tenantId: tenantId } = useParams();
  const history = useHistory();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState({});
  const menuRef = useRef(null);
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId, null, isupdate);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  /* close menu on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDisplayMenu(false);
      }
    };
    if (displayMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [displayMenu]);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const handleDownload = async (document) => {
    const res = await Digit.UploadServices.Filefetch([document?.documentId], Digit.ULBService.getStateId());
    let documentLink = pdfDownloadLink(res.data, document?.documentId);
    window.open(documentLink, "_blank");
  };

  const submitAction = (data) => {};

  useEffect(() => {
    switch (selectedAction) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);
      case "ACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);
      case "COMMON_EDIT_EMPLOYEE_HEADER":
        return history.push(`/${window?.contextPath}/employee/hrms/edit/${tenantId}/${employeeId}`);
      default:
        break;
    }
  }, [selectedAction]);

  if (isLoading) {
    return <Loader />;
  }

  const emp = data && data.Employees && data.Employees.length > 0 ? data.Employees[0] : null;

  if (!emp) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", padding: "60px 20px", color: GRAY500, fontSize: "15px" }}>
          {t("HR_NO_EMPLOYEE_FOUND") || "Employee not found."}
        </div>
      </div>
    );
  }

  const empName = (emp.user && emp.user.name) || "";
  const empCode = emp.code || "";
  const empMobile = (emp.user && emp.user.mobileNumber) || "";
  const empEmail = (emp.user && emp.user.emailId) || "";
  const empType = emp.employeeType || "";
  const isActive = emp.isActive !== false;
  const assignments = (emp.assignments || []).sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
  const jurisdictions = emp.jurisdictions || [];
  const documents = emp.documents || [];
  const roles = (emp.user && emp.user.roles) || [];

  const deactivationDetails =
    !isActive && emp.deactivationDetails ? emp.deactivationDetails.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0] : null;

  const workflowActions = isActive ? activeworkflowActions : deactiveworkflowActions;

  return (
    <React.Fragment>
      <div style={styles.page}>
        {/* ── back link ── */}
        <Link to={`/${window?.contextPath}/employee/hrms/inbox`} style={styles.backLink}>
          &#8592; {t("HR_COMMON_BACK_TO_INBOX") || "Back to Employee List"}
        </Link>

        {/* ── hero header card ── */}
        <div style={styles.heroCard}>
          <div style={styles.heroAccent} />
          <div style={styles.heroBody}>
            <div style={styles.avatar}>{getInitials(empName)}</div>
            <div style={styles.heroInfo}>
              <h1 style={styles.heroName}>{empName}</h1>
              <div style={styles.heroMeta}>
                <span style={styles.heroCode}>{empCode}</span>
                {empType && (
                  <React.Fragment>
                    <span style={styles.heroDot} />
                    <span style={styles.heroType}>{t(empType)}</span>
                  </React.Fragment>
                )}
                <span style={styles.heroDot} />
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(isActive ? styles.statusActive : styles.statusInactive),
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: isActive ? GREEN : RED,
                    }}
                  />
                  {isActive ? t("ACTIVE") : t("INACTIVE")}
                </span>
              </div>
            </div>

            {/* action buttons */}
            <div style={styles.heroActions} ref={menuRef}>
              <button
                type="button"
                style={{ ...styles.actionBtn, ...styles.editBtn }}
                onClick={() => history.push(`/${window?.contextPath}/employee/hrms/edit/${tenantId}/${employeeId}`)}
              >
                &#9998; {t("COMMON_EDIT_EMPLOYEE_HEADER") || "Edit"}
              </button>
              <button
                type="button"
                style={{ ...styles.actionBtn, ...(isActive ? styles.dangerBtn : styles.primaryBtn) }}
                onClick={() => onActionSelect(isActive ? "DEACTIVATE_EMPLOYEE_HEAD" : "ACTIVATE_EMPLOYEE_HEAD")}
              >
                {isActive ? "\u26D4 " + (t("HR_DEACTIVATE_HEAD") || "Deactivate") : "\u2714 " + (t("HR_ACTIVATE_HEAD") || "Activate")}
              </button>
            </div>
          </div>
        </div>

        {/* ── deactivation banner ── */}
        {deactivationDetails && (
          <div style={styles.deactivationBanner}>
            <span style={styles.deactivationIcon}>&#9888;</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: ORANGE, marginBottom: "6px" }}>
                {t("HR_DEACTIVATION_DETAILS") || "Deactivation Details"}
              </div>
              <div style={styles.detailGrid}>
                <DetailField label={t("HR_EFFECTIVE_DATE")} value={convertEpochFormateToDate(deactivationDetails.effectiveFrom)} />
                <DetailField
                  label={t("HR_DEACTIVATION_REASON")}
                  value={t("EGOV_HRMS_DEACTIVATIONREASON_" + deactivationDetails.reasonForDeactivation) || "—"}
                />
                <DetailField label={t("HR_REMARKS")} value={deactivationDetails.remarks} />
                <DetailField label={t("HR_ORDER_NO")} value={deactivationDetails.orderNo} />
              </div>
            </div>
          </div>
        )}

        {/* ── personal details ── */}
        <SectionCard icon="&#128100;" iconBg={TEAL_LIGHT} title={t("HR_PERSONAL_DETAILS_FORM_HEADER")}>
          <div style={styles.detailGrid}>
            <DetailField label={t("HR_NAME_LABEL")} value={empName} />
            <DetailField label={t("HR_MOB_NO_LABEL")} value={empMobile} />
            <DetailField label={t("HR_EMAIL_LABEL")} value={empEmail} />
          </div>
        </SectionCard>

        {/* ── employment details ── */}
        <SectionCard icon="&#128188;" iconBg={TEAL_LIGHT} title={t("HR_NEW_EMPLOYEE_FORM_HEADER")}>
          <div style={styles.detailGrid}>
            <DetailField label={t("HR_EMPLOYMENT_TYPE_LABEL")} value={t(empType || "NA")} />
            <DetailField label={t("HR_EMPLOYEE_ID_LABEL")} value={empCode} />
          </div>
        </SectionCard>

        {/* ── documents ── */}
        {documents.length > 0 && (
          <SectionCard icon="&#128196;" iconBg={TEAL_LIGHT} title={t("TL_APPROVAL_UPLOAD_HEAD") || "Documents"}>
            <div style={styles.docGrid}>
              {documents.map((doc, index) => (
                <div key={index} style={styles.docItem} onClick={() => handleDownload(doc)} role="button" tabIndex={0}>
                  <div style={styles.docIcon}>&#128462;</div>
                  <span style={styles.docName}>{doc.documentName || "Document " + (index + 1)}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── jurisdiction details ── */}
        {jurisdictions.length > 0 && (
          <SectionCard icon="&#127759;" iconBg={TEAL_LIGHT} title={t("HR_JURIS_DET_HEADER")}>
            {jurisdictions.map((element, index) => (
              <div key={index} style={styles.subCard}>
                <div style={styles.subCardHeader}>
                  <span style={styles.subCardIndex}>
                    {t("HR_JURISDICTION")} {index + 1}
                  </span>
                </div>
                <div style={styles.detailGrid}>
                  <DetailField
                    label={t("HR_HIERARCHY_LABEL")}
                    value={t(element.hierarchy ? "EGOV_LOCATION_TENANTBOUNDARY_" + element.hierarchy : "NA")}
                  />
                  <DetailField
                    label={t("HR_BOUNDARY_TYPE_LABEL")}
                    value={t(Digit.Utils.locale.convertToLocale(element.boundaryType, "EGOV_LOCATION_BOUNDARYTYPE"))}
                  />
                  <DetailField label={t("HR_BOUNDARY_LABEL")} value={t(element.boundary)} />
                </div>
              </div>
            ))}
          </SectionCard>
        )}

        {/* ── assignment details ── */}
        {assignments.length > 0 && (
          <SectionCard icon="&#128203;" iconBg={TEAL_LIGHT} title={t("HR_ASSIGN_DET_HEADER")}>
            {assignments.map((element, index) => (
              <div key={index} style={styles.subCard}>
                <div style={styles.subCardHeader}>
                  <span style={styles.subCardIndex}>
                    {t("HR_ASSIGNMENT")} {index + 1}
                  </span>
                </div>
                <div style={styles.detailGrid}>
                  <DetailField label={t("HR_ASMT_FROM_DATE_LABEL")} value={convertEpochFormateToDate(element.fromDate)} />
                  <DetailField label={t("HR_ASMT_TO_DATE_LABEL")} value={element.toDate ? convertEpochFormateToDate(element.toDate) : "—"} />
                  <DetailField label={t("HR_DISTRICT_LABEL")} value={t("COMMON_MASTERS_DISTRICT_" + element.district)} />
                  <DetailField
                    label={t("HR_COURT_ESTABLISHMENT_LABEL")}
                    value={t("COMMON_MASTERS_COURT_ESTABLISHMENT_" + element.courtEstablishment)}
                  />
                  <DetailField label={t("HR_COURTROOM_LABEL")} value={t("COMMON_MASTERS_COURT_ROOM_" + element.courtroom)} />
                  <DetailField label={t("HR_DESG_LABEL")} value={t("COMMON_MASTERS_DESIGNATION_" + element.designation)} />
                </div>
                {/* roles - collapsible */}
                {roles.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <button
                      type="button"
                      style={styles.rolesToggle}
                      onClick={() => setExpandedRoles((prev) => ({ ...prev, [index]: !prev[index] }))}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = TEAL_LIGHT;
                        e.currentTarget.style.borderColor = TEAL;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = WHITE;
                        e.currentTarget.style.borderColor = GRAY200;
                      }}
                    >
                      <span>{expandedRoles[index] ? "▼" : "▶"}</span>
                      <span>
                        {expandedRoles[index] ? t("HR_HIDE_ROLES") || "Hide Roles" : t("HR_VIEW_ROLES") || "View Roles"} ({roles.length})
                      </span>
                    </button>
                    {expandedRoles[index] && (
                      <div style={styles.rolesContent}>
                        {roles.map((role, rIdx) => (
                          <span key={rIdx} style={styles.roleTag}>
                            {t("ACCESSCONTROL_ROLES_ROLES_" + role.code)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </SectionCard>
        )}
      </div>

      {/* ── action modal ── */}
      {showModal && (
        <ActionModal t={t} action={selectedAction} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction} />
      )}
    </React.Fragment>
  );
};

export default Details;
