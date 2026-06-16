import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const env = process.env.VITE_ENV || 'prod'

export default defineConfig({
  base:
    env === 'dev'
      ? '/prac/dev/'
      : env === 'uat'
      ? '/prac/uat/'
      : '/prac/',
  plugins: [react()],
})
