import { useState } from 'react'
import type { SchemaTable, OutputColumn } from '../../types'

interface Props {
  problemDescription: string
  schema: SchemaTable[]
  selectedColumns: Set<string>
  outputColumns: OutputColumn[]
  sortOrder: string
  expectedRows: string
}

export default function PromptCopyButton({
  problemDescription, schema, selectedColumns, outputColumns, sortOrder, expectedRows
}: Props) {
  const [copied, setCopied] = useState(false)

  function buildPrompt(): string {
    const schemaText = schema.map((table) => {
      const cols = table.columns.map((c) => `  - ${c.name} (${c.type})`).join('\n')
      return `[${table.name}]\n${cols}`
    }).join('\n\n')

    const selectedText = selectedColumns.size > 0
      ? [...selectedColumns].join('\n')
      : '(선택된 컬럼 없음)'

    const outputHeader = outputColumns.map((c) => c.name || '(미입력)').join(' | ')
    const outputSample = outputColumns.map((c) => c.sampleValue || '...').join(' | ')
    const outputText = outputColumns.length > 0
      ? `| ${outputHeader} |\n| ${outputSample} |`
      : '(정의된 컬럼 없음)'

    return `아래 데이터베이스에서 SQLite 쿼리를 작성해주세요.

[문제]
${problemDescription}

[데이터베이스 스키마]
${schemaText}

[내가 필요하다고 생각하는 테이블/컬럼]
${selectedText}

[원하는 결과물]
${outputText}${sortOrder ? `\n정렬 기준: ${sortOrder}` : ''}${expectedRows ? `\n예상 행 수: ${expectedRows}` : ''}

[요청]
위 조건에 맞는 SQLite 쿼리를 작성해주세요. 쿼리만 코드 블록으로 반환해주세요.`
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPrompt())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = buildPrompt()
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
        copied
          ? 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
          : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          복사됨
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          AI 프롬프트 복사하기
        </>
      )}
    </button>
  )
}
