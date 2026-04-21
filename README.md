# Frontend (React + TypeScript + Vite)

The app lives in `frontend/` and is deployable to Vercel.

## Local development

```bash
cd frontend
npm ci
npm run dev
```

## Build

```bash
cd frontend
npm run build
npm run preview
```

## Vercel

This repo includes a root `vercel.json` that builds the app from `frontend/`
and configures SPA rewrites.
