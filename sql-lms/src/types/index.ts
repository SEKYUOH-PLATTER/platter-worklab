export type Track = 'syntax' | 'case'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type GradingMode = 'ordered' | 'unordered'

export interface Dataset {
  id: string
  domain: string
  title: string
  description: string | null
  setup_sql: string
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  order_num: number
  track: Track
  domain: string | null
  title: string
  description: string | null
}

export interface Problem {
  id: string
  chapter_id: string | null
  dataset_id: string
  track: Track
  domain: string | null
  difficulty: Difficulty
  title: string
  description: string | null
  extra_setup_sql: string | null
  grading_mode: GradingMode
  expected_input_columns: string[] | null
  tags: string[] | null
  created_at: string
  dataset?: Dataset
  chapter?: Chapter
}

export interface Submission {
  id: string
  user_id: string
  problem_id: string
  submitted_sql: string
  is_correct: boolean
  submitted_at: string
}

export interface UserProfile {
  id: string
  is_admin: boolean
}

export interface EmailWhitelist {
  email: string
  note: string | null
  added_at: string
}

export interface QueryResult {
  columns: string[]
  values: (string | number | null)[][]
}

export interface GradeResult {
  is_correct: boolean
  actual_rows: QueryResult | null
  expected_rows: QueryResult | null
  error?: string
}

export interface SchemaTable {
  name: string
  columns: SchemaColumn[]
}

export interface SchemaColumn {
  name: string
  type: string
  notnull: boolean
  pk: boolean
}

export interface OutputColumn {
  id: string
  name: string
  sampleValue: string
}
