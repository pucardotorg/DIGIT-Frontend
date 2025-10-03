import React, { useEffect, useState, useRef, useMemo } from "react";


const ArrowDown = ({ className, onClick, styles, disable }) => (
    <svg
      style={{ ...styles }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={disable ? "#9E9E9E" : "black"}
      className={className}
      onClick={onClick}
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );


export const CustomMultiSelect = ({
  options = [],
  optionsKey = "labelKey",
  selected = [],
  onSelect,
  defaultLabel = "",
  defaultUnit = "Selected",
  t = (s) => s,
}) => {
  const [active, setActive] =useState(false);
  const [searchQuery, setSearchQuery] =useState("");
  const [localSelected, setLocalSelected] =useState(selected || []);
  const dropdownRef =useRef(null);
  const inputRef =useRef(null);

  // Sync with external selected changes
  useEffect(() => {
    setLocalSelected(selected || []);
  }, [selected]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActive(false);
      }
    }
    if (active) document.addEventListener("mousedown", handleClickOutside, { capture: true });
    return () => document.removeEventListener("mousedown", handleClickOutside, { capture: true });
  }, [active]);

  // Reset search when closed so next open starts fresh
  useEffect(() => {
    if (!active) setSearchQuery("");
  }, [active]);

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    if (!q) return options;
    return options.filter((o) => (t(o?.[optionsKey]) || "").toString().toLowerCase().includes(q));
  }, [options, searchQuery, t, optionsKey]);

  function emitSelection(updated) {
    // Maintain the same contract expected by selectrole: [[null, option], ...]
    const payload = (updated || []).map((opt) => [null, opt]);
    onSelect && onSelect(payload);
  }

  function toggleOption(option) {
    const exists = localSelected?.some((s) => s?.[optionsKey] === option?.[optionsKey]);
    let updated;
    if (exists) {
      updated = localSelected.filter((s) => s?.[optionsKey] !== option?.[optionsKey]);
    } else {
      updated = [...(localSelected || []), option];
    }
    setLocalSelected(updated);
    emitSelection(updated);
  }

  const count = localSelected?.length || 0;

  return (
    <div className="multi-select-dropdown-wrap" ref={dropdownRef} style={{ marginBottom: "24px" }}>
      <div className={`master${active ? "-active" : ""}`}>
        <div
          className="label"
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", position: "relative" }}
          onClick={() => {
            inputRef.current && inputRef.current.focus();
            setActive(true);
          }}
        >
          {/* Show count/label only when closed */}
          {!active && (
            <p style={{ margin: 0, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {count > 0 ? `${count} ${defaultUnit}` : defaultLabel}
            </p>
          )}
          {/* Overlay input so it doesn't affect layout when closed */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!active) setActive(true);
            }}
            onFocus={() => setActive(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setActive(false);
                setSearchQuery("");
              }
            }}
            placeholder={defaultLabel}
            className="cursorPointer"
            style={{
              position: "absolute",
              inset: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 16,
              opacity: active ? 1 : 0,
              pointerEvents: active ? "auto" : "none",
            }}
          />
          <span
            onClick={() => setActive((a) => !a)}
            style={{ display: "flex", alignItems: "center", cursor: "pointer", transform: active ? "rotate(180deg)" : "none", marginLeft: "auto" }}
            aria-hidden
          >
            <ArrowDown />
          </span>
        </div>
      </div>
      {active ? (
        <div
          className="server"
          style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #E3E3E3", borderRadius: 4, marginTop: 4, background: "#fff" }}
        >
          {filtered?.map((option, idx) => {
            const checked = !!localSelected?.find((s) => s?.[optionsKey] === option?.[optionsKey]);
            return (
              <label key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer" }}>
                <input type="checkbox" checked={checked} onChange={() => toggleOption(option)} style={{ margin: 0, width: 18, height: 18 }} />
                <span className="label">{t(option?.[optionsKey])}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};