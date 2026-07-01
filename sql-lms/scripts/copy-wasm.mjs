/**
 * Copies the sql.js WASM binary into public/ so the frontend can load it at /sql-wasm.wasm.
 * Cross-platform (replaces a Unix-only `cp ... || true` postinstall).
 * Never fails the install — missing source is logged and ignored.
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const src = resolve(root, 'node_modules/sql.js/dist/sql-wasm.wasm')
const destDir = resolve(root, 'public')
const dest = resolve(destDir, 'sql-wasm.wasm')

try {
  if (!existsSync(src)) {
    console.warn('[copy-wasm] source not found, skipping:', src)
    process.exit(0)
  }
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
  copyFileSync(src, dest)
  console.log('[copy-wasm] copied sql-wasm.wasm -> public/')
} catch (err) {
  console.warn('[copy-wasm] skipped:', err instanceof Error ? err.message : String(err))
  process.exit(0)
}
