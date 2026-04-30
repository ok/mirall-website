export type Platform =
  | 'darwin-universal'
  | 'win32-x64'
  | 'linux-x64'
  | 'linux-arm64'

type UAData = {
  platform: string
  getHighEntropyValues(hints: string[]): Promise<{ architecture?: string; bitness?: string }>
}

function getUAData(): UAData | null {
  const nav = navigator as Navigator & { userAgentData?: UAData }
  return nav.userAgentData ?? null
}

// Apple Silicon reports "Apple M1/M2/M3..." or "Apple GPU" via WEBGL_debug_renderer_info.
// Intel Macs report "Intel Iris...", "AMD Radeon...", etc.
function isAppleSiliconViaWebGL(): boolean | null {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return null
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (!ext) return null
    const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
    if (!renderer) return null
    return /Apple (M\d|GPU)/i.test(renderer)
  } catch {
    return null
  }
}

export async function detectPlatform(): Promise<Platform | null> {
  const ua = navigator.userAgent
  const uaData = getUAData()

  const osRaw = uaData?.platform ?? ua
  const isMac = /mac/i.test(osRaw)
  const isWin = /windows|win32/i.test(osRaw)
  const isLinux = /linux/i.test(osRaw) && !/android/i.test(ua)
  if (!isMac && !isWin && !isLinux) return null

  let arch: 'arm' | 'x86' | null = null

  if (uaData?.getHighEntropyValues) {
    try {
      const hv = await uaData.getHighEntropyValues(['architecture', 'bitness'])
      if (hv.architecture === 'arm') arch = 'arm'
      else if (hv.architecture === 'x86') arch = 'x86'
    } catch {
      // ignore — fall through to UA-string heuristics
    }
  }

  if (!arch) {
    // navigator.platform is deprecated but still honest about arch on
    // Firefox (e.g. "Linux aarch64"). macOS always lies here ("MacIntel").
    const platformStr = (navigator as Navigator & { platform?: string }).platform ?? ''
    const hint = `${ua} ${platformStr}`
    if (/aarch64|arm64|armv\d/i.test(hint)) arch = 'arm'
    else if (/x86_64|x64|Win64|WOW64|amd64/i.test(hint)) arch = 'x86'
  }

  // macOS spoofs UA to "Intel" on Apple Silicon; the only live signal left
  // is WebGL renderer, and Safari 15+ hides it. Default to x86 when
  // inconclusive: Rosetta 2 runs x64 binaries on Apple Silicon transparently,
  // but Intel Macs cannot run arm64 at all — Intel is the safer miss.
  if (isMac && !arch) {
    const apple = isAppleSiliconViaWebGL()
    if (apple === true) arch = 'arm'
    else arch = 'x86'
  }

  if (!arch) arch = 'x86'

  if (isMac) return 'darwin-universal'
  // Windows ARM users get the x64 build — runs via transparent emulation on Win11.
  if (isWin) return 'win32-x64'
  return arch === 'arm' ? 'linux-arm64' : 'linux-x64'
}
