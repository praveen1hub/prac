# Ncart React

A Vite + React + Tailwind shopping app with search, category filter, price sort, product detail page, cart drawer, and dark mode.

## Project Structure

```
ncart/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Top nav with cart icon & dark toggle
│   │   ├── ProductCard.jsx   # Grid card with add-to-cart
│   │   └── CartDrawer.jsx    # Slide-in cart with qty controls
│   ├── pages/
│   │   ├── Home.jsx          # Search + filter + product grid
│   │   └── ProductDetail.jsx # Single product page
│   ├── App.jsx               # Routes + cart state
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind directives
├── .github/workflows/
│   └── ci-cd.yml             # GitHub Actions: build → deploy dev/uat/prod
├── Dockerfile                # Multi-stage build (node → nginx, ~25 MB)
├── docker-compose.yml        # Dev (hot-reload) + Prod (nginx) profiles
├── nginx.conf                # SPA routing + asset caching
├── vite.config.js            # Dynamic base path for GitHub Pages
├── tailwind.config.js
└── postcss.config.js
```

## Local Development

```bash
npm install
npm run dev
```

## Docker

```bash
# Hot-reload dev server on :5173
docker compose --profile dev up

# Production nginx build on :8080
docker compose --profile prod up --build
```

## CI/CD — GitHub Actions

Push to any branch to trigger the pipeline:

| Branch | Environment | URL |
|--------|-------------|-----|
| `dev`  | dev  | `https://<you>.github.io/<repo>/dev`  |
| `uat`  | uat  | `https://<you>.github.io/<repo>/uat`  |
| `main` | prod | `https://<you>.github.io/<repo>/prod` |

### One-time GitHub setup
1. Go to **Settings → Pages** → set source to `gh-pages` branch
2. Go to **Settings → Environments** → create `dev`, `uat`, `production`

## Production Build

```bash
npm run build   # outputs to dist/
npm run preview # preview locally
```
