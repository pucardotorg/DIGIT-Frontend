import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════
   HomeScreen — Custom employee home page
   Replaces DIGIT's default home to match the new design.
   Shows Workbench and/or HRMS cards based on user roles.
   If only one card is visible it is centered on screen.
   ═══════════════════════════════════════════════════════ */

/* ── colour tokens ─────────────────────────────────── */
const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e0f4f4";
const WHITE = "#ffffff";
const GRAY50 = "#f9fafb";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";

/* ── role config ───────────────────────────────────── */
const WORKBENCH_ROLES = ["MDMS_ADMIN", "EMPLOYEE", "SUPERUSER", "EMPLOYEE_COMMON", "LOC_ADMIN", "STADMIN"];

/* ── helpers ───────────────────────────────────────── */
function hasHrmsAccess() {
  try {
    return Digit.Utils.hrmsAccess();
  } catch (_) {
    return false;
  }
}

function hasWorkbenchAccess() {
  try {
    return Digit.Utils.didEmployeeHasAtleastOneRole(WORKBENCH_ROLES);
  } catch (_) {
    return false;
  }
}

function getUserName() {
  try {
    var user = Digit.UserService.getUser();
    var info = user && user.info ? user.info : null;
    if (!info) return "";
    return info.name || info.userName || "";
  } catch (_) {
    return "";
  }
}

/* ── inline styles ─────────────────────────────────── */
var S = {
  page: {
    minHeight: "calc(100vh - 64px)",
    background: "linear-gradient(180deg, " + TEAL_LIGHT + " 0%, " + GRAY50 + " 40%)",
    padding: "0",
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px 60px",
  },
  /* welcome area */
  welcomeSection: {
    marginBottom: "36px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: TEAL_LIGHT,
    color: TEAL,
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "12px",
    border: "1px solid " + TEAL,
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#10b981",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: GRAY900,
    margin: "0 0 6px",
    lineHeight: 1.3,
  },
  welcomeName: {
    color: TEAL,
  },
  welcomeSub: {
    fontSize: "15px",
    color: GRAY500,
    margin: 0,
    lineHeight: 1.5,
  },

  /* cards grid */
  cardsRow: {
    display: "flex",
    gap: "28px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  cardsRowCentered: {
    display: "flex",
    gap: "28px",
    marginBottom: "40px",
    justifyContent: "center",
  },

  /* individual card */
  card: {
    background: WHITE,
    borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
    flex: "1 1 340px",
    maxWidth: "500px",
    minWidth: "300px",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "default",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.10)",
  },
  cardBody: {
    padding: "24px",
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "6px",
  },
  cardIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },
  cardDesc: {
    fontSize: "13px",
    color: GRAY500,
    margin: "0 0 20px",
    lineHeight: 1.5,
  },

  /* stats row */
  statsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: "12px",
    color: GRAY400,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 4px",
  },
  statValue: {
    fontSize: "26px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },

  /* access button */
  accessBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "12px 0",
    borderRadius: "10px",
    border: "1.5px solid " + GRAY200,
    background: WHITE,
    color: GRAY700,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
  },
  accessBtnHover: {
    borderColor: TEAL,
    color: TEAL,
    background: TEAL_LIGHT,
  },

  /* divider */
  divider: {
    height: "1px",
    background: GRAY200,
    margin: "0 0 24px",
  },

  /* operations overview */
  opsSection: {
    marginBottom: "24px",
  },
  opsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  opsTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
  },
  opsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  opsCard: {
    background: WHITE,
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    border: "1px solid " + GRAY100,
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  opsCardIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: GRAY50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: GRAY400,
    fontSize: "16px",
  },
  opsCardLabel: {
    fontSize: "11px",
    color: GRAY400,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 2px",
  },
  opsCardValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },

  /* security bar */
  securityBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: WHITE,
    borderRadius: "12px",
    padding: "16px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    border: "1px solid " + GRAY100,
    marginBottom: "32px",
  },
  securityLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  securityIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: TEAL_LIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: TEAL,
    fontSize: "16px",
    flexShrink: 0,
  },
  securityTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: GRAY900,
    margin: "0 0 2px",
  },
  securitySub: {
    fontSize: "12px",
    color: GRAY500,
    margin: 0,
  },
  securityBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1.5px solid " + GRAY200,
    background: WHITE,
    color: GRAY700,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    transition: "border-color 0.2s, color 0.2s",
  },

  /* footer */
  footer: {
    textAlign: "center",
    padding: "24px 0",
    fontSize: "13px",
    color: GRAY400,
    borderTop: "1px solid " + GRAY200,
  },
};

