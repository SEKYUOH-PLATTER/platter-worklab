import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @deno-types="https://esm.sh/@types/sql.js@1.4.9/index.d.ts"
import initSqlJs from 'https://esm.sh/sql.js@1.12.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Load sql.js once per isolate. In Deno we must hand Emscripten the wasm bytes
// directly — letting it fetch/locate the wasm itself aborts the isolate (503).
let sqlPromise: ReturnType<typeof initSqlJs> | null = null
function getSql() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const res = await fetch('https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.wasm')
      const wasmBinary = new Uint8Array(await res.arrayBuffer())
      return await initSqlJs({ wasmBinary })
    })()
  }
  return sqlPromise
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { problem_id, submitted_sql } = await req.json()

    if (!problem_id || !submitted_sql?.trim()) {
      return new Response(
        JSON.stringify({ error: 'problem_id and submitted_sql are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role key — bypasses RLS to read problem_solutions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify caller is authenticated and whitelisted
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user?.email) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: whitelist } = await supabase
      .from('email_whitelist')
      .select('email')
      .eq('email', user.email)
      .single()

    if (!whitelist) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch problem + dataset + solution (service role bypasses problem_solutions RLS)
    const { data: problem, error: problemError } = await supabase
      .from('problems')
      .select('dataset_id, extra_setup_sql, grading_mode')
      .eq('id', problem_id)
      .single()

    if (problemError || !problem) {
      return new Response(
        JSON.stringify({ error: 'Problem not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: solution } = await supabase
      .from('problem_solutions')
      .select('solution_sql')
      .eq('problem_id', problem_id)
      .single()

    if (!solution?.solution_sql) {
      return new Response(
        JSON.stringify({ error: 'Solution not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let setupSql = ''
    if (problem.dataset_id) {
      const { data: dataset } = await supabase
        .from('datasets')
        .select('setup_sql')
        .eq('id', problem.dataset_id)
        .single()
      if (dataset) setupSql = dataset.setup_sql
    }

    // Initialize sql.js in Deno (wasm bytes fetched explicitly, see getSql)
    const SQL = await getSql()

    function runInDb(setup: string, extra: string | null, query: string) {
      const db = new SQL.Database()
      try {
        db.run(setup)
        if (extra) db.run(extra)
        const results = db.exec(query)
        if (!results.length) return { columns: [], values: [] }
        return { columns: results[0].columns, values: results[0].values }
      } finally {
        db.close()
      }
    }

    const submitted = runInDb(setupSql, problem.extra_setup_sql, submitted_sql)
    const expected = runInDb(setupSql, problem.extra_setup_sql, solution.solution_sql)

    // Compare results
    function rowKey(row: unknown[]) {
      return JSON.stringify(row)
    }

    function normalize(values: unknown[][]): string[] {
      return values.map(rowKey).sort()
    }

    let is_correct: boolean
    if (problem.grading_mode === 'ordered') {
      is_correct =
        submitted.columns.length === expected.columns.length &&
        submitted.values.length === expected.values.length &&
        submitted.values.every((row, i) => rowKey(row) === rowKey(expected.values[i]))
    } else {
      const submittedNorm = normalize(submitted.values)
      const expectedNorm = normalize(expected.values)
      is_correct =
        submitted.columns.length === expected.columns.length &&
        submittedNorm.length === expectedNorm.length &&
        submittedNorm.every((r, i) => r === expectedNorm[i])
    }

    // Record submission
    await supabase.from('submissions').insert({
      user_id: user.id,
      problem_id,
      submitted_sql,
      is_correct,
    })

    return new Response(
      JSON.stringify({
        is_correct,
        actual_columns: submitted.columns,
        actual_rows: submitted.values,
        expected_columns: expected.columns,
        expected_rows: expected.values,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
