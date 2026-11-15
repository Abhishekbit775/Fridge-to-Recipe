import React, { useState } from "react";
import ServingsControl from "./ServingsControl.jsx";
import IngredientList from "./IngredientList.jsx";
import StepList from "./StepList.jsx";

const DIFF_COLOR = {
  Easy: { bg: "#d8f3dc", text: "#1b4332" },
  Medium: { bg: "#fff3e0", text: "#7c3d12" },
  Hard: { bg: "#fdecea", text: "#7f1d1d" },
};

export default function RecipeCard({ recipe, onNewRecipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const ratio = servings / recipe.servings;

  const diff = DIFF_COLOR[recipe.difficulty] || DIFF_COLOR.Medium;

  return (
    <article style={styles.card}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.meta}>
          {recipe.tags?.map((tag) => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
        <h1 style={styles.title}>{recipe.title}</h1>
        <p style={styles.description}>{recipe.description}</p>

        <div style={styles.stats}>
          <Stat icon="⏱" label="Prep" value={recipe.prepTime} />
          <Stat icon="🔥" label="Cook" value={recipe.cookTime} />
          <Stat
            icon="📊"
            label="Difficulty"
            value={
              <span
                style={{
                  color: diff.text,
                  background: diff.bg,
                  padding: "0.1rem 0.5rem",
                  borderRadius: 4,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                }}
              >
                {recipe.difficulty}
              </span>
            }
          />
        </div>
      </header>

      {/* Servings */}
      <div style={styles.servingsRow}>
        <ServingsControl
          servings={servings}
          baseServings={recipe.servings}
          onChange={setServings}
        />
        {ratio !== 1 && (
          <span style={styles.scaleNote}>
            Scaled ×{ratio.toFixed(2)}
          </span>
        )}
      </div>

      {/* Ingredients */}
      <IngredientList ingredients={recipe.ingredients} ratio={ratio} />

      {/* Steps */}
      <StepList steps={recipe.steps} />

      {/* Footer */}
      <div style={styles.footer}>
        <button onClick={onNewRecipe} style={styles.newBtn}>
          ← New recipe
        </button>
      </div>
    </article>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div style={statStyles.wrapper}>
      <span style={statStyles.icon}>{icon}</span>
      <div>
        <div style={statStyles.label}>{label}</div>
        <div style={statStyles.value}>{value}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "1rem",
    paddingBottom: "3rem",
  },
  header: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    padding: "1.5rem",
    marginBottom: "1.25rem",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginBottom: "0.75rem",
  },
  tag: {
    fontSize: "0.78rem",
    color: "var(--accent)",
    background: "var(--accent-light)",
    padding: "0.2rem 0.6rem",
    borderRadius: 20,
    fontWeight: 600,
  },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: 800,
    letterSpacing: "-0.3px",
    marginBottom: "0.5rem",
    color: "var(--text)",
  },
  description: {
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    marginBottom: "1rem",
  },
  stats: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    paddingTop: "1rem",
    borderTop: "1px solid var(--border)",
  },
  servingsRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
    background: "var(--surface)",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
  },
  scaleNote: {
    fontSize: "0.8rem",
    color: "var(--warn)",
    background: "var(--warn-light)",
    padding: "0.2rem 0.6rem",
    borderRadius: 6,
    fontWeight: 600,
    marginLeft: "auto",
  },
  footer: {
    paddingTop: "1rem",
    borderTop: "1px solid var(--border)",
    marginTop: "1rem",
  },
  newBtn: {
    padding: "0.6rem 1.2rem",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--text-muted)",
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 180ms",
  },
};

const statStyles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  icon: { fontSize: "1.1rem" },
  label: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  value: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text)",
  },
};
