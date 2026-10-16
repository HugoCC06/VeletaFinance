import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveBasePath, resolveSiteUrl } from './site.config.ts'

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), 'VITE_') }
  const base = mode === 'test' ? '/' : resolveBasePath(env)
  const siteUrl = resolveSiteUrl(env)
  return {
    base,
    plugins: [
      react(),
      {
        name: 'veleta-site-url',
        transformIndexHtml(html) {
          return html.replaceAll('%SITE_URL%', siteUrl)
        },
      },
    ],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    build: {
      chunkSizeWarningLimit: 700,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
    },
  }
})