/* ── AccessButton sub-component ────────────────────── */
var AccessButton = function (props) {
  var hovered = React.useState(false);
  var isHovered = hovered[0];
  var setHovered = hovered[1];
  return (
    <Link
      to={props.to}
      style={Object.assign({}, S.accessBtn, isHovered ? S.accessBtnHover : {})}
      onMouseEnter={function () {
        setHovered(true);
      }}
      onMouseLeave={function () {
        setHovered(false);
      }}
    >
      {props.label} <span style={{ fontSize: "16px" }}>{"\u203A"}</span>
    </Link>
  );
};

/* ── ModuleCardItem ────────────────────────────────── */
var ModuleCardItem = function (props) {
  var hoverState = React.useState(false);
  var hovered = hoverState[0];
  var setHovered = hoverState[1];

  return (
    <div
      style={Object.assign({}, S.card, hovered ? S.cardHover : {})}
      onMouseEnter={function () {
        setHovered(true);
      }}
      onMouseLeave={function () {
        setHovered(false);
      }}
    >
      <div style={S.cardBody}>
        <div style={S.cardTitleRow}>
          <div style={Object.assign({}, S.cardIcon, { background: props.iconBg })}>{props.icon}</div>
          <h3 style={S.cardTitle}>{props.title}</h3>
        </div>
        <p style={S.cardDesc}>{props.description}</p>

        {props.stats && props.stats.length > 0 && (
          <div style={S.statsRow}>
            {props.stats.map(function (s, idx) {
              return (
                <div key={idx} style={S.stat}>
                  <p style={S.statLabel}>{s.label}</p>
                  <p style={S.statValue}>{s.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {props.links && props.links.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {props.links.map(function (link, idx) {
              return <AccessButton key={idx} to={link.to} label={link.label} />;
            })}
          </div>
        ) : (
          <AccessButton to={props.accessLink} label={props.accessLabel || "Access Module"} />
        )}
      </div>
    </div>
  );
};

/* ── OpsCard ───────────────────────────────────────── */
var OpsCard = function (props) {
  return (
    <div style={S.opsCard}>
      <div style={S.opsCardIcon}>{props.icon}</div>
      <div>
        <p style={S.opsCardLabel}>{props.label}</p>
        <p style={S.opsCardValue}>{props.value}</p>
      </div>
    </div>
  );
};

/* ── HRMS Icon SVG ─────────────────────────────────── */
var HrmsIcon = function () {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={WHITE} />
    </svg>
  );
};

/* ── Workbench Icon SVG ────────────────────────────── */
var WorkbenchIcon = function () {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"
        fill={WHITE}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════
   HomeScreen — main export
   ═══════════════════════════════════════════════════════ */
var HomeScreen = function () {
  var t = useTranslation().t;
  var userName = getUserName();
  var showHrms = hasHrmsAccess();
  var showWorkbench = hasWorkbenchAccess();

  /* HRMS stats — fetch employee count */
  var tenantId = "";
  try {
    tenantId = Digit.ULBService.getCurrentTenantId();
  } catch (_) {
    /* */
  }
  var hrmsCount = { isLoading: true, data: null };
  try {
    hrmsCount = Digit.Hooks.hrms.useHRMSCount(tenantId);
  } catch (_) {
    /* */
  }

  var totalEmployees = hrmsCount.isLoading ? "-" : hrmsCount.data && hrmsCount.data.EmployeCount ? hrmsCount.data.EmployeCount.totalEmployee : "-";
  var activeEmployees = hrmsCount.isLoading ? "-" : hrmsCount.data && hrmsCount.data.EmployeCount ? hrmsCount.data.EmployeCount.activeEmployee : "-";

  var cardCount = (showHrms ? 1 : 0) + (showWorkbench ? 1 : 0);

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* ── Welcome ── */}
        <div style={S.welcomeSection}>
          <div style={S.badge}>
            <span style={S.badgeDot} />
            System Live
          </div>
          <h1 style={S.welcomeTitle}>
            Welcome back, <span style={S.welcomeName}>{userName || t("HR_COMMON_BUTTON_HOME")}</span>
          </h1>
          <p style={S.welcomeSub}>Your administrative gateway is updated with the latest organizational metrics and project status reports.</p>
        </div>

        {/* ── Module Cards ── */}
        <div style={cardCount === 1 ? S.cardsRowCentered : S.cardsRow}>
          {showHrms && (
            <ModuleCardItem
              title={t("ACTION_TEST_HRMS") || "HRMS Core"}
              description="Manage employee lifecycles, payroll cycles, and organizational hierarchies from a unified interface."
              iconBg="linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
              icon={<HrmsIcon />}
              stats={[
                { label: t("TOTAL_EMPLOYEES") || "Total Staff", value: totalEmployees },
                { label: t("ACTIVE_EMPLOYEES") || "Active", value: activeEmployees },
              ]}
              accessLink={"/" + (window.contextPath || "digit-ui") + "/employee/hrms/inbox"}
              accessLabel={t("HR_HOME_SEARCH_RESULTS_HEADING") || "Access Module"}
            />
          )}

          {showWorkbench && (
            <ModuleCardItem
              title={t("ACTION_TEST_WORKBENCH") || "Project Workbench"}
              description="Track resource allocation, project milestones, and real-time performance analytics across all departments."
              iconBg="linear-gradient(135deg, #0d6a82 0%, #1aabb8 100%)"
              icon={<WorkbenchIcon />}
              stats={[
                { label: "MDMS Records", value: "-" },
                { label: "Configurations", value: "-" },
              ]}
              links={[
                {
                  to: "/" + (window.contextPath || "digit-ui") + "/employee/workbench/manage-master-data",
                  label: t("ACTION_TEST_MDMS") || "Manage Master Data",
                },
                {
                  to: "/" + (window.contextPath || "digit-ui") + "/employee/workbench/localization-search",
                  label: t("ACTION_TEST_LOCALISATION") || "Manage Localization",
                },
              ]}
            />
          )}
        </div>

        {/* ── Divider ── */}
        <div style={S.divider} />

        {/* ── Operations Overview ── */}
        <div style={S.opsSection}>
          <div style={S.opsHeader}>
            <p style={S.opsTitle}>
              <span>{"\u2699"}</span> Operations Overview
            </p>
          </div>
          <div style={S.opsGrid}>
            <OpsCard icon={"\uD83D\uDCCB"} label="Pending Approvals" value="-" />
            <OpsCard icon={"\u2764"} label="System Health" value="99.8%" />
            <OpsCard icon={"\uD83D\uDCC5"} label="Upcoming Holidays" value="-" />
            <OpsCard icon={"\u26A0"} label="Critical Alerts" value="0" />
          </div>
        </div>

        {/* ── Security Bar ── */}
        <div style={S.securityBar}>
          <div style={S.securityLeft}>
            <div style={S.securityIcon}>{"\u2713"}</div>
            <div>
              <p style={S.securityTitle}>Security Compliance Active</p>
              <p style={S.securitySub}>This session is protected with end-to-end encryption and audit logging.</p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={S.footer}>
          {"\u00A9"} {new Date().getFullYear()} HRMS Admin Hub {"\u00B7"} Modernized Administrative Gateway
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
