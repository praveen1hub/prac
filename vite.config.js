import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.VITE_REPO_NAME || 'prac'
const env = process.env.VITE_DEPLOY_ENV || process.env.VITE_ENV || 'prod'

export default defineConfig({
  base:
    env === 'dev'
      ? `/${repoName}/dev/`
      : env === 'uat'
      ? `/${repoName}/uat/`
      : `/${repoName}/`,
  plugins: [react()],
})