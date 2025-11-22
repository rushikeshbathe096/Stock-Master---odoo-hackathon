# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Frontend Setup for StockMaster (local dev)

This project uses Vite + React. The frontend expects the backend API to be available under the `/api` path.

Quick start (PowerShell):

1. (Optional) Create a `.env` or `.env.local` in the `frontend` folder to override the API base:

```powershell
# optional override; defaults to http://localhost:4000/api
VITE_API_BASE=http://localhost:4000/api
```

2. Install and run the dev server:

```powershell
cd 'c:\Users\Rushikesh\Desktop\Stock Master-Odoo Hackathon\frontend'
npm install
npm run dev
```

Notes
- The Vite dev server proxies `/api` to `http://localhost:4000` by default — change `vite.config.js` if your backend runs elsewhere.
- After login the frontend stores the JWT in `localStorage` under the key `token`.
- Test sequence: signup → login → create product → create receipt → validate receipt (backend must be running and migrated).

If you want a combined README for backend + frontend, tell me and I'll add it at repository root.
