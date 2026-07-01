import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import type { QueryResult, SchemaTable } from '../types'

let SQL: SqlJsStatic | null = null

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: (file: string) => `/${file}` })
  }
  return SQL
}

export async function createDatabase(setupSql: string, extraSetupSql?: string | null): Promise<Database> {
  const SQL = await getSqlJs()
  const db = new SQL.Database()
  db.run(setupSql)
  if (extraSetupSql) {
    db.run(extraSetupSql)
  }
  return db
}

export function runQuery(db: Database, sql: string): QueryResult {
  const trimmed = sql.trim()
  if (!trimmed) throw new Error('쿼리를 입력해주세요.')

  const results = db.exec(trimmed)
  if (results.length === 0) return { columns: [], values: [] }

  return {
    columns: results[0].columns,
    values: results[0].values as (string | number | null)[][],
  }
}

export function getSchema(db: Database): SchemaTable[] {
  const tables = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  )
  if (tables.length === 0) return []

  return (tables[0].values as string[][]).map(([tableName]) => {
    const info = db.exec(`PRAGMA table_info(${tableName})`)
    const columns = info.length > 0
      ? (info[0].values as (string | number | null)[][]).map((row) => ({
          name: row[1] as string,
          type: (row[2] as string) || 'TEXT',
          notnull: row[3] === 1,
          pk: row[5] === 1,
        }))
      : []
    return { name: tableName, columns }
  })
}

export function closeDatabase(db: Database) {
  db.close()
}
