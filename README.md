# Ncart React Starter (Vite + Tailwind)

This is a starter React implementation of your Ncart site, with search, category filter, price sort, product modal, basic cart drawer, and dark mode.

## Step 1 — Install
```bash
npm install
```

## Step 2 — Run in Dev
```bash
npm run dev
```
Then open the printed local URL in your browser.

## Step 3 — Build for Production
```bash
npm run build
npm run preview
```

### Notes
- Tailwind dark mode is enabled (class strategy). Use the sun/moon button to toggle.
- Products are in `App.jsx` as `initialProducts`. Replace images with your own `/public/img/...` assets or URLs.
- Next steps we can add React Router (pages), Context API for global cart, and persist cart to localStorage.
