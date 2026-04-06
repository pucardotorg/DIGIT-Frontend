import React from "react";
import { Link } from "react-router-dom";

/* ──────────────────────────────────────────────
   Styles — inline because microbundle treats .css
   imports as CSS-modules and hashes class names.
   ────────────────────────────────────────────── */

const gradients = {
  hrms: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
  workbench: "linear-gradient(135deg, #0d6a82 0%, #1aabb8 100%)",
  default: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
};

const dotColors = {
  hrms: "#f97316",
  workbench: "#0d6a82",
  default: "#6366f1",
};

const ringColors = {
  primary: "#0d6a82",
  accent: "#f97316",
};

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
    display: "flex",
    flexDirection: "column",
    minWidth: "260px",
    maxWidth: "380px",
    flex: "1 1 300px",
    cursor: "default",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.08)",
  },
  header: {
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  headerShine: {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 60%)",
    pointerEvents: "none",
  },
  titleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 1,
  },
  iconBox: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    flexShrink: 0,
  },
  iconSvg: {
    fill: "#ffffff",
    width: "20px",
    height: "20px",
  },
  title: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: 600,
    letterSpacing: "0.3px",
    margin: 0,
  },
  body: {
    padding: "16px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: 1,
  },
  kpis: {
    display: "flex",
    gap: "16px",
    padding: "8px 0",
  },
  kpi: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    textDecoration: "none",
    color: "inherit",
    padding: "10px 8px",
    borderRadius: "10px",
    background: "#f9fafb",
    border: "1px solid #f0f0f0",
    transition: "background 0.2s, border-color 0.2s",
    cursor: "pointer",
  },
  kpiRing: {
    width: "56px",
    height: "56px",
    position: "relative",
    marginBottom: "6px",
  },
  kpiRingSvg: {
    width: "56px",
    height: "56px",
    transform: "rotate(-90deg)",
  },
  kpiValue: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "16px",
    fontWeight: 700,
    color: "#1f2937",
  },
  kpiLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
    textAlign: "center",
    lineHeight: 1.2,
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#374151",
    fontSize: "14px",
    fontWeight: 500,
    transition: "background 0.18s, color 0.18s, padding-left 0.18s",
    cursor: "pointer",
  },
  linkHover: {
    background: "#f3f4f6",
    color: "#0d6a82",
    paddingLeft: "16px",
  },
  linkArrow: {
    marginLeft: "auto",
    opacity: 0,
    transform: "translateX(-4px)",
    transition: "opacity 0.18s, transform 0.18s",
    fontSize: "14px",
    color: "#9ca3af",
  },
  linkArrowHover: {
    opacity: 1,
    transform: "translateX(0)",
  },
  linkDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
};

/* ── KPI Ring ─────────────────────────────────── */
const KpiRing = ({ value, label, variant, percent, link }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const strokeColor = ringColors[variant] || ringColors.primary;

  const inner = (
    <div style={styles.kpi}>
      <div style={styles.kpiRing}>
        <svg style={styles.kpiRingSvg} viewBox="0 0 56 56">
          <circle fill="none" stroke="#e5e7eb" strokeWidth="4" cx="28" cy="28" r={radius} />
          <circle
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            cx="28"
            cy="28"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <span style={styles.kpiValue}>{value}</span>
      </div>
      <span style={styles.kpiLabel}>{label}</span>
    </div>
  );

  return link ? (
    <Link to={link} style={{ textDecoration: "none", flex: 1 }}>
      {inner}
    </Link>
  ) : (
    inner
  );
};

/* ── Link Item ────────────────────────────────── */
const LinkItem = ({ label, link, theme }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Link
      to={link}
      style={{
        ...styles.link,
        ...(hovered ? styles.linkHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ ...styles.linkDot, background: dotColors[theme] || dotColors.default }} />
      {label}
      <span
        style={{
          ...styles.linkArrow,
          ...(hovered ? styles.linkArrowHover : {}),
        }}
      >
        →
      </span>
    </Link>
  );
};

/* ── ModuleCard ───────────────────────────────── */
const ModuleCard = ({ moduleName, theme, Icon, kpis, links }) => {
  const resolvedTheme = theme || "default";
  const resolvedKpis = kpis || [];
  const resolvedLinks = links || [];
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div style={{ ...styles.header, background: gradients[resolvedTheme] || gradients.default }}>
        <div style={styles.headerShine} />
        <div style={styles.titleGroup}>
          {Icon && (
            <div style={styles.iconBox}>
              <span style={styles.iconSvg}>{Icon}</span>
            </div>
          )}
          <h3 style={styles.title}>{moduleName}</h3>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {resolvedKpis.length > 0 && (
          <div style={styles.kpis}>
            {resolvedKpis.map(function (kpi, idx) {
              return (
                <KpiRing
                  key={idx}
                  value={kpi.count}
                  label={kpi.label}
                  link={kpi.link}
                  variant={kpi.variant || (idx % 2 === 0 ? "primary" : "accent")}
                  percent={kpi.percent != null ? kpi.percent : 100}
                />
              );
            })}
          </div>
        )}

        {resolvedLinks.length > 0 && (
          <div style={styles.links}>
            {resolvedLinks.map(function (item, idx) {
              return <LinkItem key={idx} label={item.label} link={item.link} theme={resolvedTheme} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
