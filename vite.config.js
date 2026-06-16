import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/prac/',   // must match repo name exactly
  plugins: [react()],
})
