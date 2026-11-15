import { useState, useRef, useCallback } from "react";

export function useRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const latestRequestId = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchRecipe = useCallback(async (ingredients) => {
    // Generate a unique ID for this request to prevent stale responses overwriting newer ones
    const requestId = Date.now().toString();
    latestRequestId.current = requestId;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, requestId }),
        signal: AbortSignal.timeout(30_000), // 30s timeout
      });

      // Discard if a newer request has started
      if (latestRequestId.current !== requestId) return;

      const data = await res.json();

      if (latestRequestId.current !== requestId) return;

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      if (!data.recipe) {
        throw new Error("Server returned no recipe");
      }

      setRecipe(data.recipe);
      setStatus("success");
    } catch (err) {
      if (latestRequestId.current !== requestId) return;

      if (err.name === "TimeoutError" || err.name === "AbortError") {
        setError("Request timed out — the AI is taking too long. Please try again.");
      } else {
        setError(err.message || "Something went wrong");
      }
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    // Invalidate any in-flight request
    latestRequestId.current = null;
    setRecipe(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { recipe, status, error, fetchRecipe, reset };
}
