const MONO = { fontFamily: 'var(--st-mono)' }
const DISPLAY = { fontFamily: 'var(--st-display)' }

/**
 * Two studio computers connected directly, a relay underneath that is used only
 * when the direct path fails, and the Console above that sends settings and never
 * file bytes. The moving packets are hidden under prefers-reduced-motion (CSS).
 */
export default function InfraDiagram({ label }: { label: string }) {
  return (
    <div className="st-diagram" role="img" aria-label={label} data-reveal>
      <svg viewBox="0 0 1000 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={MONO}>
        <defs>
          <marker id="st-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#fd9c42" /></marker>
          <marker id="st-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#5cc4b8" /></marker>
          <marker id="st-arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8f939c" /></marker>
        </defs>

        <rect x="30" y="120" width="220" height="120" rx="16" fill="#171b22" stroke="rgba(252,232,210,.16)" />
        <text x="54" y="160" fill="#fce8d2" fontWeight="800" fontSize="20" style={DISPLAY}>Edit suite</text>
        <text x="54" y="188" fill="#8f939c" fontSize="13">Mirall · Berlin</text>
        <text x="54" y="214" fill="#fd9c42" fontSize="12">NL104_cut_v08.mov</text>

        <rect x="750" y="120" width="220" height="120" rx="16" fill="#171b22" stroke="rgba(252,232,210,.16)" />
        <text x="774" y="160" fill="#fce8d2" fontWeight="800" fontSize="20" style={DISPLAY}>VFX vendor</text>
        <text x="774" y="188" fill="#8f939c" fontSize="13">Mirall · Lisbon</text>
        <text x="774" y="214" fill="#5cc4b8" fontSize="12">plates/ ← mirrored</text>

        <line x1="258" y1="168" x2="742" y2="168" stroke="#fd9c42" strokeWidth="2.5" markerEnd="url(#st-arr)" markerStart="url(#st-arr)" />
        <g className="st-pkt">
          <circle r="5" fill="#fd9c42"><animateMotion dur="2.2s" repeatCount="indefinite" path="M262 168 L738 168" /></circle>
          <circle r="5" fill="#fd9c42"><animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="M738 168 L262 168" /></circle>
          <circle r="4" fill="#5cc4b8"><animateMotion dur="3.6s" repeatCount="indefinite" path="M250 222 C 330 300, 360 300, 398 300 L 602 300 C 640 300, 670 300, 750 222" /></circle>
          <circle r="3" fill="#8f939c"><animateMotion dur="4s" repeatCount="indefinite" path="M390 70 C 300 70, 200 80, 160 116" /></circle>
          <circle r="3" fill="#8f939c"><animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M610 70 C 700 70, 800 80, 840 116" /></circle>
        </g>
        <rect x="390" y="148" width="220" height="40" rx="8" fill="#10131a" />
        <text x="500" y="173" fill="#fce8d2" fontSize="13" textAnchor="middle">direct · encrypted</text>

        <rect x="400" y="262" width="200" height="74" rx="14" fill="#10131a" stroke="#5cc4b8" strokeDasharray="5 5" />
        <text x="500" y="292" fill="#5cc4b8" fontSize="14" textAnchor="middle" fontWeight="500">Your relay</text>
        <text x="500" y="316" fill="#8f939c" fontSize="12" textAnchor="middle">blind · forwards ciphertext</text>
        <path d="M250 222 C 330 300, 360 300, 398 300" fill="none" stroke="#5cc4b8" strokeWidth="2" strokeDasharray="6 6" markerEnd="url(#st-arr2)" />
        <path d="M602 300 C 640 300, 670 300, 750 222" fill="none" stroke="#5cc4b8" strokeWidth="2" strokeDasharray="6 6" markerEnd="url(#st-arr2)" />
        <text x="300" y="320" fill="#8f939c" fontSize="11" textAnchor="middle">only if direct fails</text>

        <rect x="390" y="20" width="220" height="74" rx="14" fill="#10131a" stroke="rgba(252,232,210,.16)" />
        <text x="500" y="50" fill="#fce8d2" fontSize="14" textAnchor="middle" fontWeight="500">Mirall Console</text>
        <text x="500" y="74" fill="#8f939c" fontSize="12" textAnchor="middle">signed settings · no file bytes</text>
        <path d="M390 70 C 300 70, 200 80, 160 116" fill="none" stroke="#8f939c" strokeWidth="1.5" strokeDasharray="2 5" markerEnd="url(#st-arr3)" />
        <path d="M610 70 C 700 70, 800 80, 840 116" fill="none" stroke="#8f939c" strokeWidth="1.5" strokeDasharray="2 5" markerEnd="url(#st-arr3)" />
      </svg>
    </div>
  )
}
