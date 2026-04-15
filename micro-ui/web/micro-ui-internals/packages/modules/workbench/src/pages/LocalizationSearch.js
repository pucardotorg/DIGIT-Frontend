import React, { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader, Toast } from "@egovernments/digit-ui-react-components";

const TEAL = "#0d6a82";
const TEAL_LIGHT = "#e8f4f6";
const GRAY50 = "#f9fafb";
const GRAY100 = "#f3f4f6";
const GRAY200 = "#e5e7eb";
const GRAY300 = "#d1d5db";
const GRAY400 = "#9ca3af";
const GRAY500 = "#6b7280";
const GRAY700 = "#374151";
const GRAY900 = "#111827";
const WHITE = "#ffffff";

const S = {
  page: {
    maxWidth: "1200px",
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
  searchInputWrap: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    color: GRAY400,
    fontSize: "18px",
  },
  searchInput: {
    width: "100%",
    padding: "16px 20px 16px 48px",
    fontSize: "16px",
    borderRadius: "12px",
    border: `2px solid ${GRAY200}`,
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  searchInputFocus: {
    borderColor: TEAL,
    boxShadow: `0 0 0 4px ${TEAL_LIGHT}`,
  },
  tableWrap: {
    marginTop: "24px",
    border: `1px solid ${GRAY200}`,
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: GRAY50,
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    borderBottom: `1px solid ${GRAY200}`,
  },
  tr: {
    transition: "background 0.15s",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: GRAY900,
    borderBottom: `1px solid ${GRAY100}`,
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
    whiteSpace: "nowrap",
    marginTop: "4px",
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
    whiteSpace: "nowrap",
    marginTop: "4px",
  },
  btnSecondaryHover: {
    background: GRAY50,
    borderColor: GRAY300,
  },
  btnSecondaryDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  searchActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
  },
  emptyState: {
    padding: "32px",
    textAlign: "center",
    color: GRAY500,
    fontSize: "14px",
  },
  actionBtn: {
    padding: "6px 12px",
    fontSize: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.15s",
  },
  viewBtn: {
    background: TEAL_LIGHT,
    color: TEAL,
  },
  cellWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    width: "100%",
  },
  cellValue: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cellIcons: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    flexShrink: 0,
    opacity: 0,
    transition: "opacity 0.15s",
  },
  cellIconBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: GRAY400,
    fontSize: "14px",
    padding: 0,
    transition: "background 0.12s, color 0.12s",
  },
  cellIconBtnHover: {
    background: TEAL_LIGHT,
    color: TEAL,
  },
  inlineInput: {
    width: "100%",
    padding: "4px 8px",
    border: `1.5px solid ${TEAL}`,
    borderRadius: "6px",
    fontSize: "13px",
    color: GRAY700,
    outline: "none",
    background: WHITE,
    boxSizing: "border-box",
  },
  inlineActions: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
  },
  inlineSaveBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    border: "none",
    background: TEAL,
    color: WHITE,
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },
  inlineCancelBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    border: `1px solid ${GRAY200}`,
    background: WHITE,
    color: GRAY500,
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  popupCard: {
    background: WHITE,
    borderRadius: "14px",
    width: "560px",
    maxWidth: "92vw",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: `1px solid ${GRAY100}`,
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: GRAY900,
    margin: 0,
  },
  popupClose: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: GRAY400,
    padding: "4px",
    lineHeight: 1,
  },
  popupBody: {
    padding: "20px 24px",
    flex: 1,
    overflowY: "auto",
  },
  popupFieldLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: GRAY500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  popupInput: {
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${GRAY200}`,
    borderRadius: "10px",
    fontSize: "13px",
    color: GRAY700,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "16px",
  },
  popupInputFocus: {
    borderColor: TEAL,
    boxShadow: `0 0 0 3px ${TEAL_LIGHT}`,
  },
  popupFooter: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    padding: "14px 24px",
    borderTop: `1px solid ${GRAY100}`,
  },
  popupCancelBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: `1px solid ${GRAY200}`,
    background: WHITE,
    color: GRAY700,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  popupSaveBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: `linear-gradient(135deg, ${TEAL} 0%, #1aabb8 100%)`,
    color: WHITE,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  paginationWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: `1px solid ${GRAY200}`,
    background: GRAY50,
  },
  paginationInfo: {
    fontSize: "13px",
    color: GRAY500,
  },
  paginationControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  paginationSelect: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: `1px solid ${GRAY200}`,
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  paginationBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: `1px solid ${GRAY200}`,
    background: WHITE,
    color: GRAY700,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  paginationBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

const EditableCell = ({ value, onSave, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [hover, setHover] = useState(false);
  const [iconHover, setIconHover] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={S.cellWrap}>
        <input
          ref={inputRef}
          type="text"
          style={S.inlineInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />
        <div style={S.inlineActions}>
          <button type="button" style={S.inlineSaveBtn} onClick={handleSave}>
            ✓
          </button>
          <button type="button" style={S.inlineCancelBtn} onClick={handleCancel}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.cellWrap} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <span style={S.cellValue}>{value}</span>
      <div style={{ ...S.cellIcons, ...(hover ? { opacity: 1 } : {}) }}>
        <button
          type="button"
          style={{
            ...S.cellIconBtn,
            ...(iconHover === "edit" ? S.cellIconBtnHover : {}),
          }}
          onMouseEnter={() => setIconHover("edit")}
          onMouseLeave={() => setIconHover(null)}
          onClick={() => setIsEditing(true)}
          title="Edit inline"
        >
          ✎
        </button>
        <button
          type="button"
          style={{
            ...S.cellIconBtn,
            ...(iconHover === "popup" ? S.cellIconBtnHover : {}),
          }}
          onMouseEnter={() => setIconHover("popup")}
          onMouseLeave={() => setIconHover(null)}
          onClick={onEdit}
          title="Edit in popup"
        >
          ⤢
        </button>
      </div>
    </div>
  );
};

const EditPopup = ({ field, value, onSave, onClose }) => {
  const [editValue, setEditValue] = useState(value);
  const [focused, setFocused] = useState(false);

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.popupCard} onClick={(e) => e.stopPropagation()}>
        <div style={S.popupHeader}>
          <h3 style={S.popupTitle}>Edit {field}</h3>
          <button type="button" style={S.popupClose} onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={S.popupBody}>
          <div style={S.popupFieldLabel}>{field}</div>
          <input
            type="text"
            style={{
              ...S.popupInput,
              ...(focused ? S.popupInputFocus : {}),
            }}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
          />
        </div>
        <div style={S.popupFooter}>
          <button type="button" style={S.popupCancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            style={S.popupSaveBtn}
            onClick={() => {
              onSave(editValue);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultRow = ({ msg, index, onUpdate, onEditPopup }) => {
  const [hover, setHover] = useState(false);
  return (
    <tr style={{ ...S.tr, ...(hover ? { background: GRAY50 } : {}) }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <td style={S.td}>{msg.code}</td>
      <td style={S.td}>
        <EditableCell
          value={msg.message}
          onSave={(newValue) => onUpdate(index, "message", newValue)}
          onEdit={() => onEditPopup(index, "message", msg.message)}
        />
      </td>
      <td style={S.td}>{msg.module}</td>
      <td style={S.td}>{msg.locale}</td>
    </tr>
  );
};

const LocalizationSearch = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [searchQuery, setSearchQuery] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [editPopup, setEditPopup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [clearButtonHover, setClearButtonHover] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const { isLoading, data: localizationData, refetch } = Digit.Hooks.workbench.useLocalizationSearch(
    tenantId,
    { locale: "en_IN", module: "" },
    { enabled: true }
  );

  const { mutate: updateLocalization } = Digit.Hooks.workbench.useLocalizationUpdate(tenantId);

  const allMessages = useMemo(() => localizationData?.messages || [], [localizationData]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return allMessages;
    const q = searchQuery.toLowerCase();
    return allMessages.filter((msg) => msg.code?.toLowerCase().includes(q) || msg.message?.toLowerCase().includes(q));
  }, [searchQuery, allMessages]);

  const totalPages = Math.ceil(filteredMessages.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const handleUpdate = (index, field, newValue) => {
    const actualIndex = startIndex + index;
    const message = filteredMessages[actualIndex];

    updateLocalization(
      {
        locale: message.locale,
        module: message.module,
        messages: [{ code: message.code, message: newValue }],
      },
      {
        onSuccess: () => {
          setShowToast({ error: false, label: "Updated successfully" });
          refetch();
        },
        onError: () => {
          setShowToast({ error: true, label: "Failed to update" });
        },
      }
    );
  };

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await refetch();
      setShowToast({ error: false, label: "Data refreshed successfully" });
    } catch (error) {
      setShowToast({ error: true, label: "Failed to refresh data" });
    } finally {
      setIsRefetching(false);
    }
  };

  const handleEditPopup = (index, field, value) => {
    setEditPopup({ index, field, value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div style={S.page}>
      {showToast && <Toast error={showToast.error} label={showToast.label} onClose={() => setShowToast(null)} />}

      {editPopup && (
        <EditPopup
          field={editPopup.field}
          value={editPopup.value}
          onSave={(newValue) => handleUpdate(editPopup.index, editPopup.field, newValue)}
          onClose={() => setEditPopup(null)}
        />
      )}

      <div style={S.breadcrumb}>
        <a
          href={`/${window?.contextPath}/employee/home`}
          style={S.breadcrumbLink}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/${window?.contextPath}/employee/home`);
          }}
        >
          &larr; {t("WB_HOME") || "Home"}
        </a>
      </div>

      <div style={S.heroCard}>
        <div style={S.heroAccent} />
        <div style={S.heroBody}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={S.heroIcon}>🌐</div>
              <h1 style={S.heroTitle}>{t("WB_LOCALIZATION_TITLE") || "Manage Localization"}</h1>
              <p style={S.heroSub}>
                {t("WB_LOCALIZATION_DESC") || "Search and manage localization strings. Click on any message to edit inline or in popup."}
              </p>
            </div>
            <button type="button" style={S.btnPrimary} onClick={() => history.push(`/${window?.contextPath}/employee/workbench/localization-create`)}>
              &#43; {t("WB_CREATE_NEW") || "Create New"}
            </button>
          </div>
        </div>
      </div>

      <div style={S.formCard}>
        <div style={S.searchInputWrap}>
          <span style={S.searchIcon}>&#128269;</span>
          <input
            type="text"
            placeholder={t("WB_LOCALIZATION_SEARCH_PLACEHOLDER") || "Search by code or localized string..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            style={{
              ...S.searchInput,
              ...(inputFocus ? S.searchInputFocus : {}),
            }}
          />
        </div>

        <div style={S.searchActions}>
          <button
            type="button"
            style={{
              ...S.btnSecondary,
              ...(clearButtonHover && searchQuery.trim() ? S.btnSecondaryHover : {}),
              ...(!searchQuery.trim() ? S.btnSecondaryDisabled : {}),
            }}
            onMouseEnter={() => setClearButtonHover(true)}
            onMouseLeave={() => setClearButtonHover(false)}
            onClick={() => setSearchQuery("")}
            disabled={!searchQuery.trim()}
          >
            Clear
          </button>
          <button
            type="button"
            style={{
              ...S.btnSecondary,
              ...(isRefetching ? S.btnSecondaryDisabled : {}),
            }}
            onClick={handleRefetch}
            disabled={isRefetching}
          >
            {isRefetching ? "Refreshing..." : "Refetch"}
          </button>
        </div>

        {isLoading ? (
          <div style={{ marginTop: "24px" }}>
            <Loader />
          </div>
        ) : (
          <div style={S.tableWrap}>
            {paginatedMessages.length > 0 ? (
              <Fragment>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>{t("WB_CODE") || "Code"}</th>
                      <th style={S.th}>{t("WB_MESSAGE") || "Message"}</th>
                      <th style={S.th}>{t("WB_MODULE") || "Module"}</th>
                      <th style={S.th}>{t("WB_LOCALE") || "Locale"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMessages.map((msg, idx) => (
                      <ResultRow
                        key={`${msg.code}-${msg.locale}-${idx}`}
                        msg={msg}
                        index={idx}
                        onUpdate={handleUpdate}
                        onEditPopup={handleEditPopup}
                      />
                    ))}
                  </tbody>
                </table>
                <div style={S.paginationWrap}>
                  <div style={S.paginationInfo}>
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)} of {filteredMessages.length} entries
                  </div>
                  <div style={S.paginationControls}>
                    <span style={{ fontSize: "13px", color: GRAY500 }}>Rows per page:</span>
                    <select style={S.paginationSelect} value={pageSize} onChange={handlePageSizeChange}>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                    </select>
                    <button
                      type="button"
                      style={{
                        ...S.paginationBtn,
                        ...(currentPage === 1 ? S.paginationBtnDisabled : {}),
                      }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span style={{ fontSize: "13px", color: GRAY500 }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      style={{
                        ...S.paginationBtn,
                        ...(currentPage === totalPages ? S.paginationBtnDisabled : {}),
                      }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div style={S.emptyState}>No localization entries found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalizationSearch;
