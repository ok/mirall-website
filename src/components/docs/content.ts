// Shared docs content types + pure helpers. Kept free of JSX so component files
// can stay component-only (react-refresh/only-export-components).

export type Block =
  | { type: 'p'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'note'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'steps'; items: Array<{ title?: string; text: string }> }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'image'; src: string; alt: string; width?: number; height?: number }

export interface RelatedLink {
  label: string
  to: string
}

export interface DocItem {
  id: string
  title: string
  intro?: string
  blocks?: Block[]
  list?: string[]
  table?: { columns: string[]; rows: string[][] }
  image?: { src: string; alt: string; width?: number; height?: number }
  related?: RelatedLink[]
}

function stripInline(text: string): string {
  return text.replace(/\*\*/g, '').replace(/`/g, '')
}

// Extract the first steps block of a doc as plain HowTo steps for structured data.
export function stepsFromDoc(doc: DocItem): Array<{ title: string; description: string }> | null {
  const stepsBlock = doc.blocks?.find((b) => b.type === 'steps') as
    | { type: 'steps'; items: Array<{ title?: string; text: string }> }
    | undefined
  if (!stepsBlock) return null
  return stepsBlock.items.map((s, i) => ({
    title: s.title || `Step ${i + 1}`,
    description: stripInline(s.text),
  }))
}
