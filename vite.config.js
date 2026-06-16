export default defineConfig({
  base: '/prac/',   // repo name
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  }
})
