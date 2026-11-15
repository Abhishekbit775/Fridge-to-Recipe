import React, { useState } from "react";

function formatAmount(amount, ratio) {
  const val = amount * ratio;
  // Show as fraction-ish if small
  if (val < 1 && val > 0) {
    if (Math.abs(val - 0.25) < 0.05) return "¼";
    if (Math.abs(val - 0.5) < 0.05) return "½";
    if (Math.abs(val - 0.75) < 0.05) return "¾";
    if (Math.abs(val - 0.33) < 0.05) return "⅓";
    if (Math.abs(val - 0.67) < 0.05) return "⅔";
    return val.toFixed(1);
  }
  // Round to 1 decimal if not integer
  return Number.isInteger(val) ? val.toString() : val.toFixed(1);
}

function IngredientRow({ ingredient, ratio }) {
  const [swapOpen, setSwapOpen] = useState(false);
  const [activeSwap, setActiveSwap] = useState(null);

  const displayName = activeSwap ?? ingredient.name;
  const hasSwaps = ingredient.swaps?.length > 0;

  return (
    <li style={styles.row}>
      <div style={styles.mainLine}>
        <span style={styles.amount}>
          {formatAmount(ingredient.amount, ratio)} {ingredient.unit}
        </span>
        <span
          style={{
            ...styles.name,
            ...(activeSwap ? styles.nameSwapped : {}),
          }}
        >
          {displayName}
          {activeSwap && (
            <span style={styles.swapBadge}>swap</span>
          )}
        </span>
        {hasSwaps && (
          <button
            style={styles.swapToggle}
            onClick={() => setSwapOpen((o) => !o)}
            aria-expanded={swapOpen}
            title="See ingredient swaps"
          >
            {swapOpen ? "✕" : "swap?"}
          </button>
        )}
      </div>

      {swapOpen && hasSwaps && (
        <div style={styles.swapPanel}>
          <p style={styles.swapHint}>Swap with:</p>
          <div style={styles.swapChips}>
            <button
              style={{
                ...styles.swapChip,
                ...(activeSwap === null ? styles.swapChipActive : {}),
              }}
              onClick={() => { setActiveSwap(null); setSwapOpen(false); }}
            >
              {ingredient.name} (original)
            </button>
            {ingredient.swaps.map((s) => (
              <button
                key={s}
                style={{
                  ...styles.swapChip,
                  ...(activeSwap === s ? styles.swapChipActive : {}),
                }}
                onClick={() => { setActiveSwap(s); setSwapOpen(false); }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

export default function IngredientList({ ingredients, ratio }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Ingredients</h2>
      <ul style={styles.list}>
        {ingredients.map((ing) => (
          <IngredientRow key={ing.id} ingredient={ing} ratio={ratio} />
        ))}
      </ul>
    </section>
  );
}

const styles = {
  section: { marginBottom: "2rem" },
  heading: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    color: "var(--text)",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  row: {
    background: "var(--surface2)",
    borderRadius: 8,
    padding: "0.6rem 0.75rem",
    border: "1px solid var(--border)",
  },
  mainLine: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  amount: {
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "var(--accent)",
    minWidth: 70,
  },
  name: {
    flex: 1,
    fontSize: "0.95rem",
  },
  nameSwapped: {
    color: "var(--warn)",
  },
  swapBadge: {
    marginLeft: "0.4rem",
    fontSize: "0.68rem",
    background: "var(--warn-light)",
    color: "var(--warn)",
    padding: "0.1rem 0.4rem",
    borderRadius: 4,
    fontWeight: 600,
  },
  swapToggle: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    padding: "0.2rem 0.5rem",
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "var(--surface)",
    cursor: "pointer",
  },
  swapPanel: {
    marginTop: "0.5rem",
    paddingTop: "0.5rem",
    borderTop: "1px solid var(--border)",
  },
  swapHint: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    marginBottom: "0.4rem",
  },
  swapChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
  },
  swapChip: {
    padding: "0.25rem 0.65rem",
    border: "1.5px solid var(--border)",
    borderRadius: 20,
    fontSize: "0.8rem",
    background: "var(--surface)",
    cursor: "pointer",
    color: "var(--text)",
    transition: "all 150ms",
  },
  swapChipActive: {
    borderColor: "var(--accent)",
    background: "var(--accent-light)",
    color: "var(--accent)",
    fontWeight: 600,
  },
};
