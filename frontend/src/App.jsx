import React from "react";
import { useRecipe } from "./hooks/useRecipe.js";
import IngredientInput from "./components/IngredientInput.jsx";
import RecipeCard from "./components/RecipeCard.jsx";

export default function App() {
  const { recipe, status, error, fetchRecipe, reset } = useRecipe();

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <main style={styles.main}>
        {/* Show input when idle or errored */}
        {(status === "idle" || status === "error") && (
          <div style={{ animation: "fadeIn 300ms ease" }}>
            <IngredientInput
              onSubmit={fetchRecipe}
              loading={false}
            />
            {status === "error" && (
              <div style={styles.errorBanner} role="alert">
                <span style={styles.errorIcon}>⚠️</span>
                <div>
                  <strong>Something went wrong</strong>
                  <p style={styles.errorText}>{error}</p>
                </div>
                <button style={styles.retryBtn} onClick={reset}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {status === "loading" && (
          <div style={styles.loadingWrapper} aria-live="polite" aria-label="Generating recipe">
            <div style={styles.loadingCard}>
              <div style={styles.loadingEmoji}>🍳</div>
              <h2 style={styles.loadingTitle}>Cooking up a recipe…</h2>
              <p style={styles.loadingSubtitle}>The AI is thinking. Usually takes 5–10 seconds.</p>
              <div style={styles.loadingDots}>
                <Dot delay="0ms" />
                <Dot delay="150ms" />
                <Dot delay="300ms" />
              </div>
            </div>
          </div>
        )}

        {/* Show input alongside loading so user can cancel by going back (not needed — loading blocks anyway) */}
        {status === "loading" && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button style={styles.cancelBtn} onClick={reset}>
              Cancel
            </button>
          </div>
        )}

        {/* Recipe result */}
        {status === "success" && recipe && (
          <div style={{ animation: "fadeIn 400ms ease" }}>
            <RecipeCard recipe={recipe} onNewRecipe={reset} />
          </div>
        )}
      </main>
    </>
  );
}

function Dot({ delay }) {
  return (
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "var(--accent)",
        display: "inline-block",
        animation: `pulse 1.2s ${delay} ease-in-out infinite`,
      }}
    />
  );
}

const styles = {
  main: {
    minHeight: "100dvh",
    padding: "1.5rem 1rem",
  },
  errorBanner: {
    maxWidth: 560,
    margin: "0 auto",
    marginTop: "1rem",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    background: "var(--error-light)",
    border: "1.5px solid var(--error)",
    borderRadius: "var(--radius)",
    padding: "1rem 1.25rem",
    flexWrap: "wrap",
  },
  errorIcon: { fontSize: "1.3rem", marginTop: 2 },
  errorText: { fontSize: "0.9rem", color: "var(--error)", marginTop: "0.2rem" },
  retryBtn: {
    marginLeft: "auto",
    padding: "0.5rem 1rem",
    background: "var(--error)",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.88rem",
  },
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4rem 1rem",
  },
  loadingCard: {
    textAlign: "center",
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    padding: "2.5rem 2rem",
    maxWidth: 360,
    width: "100%",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--border)",
  },
  loadingEmoji: {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block",
    animation: "pulse 1.5s ease infinite",
  },
  loadingTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  loadingSubtitle: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
  },
  loadingDots: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
  },
  cancelBtn: {
    padding: "0.5rem 1.25rem",
    background: "transparent",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "0.88rem",
  },
};
