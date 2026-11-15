import React, { useState } from "react";

const EXAMPLES = [
  "chicken breast, garlic, lemon, olive oil, rosemary",
  "eggs, spinach, feta cheese, tomatoes, onion",
  "pasta, canned tomatoes, bacon, parmesan, cream",
  "salmon, soy sauce, ginger, sesame oil, bok choy",
];

export default function IngredientInput({ onSubmit, loading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  };

  const fillExample = (ex) => setValue(ex);

  const charCount = value.trim().split(",").filter(Boolean).length;

  return (
    <div style={styles.wrapper}>
      <div style={styles.hero}>
        <span style={styles.emoji}>🍳</span>
        <h1 style={styles.title}>Fridge to Recipe</h1>
        <p style={styles.subtitle}>
          Tell me what's in your fridge — I'll turn it into a recipe.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label} htmlFor="ingredients">
          Your ingredients
        </label>
        <textarea
          id="ingredients"
          style={styles.textarea}
          placeholder="e.g. chicken, garlic, lemon, olive oil, thyme…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          disabled={loading}
          aria-label="Enter your ingredients separated by commas"
        />

        {value.trim() && (
          <p style={styles.counter}>
            {charCount} ingredient{charCount !== 1 ? "s" : ""}
          </p>
        )}

        <button
          type="submit"
          disabled={!value.trim() || loading}
          style={{
            ...styles.btn,
            opacity: !value.trim() || loading ? 0.5 : 1,
            cursor: !value.trim() || loading ? "not-allowed" : "pointer",
          }}
          aria-busy={loading}
        >
          {loading ? (
            <span style={styles.btnContent}>
              <span style={styles.spinner} aria-hidden="true" />
              Generating recipe…
            </span>
          ) : (
            <span style={styles.btnContent}>✨ Generate Recipe</span>
          )}
        </button>
      </form>

      <div style={styles.examples}>
        <p style={styles.examplesLabel}>Try an example:</p>
        <div style={styles.chips}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              style={styles.chip}
              onClick={() => fillExample(ex)}
              disabled={loading}
              type="button"
            >
              {ex.split(",")[0].trim()}…
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: 560,
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  hero: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  emoji: {
    fontSize: "3.5rem",
    display: "block",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "var(--text)",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "var(--text-muted)",
    fontSize: "1.05rem",
  },
  form: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    padding: "1.5rem",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "0.5rem",
    fontSize: "0.95rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    fontSize: "1rem",
    resize: "vertical",
    background: "var(--bg)",
    color: "var(--text)",
    transition: "border-color 180ms",
  },
  counter: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    textAlign: "right",
    marginTop: "0.3rem",
    marginBottom: "0.3rem",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "1rem",
    padding: "0.85rem",
    background: "var(--accent)",
    color: "#fff",
    borderRadius: 8,
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.01em",
    transition: "background 180ms, transform 100ms",
  },
  btnContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  examples: {
    textAlign: "center",
  },
  examplesLabel: {
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    marginBottom: "0.6rem",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    justifyContent: "center",
  },
  chip: {
    padding: "0.35rem 0.75rem",
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: 20,
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "border-color 180ms, color 180ms",
  },
};
