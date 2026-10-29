/**
 * A heading's words, each in its own mask so it can rise into place. Rendered on
 * the server too, so the markup is final before any script runs; only the motion
 * classes are added later, and only below the fold.
 */
export default function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) || !part ? (
          part
        ) : (
          <span key={i} className="st-w">
            <span style={{ '--wi': start + i / 2 } as React.CSSProperties}>{part}</span>
          </span>
        ),
      )}
    </>
  )
}

