# 🍳 Fridge to Recipe

> Tell the AI what's in your fridge — get a full interactive recipe back.

A React + Express app built for the Frontend Internship Assignment. You enter ingredients, the AI returns a structured JSON recipe, and the UI lets you check off steps, scale servings, and swap ingredients.

---

## Setup

### Prerequisites
- Node.js ≥ 18
- A free [Groq API key](https://console.groq.com) (free tier, no credit card)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd fridge-to-recipe

# Install root dev deps (concurrently)
npm install

# Install backend + frontend deps
npm run install:all
```

### 2. Add your API key
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and paste your GROQ_API_KEY
```

### 3. Run
```bash
npm start
```

Opens:
- Frontend → http://localhost:5173
- Backend API → http://localhost:3001

---

## Features

| Feature | Details |
|---|---|
| Free-form input | Type ingredients in plain text, comma-separated |
| AI recipe generation | Groq `llama3-8b-8192`, returns structured JSON |
| Interactive steps | Click to check off each step, progress bar |
| Servings scaler | ±buttons scale all ingredient amounts live |
| Ingredient swaps | Per-ingredient alternatives from the AI |
| Robust error handling | Malformed JSON recovery, timeout, rate-limit, stale-request guard |
| Mobile responsive | Works on all screen sizes |
| Loading / error / empty states | Full UI coverage |

---

## Architecture

```
fridge-to-recipe/
├── backend/
│   └── server.js        # Express API — calls Groq, validates + sanitises JSON
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── hooks/
│       │   └── useRecipe.js      # fetch logic, stale-request guard, timeout
│       └── components/
│           ├── IngredientInput.jsx
│           ├── RecipeCard.jsx
│           ├── IngredientList.jsx
│           ├── ServingsControl.jsx
│           └── StepList.jsx
└── README.md
```

**Why a backend?** The API key must never ship to the browser. The Express server proxies every model call, so the key stays in `backend/.env`.

---

## Error handling (the interesting part)

The assignment says handling bad AI output is "where most of the signal is". Here's what this app handles:

1. **Malformed JSON** — `extractJSON()` tries direct parse, then scans for `{…}` boundaries if the model wrapped output in markdown fences or added prose.
2. **Wrong shape** — `validateRecipe()` checks all required fields; coerces `amount` from string to number if the model returns `"2"` instead of `2`; defaults optional fields.
3. **Stale responses** — each request gets a `requestId`; the response is dropped if a newer request has started before it resolves.
4. **Timeout** — `AbortSignal.timeout(30_000)` on the `fetch` call.
5. **Rate limit / 401 / 5xx** — mapped to user-friendly messages.
6. **Empty response** — explicit check on `choices[0].message.content`.

---

## Known limitations

- No session persistence (refresh loses the recipe)
- No streaming (full response before render)
- Smaller LLMs (Groq free tier) occasionally return slightly off amounts or miss a swap — the validation layer catches shape errors but can't fix semantically wrong data
- No auth; single-user

---

## AI usage note

This project was built with Claude (Anthropic) as a coding assistant. Claude was used for:
- Scaffolding the initial component structure
- Writing the JSON validation and extraction logic
- CSS-in-JS styling patterns
- Reviewing error-handling edge cases

All architecture decisions, component decomposition, and UI logic were my own. I understand every line of code and can explain, extend, and debug it.

---

## Time spent

| Task | Time |
|---|---|
| Reading assignment, planning architecture | 30 min |
| Backend (Express + Groq + validation) | 1.5 h |
| Frontend scaffold + routing | 45 min |
| IngredientInput + examples | 30 min |
| RecipeCard + ServingsControl | 1 h |
| IngredientList + swap UX | 1 h |
| StepList + progress | 45 min |
| Error states + stale-request guard | 45 min |
| Mobile polish + README | 30 min |
| **Total** | **~7.5 h** |
