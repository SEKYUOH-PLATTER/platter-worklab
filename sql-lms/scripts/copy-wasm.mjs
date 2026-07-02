/**
 * Copies the sql.js WASM binaries into public/ so the frontend can load them.
 * The bundled browser build of sql.js requests `sql-wasm-browser.wasm`, so that
 * file must be present; we also copy `sql-wasm.wasm` for the Node/default build.
 * Cross-platform (replaces a Unix-only `cp ... || true` postinstall).
 * Never fails the install — a missing source is logged and ignored.
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const destDir = resolve(root, 'public')
const files = ['sql-wasm-browser.wasm', 'sql-wasm.wasm']

try {
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
  for (const file of files) {
    const src = resolve(root, 'node_modules/sql.js/dist', file)
    if (!existsSync(src)) {
      console.warn('[copy-wasm] source not found, skipping:', file)
      continue
    }
    copyFileSync(src, resolve(destDir, file))
    console.log(`[copy-wasm] copied ${file} -> public/`)
  }
} catch (err) {
  console.warn('[copy-wasm] skipped:', err instanceof Error ? err.message : String(err))
  process.exit(0)
}
