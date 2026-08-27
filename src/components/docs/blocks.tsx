import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Info, ArrowRight } from '@phosphor-icons/react'
import type { Block, RelatedLink } from './content'
import { DOC_IMAGES, DOC_IMAGE_SIZES } from './images'

// Docs content lives in the i18n locale JSON as plain data (see ./content.ts for
// the shape) and is rendered by the generic components below. Inline emphasis is
// expressed with a minimal markdown subset: **bold**, `code` and [label](href).

// ── Inline rich text (**bold**, `code`, [label](href)) ───────────────────────

const INLINE = /(\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*]+\*\*|`[^`]+`)/g
const INLINE_LINK = /^\[([^\]]+)\]\(([^)]+)\)$/

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null
  INLINE.lastIndex = 0
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    const token = match[0]
    const link = INLINE_LINK.exec(token)
    if (link) {
      const [, label, href] = link
      const className =
        'text-primary font-semibold underline underline-offset-2 hover:text-emerald-500 transition-colors'
      nodes.push(
        href.startsWith('http') ? (
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {label}
          </a>
        ) : (
          <Link key={key++} to={href} className={className}>
            {label}
          </Link>
        ),
      )
    } else if (token.startsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-semibold text-on-surface">
          {token.slice(2, -2)}
        </strong>,
      )
    } else {
      nodes.push(
        <code
          key={key++}
          className="font-mono text-[0.92em] bg-surface-container-low text-on-surface rounded px-1.5 py-0.5"
        >
          {token.slice(1, -1)}
        </code>,
      )
    }
    lastIndex = INLINE.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export function RichText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{renderInline(text)}</span>
}

// ── Block primitives ─────────────────────────────────────────────────────────

export function Steps({ items }: { items: Array<{ title?: string; text: string }> }) {
  return (
    <ol className="space-y-3 mb-6">
      {items.map((step, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="w-7 h-7 rounded-full hero-gradient text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
            {i + 1}
          </span>
          <span className="text-lg text-on-surface-variant leading-relaxed pt-0.5">
            {step.title && (
              <span className="font-semibold text-on-surface">{step.title}. </span>
            )}
            {renderInline(step.text)}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <Check size={20} weight="bold" className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <span className="text-on-surface-variant leading-relaxed">{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  )
}

export function RefTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl border border-outline-variant/30">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low">
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className="px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-on-surface-variant"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-outline-variant/20 align-top">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th
                    key={c}
                    scope="row"
                    className="px-4 py-3 font-semibold text-on-surface whitespace-nowrap text-left"
                  >
                    {renderInline(cell)}
                  </th>
                ) : (
                  <td key={c} className="px-4 py-3 text-on-surface-variant leading-relaxed">
                    {renderInline(cell)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Note({ text }: { text: string }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl bg-surface-container-low p-5">
      <Info size={20} weight="fill" className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-on-surface-variant leading-relaxed">{renderInline(text)}</p>
    </div>
  )
}

export function DocImage({
  src,
  alt,
  width = 1344,
  height = 1165,
}: {
  src: string
  alt: string
  width?: number
  height?: number
}) {
  const resolved = DOC_IMAGES[src]
  return (
    <div className="my-8">
      {/* No rounded-* here: the asset carries the window's own corners in its alpha, and
          the macOS shadow is cropped off in the capture pipeline. rounded-xl (12px) clipped
          harder than the window's real 5.6px radius and squared the corners back off.
          drop-shadow() follows the alpha, so the shadow traces the true rounded shape. */}
      <img
        className="w-full max-w-2xl mx-auto object-cover"
        style={{ filter: 'drop-shadow(0 1px 1.5px rgba(16, 24, 40, 0.12)) drop-shadow(0 5px 7px rgba(16, 24, 40, 0.22))' }}
        alt={alt}
        src={resolved?.src ?? src}
        srcSet={resolved?.srcSet}
        sizes={resolved ? DOC_IMAGE_SIZES : undefined}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export function RelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <div className="mt-6">
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-3">
        Related
      </p>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.to}
              className="inline-flex items-center gap-1.5 text-primary hover:text-emerald-500 transition-colors font-medium"
            >
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CodeBlock({ text, language }: { text: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard is unavailable over plain HTTP and in locked-down browsers; the
      // command stays selectable by hand, so a failed copy is not worth surfacing.
    }
  }

  return (
    <div className="relative mb-6">
      <pre className="overflow-x-auto rounded-xl bg-surface-container-low p-5 pr-20 text-sm leading-relaxed">
        <code className="font-mono text-on-surface" data-language={language}>
          {text}
        </code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute top-3 right-3 rounded-lg px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Command copied to clipboard' : ''}
      </span>
    </div>
  )
}

export function DocBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="text-on-surface-variant leading-relaxed mb-6 text-lg">
                {renderInline(block.text)}
              </p>
            )
          case 'subheading':
            return (
              <h3 key={i} className="text-xl font-bold mb-3 mt-8">
                {block.text}
              </h3>
            )
          case 'note':
            return <Note key={i} text={block.text} />
          case 'bullets':
            return <Bullets key={i} items={block.items} />
          case 'steps':
            return <Steps key={i} items={block.items} />
          case 'table':
            return <RefTable key={i} columns={block.columns} rows={block.rows} />
          case 'code':
            return <CodeBlock key={i} text={block.text} language={block.language} />
          case 'image':
            return (
              <DocImage
                key={i}
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
