export type Platform =
  | 'darwin-arm64'
  | 'darwin-x64'
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
    if (/aarch64|arm64/i.test(ua)) arch = 'arm'
    else if (/x86_64|x64|Win64|WOW64|amd64/i.test(ua)) arch = 'x86'
  }

  // macOS spoofs UA to "Intel" on Apple Silicon; use WebGL renderer.
  // Default to arm when inconclusive — Apple stopped shipping Intel Macs in 2023.
  if (isMac && !arch) {
    const apple = isAppleSiliconViaWebGL()
    if (apple === false) arch = 'x86'
    else arch = 'arm'
  }

  if (!arch) arch = 'x86'

  if (isMac) return arch === 'arm' ? 'darwin-arm64' : 'darwin-x64'
  // Windows ARM users get the x64 build — runs via transparent emulation on Win11.
  if (isWin) return 'win32-x64'
  return arch === 'arm' ? 'linux-arm64' : 'linux-x64'
}
