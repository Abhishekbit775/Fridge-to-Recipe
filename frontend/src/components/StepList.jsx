import React, { useState } from "react";

function Step({ step, index, checked, onToggle }) {
  return (
    <li
      style={{
        ...styles.step,
        ...(checked ? styles.stepDone : {}),
      }}
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggle(); }}
    >
      <div
        style={{
          ...styles.checkbox,
          ...(checked ? styles.checkboxChecked : {}),
        }}
        aria-hidden="true"
      >
        {checked && <span style={styles.checkmark}>✓</span>}
      </div>
      <div style={styles.content}>
        <div style={styles.stepNum}>Step {index + 1}</div>
        <p style={{ ...styles.instruction, ...(checked ? styles.instructionDone : {}) }}>
          {step.instruction}
        </p>
        {step.tip && (
          <p style={styles.tip}>
            💡 {step.tip}
          </p>
        )}
      </div>
    </li>
  );
}

export default function StepList({ steps }) {
  const [checked, setChecked] = useState(() => new Set());

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const doneCount = checked.size;
  const total = steps.length;
  const allDone = doneCount === total && total > 0;

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Instructions</h2>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(doneCount / total) * 100}%`,
              }}
            />
          </div>
          <span style={styles.progressLabel} aria-live="polite">
            {doneCount}/{total}
          </span>
        </div>
      </div>

      {doneCount > 0 && (
        <button
          style={styles.clearBtn}
          onClick={() => setChecked(new Set())}
        >
          Clear all
        </button>
      )}

      <ul style={styles.list} aria-label="Recipe steps">
        {steps.map((step, i) => (
          <Step
            key={step.id}
            step={step}
            index={i}
            checked={checked.has(step.id)}
            onToggle={() => toggle(step.id)}
          />
        ))}
      </ul>

      {allDone && (
        <div style={styles.congrats} role="status" aria-live="polite">
          🎉 All done! Enjoy your meal!
        </div>
      )}
    </section>
  );
}

const styles = {
  section: { marginBottom: "2rem" },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.75rem",
    flexWrap: "wrap",
  },
  heading: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text)",
  },
  progress: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flex: 1,
    justifyContent: "flex-end",
  },
  progressBar: {
    width: 80,
    height: 6,
    background: "var(--border)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--accent)",
    borderRadius: 3,
    transition: "width 300ms ease",
  },
  progressLabel: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    fontWeight: 600,
  },
  clearBtn: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    marginBottom: "0.75rem",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  step: {
    display: "flex",
    gap: "0.75rem",
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "0.9rem 1rem",
    cursor: "pointer",
    transition: "border-color 180ms, background 180ms",
    userSelect: "none",
  },
  stepDone: {
    background: "var(--surface2)",
    borderColor: "var(--accent)",
    opacity: 0.75,
  },
  checkbox: {
    width: 24,
    height: 24,
    minWidth: 24,
    borderRadius: 6,
    border: "2px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    transition: "background 180ms, border-color 180ms",
  },
  checkboxChecked: {
    background: "var(--accent)",
    borderColor: "var(--accent)",
  },
  checkmark: {
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  content: { flex: 1 },
  stepNum: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "0.2rem",
  },
  instruction: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "var(--text)",
    transition: "color 180ms",
  },
  instructionDone: {
    textDecoration: "line-through",
    color: "var(--text-muted)",
  },
  tip: {
    marginTop: "0.4rem",
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    background: "#fffbf0",
    padding: "0.35rem 0.6rem",
    borderRadius: 6,
    borderLeft: "3px solid #f0c040",
  },
  congrats: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--accent)",
    padding: "1rem",
    background: "var(--accent-light)",
    borderRadius: "var(--radius)",
    animation: "fadeIn 400ms ease",
  },
};
