import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In GitHub Actions the workflow sets these env vars at build time.
// Locally they are undefined, so base falls back to '/'.
const repoName   = process.env.VITE_REPO_NAME   // e.g. 'ncart-react'
const deployEnv  = process.env.VITE_DEPLOY_ENV  // 'dev' | 'uat' | 'prod'

const base = repoName && deployEnv
  ? `/${repoName}/${deployEnv}/`
  : '/'

export default defineConfig({
  plugins: [react()],
  base,
  css: {
    postcss: './postcss.config.js',
  },
})
