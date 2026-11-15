import React from "react";

export default function ServingsControl({ servings, baseServings, onChange }) {
  return (
    <div style={styles.wrapper} role="group" aria-label="Adjust servings">
      <span style={styles.label}>Servings</span>
      <div style={styles.controls}>
        <button
          onClick={() => onChange(Math.max(1, servings - 1))}
          style={styles.btn}
          aria-label="Decrease servings"
          disabled={servings <= 1}
        >
          −
        </button>
        <span style={styles.count} aria-live="polite">
          {servings}
        </span>
        <button
          onClick={() => onChange(Math.min(20, servings + 1))}
          style={styles.btn}
          aria-label="Increase servings"
          disabled={servings >= 20}
        >
          +
        </button>
      </div>
      {servings !== baseServings && (
        <button
          style={styles.reset}
          onClick={() => onChange(baseServings)}
          title="Reset to original"
        >
          Reset ({baseServings})
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  label: {
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "var(--text-muted)",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    overflow: "hidden",
  },
  btn: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: 700,
    background: "var(--surface2)",
    color: "var(--text)",
    border: "none",
    cursor: "pointer",
    transition: "background 150ms",
  },
  count: {
    minWidth: 36,
    textAlign: "center",
    fontWeight: 700,
    fontSize: "1rem",
    padding: "0 0.3rem",
    background: "var(--surface)",
  },
  reset: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
};
