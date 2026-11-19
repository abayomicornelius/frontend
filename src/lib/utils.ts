// ─── cn() — className merger (no external dep) ────────────────────────────────

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>

export function cn(...inputs: ClassValue[]): string {
  return inputs.flatMap(toClassArray).filter(Boolean).join(' ')
}

function toClassArray(val: ClassValue): string[] {
  if (!val && val !== 0) return []
  if (typeof val === 'string') return [val]
  if (typeof val === 'number') return [String(val)]
  if (Array.isArray(val)) return val.flatMap(toClassArray)
  if (typeof val === 'object') {
    return Object.entries(val)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
  }
  return []
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...opts,
    })
  } catch {
    return iso
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(iso)
}

// ─── Clipboard ────────────────────────────────────────────────────────────────

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}

// ─── Money input parsing ──────────────────────────────────────────────────────

/**
 * Parses a locale-formatted money string into a canonical decimal string safe
 * to send to the backend (e.g. "1.234,56" → "1234.56", "1 234,56" → "1234.56").
 *
 * Strategy: probe the runtime locale's decimal separator via Intl, strip
 * thousands separators, replace the decimal separator with ".", then parse.
 * Returns null for empty input or non-numeric values.
 */
export function parseMoneyInput(raw: string, maxDecimals = 7): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  // Detect the locale's decimal and thousands separators by formatting a known value.
  const parts = new Intl.NumberFormat(undefined, { minimumFractionDigits: 1 })
    .formatToParts(1234567.8)
  const decimalSep  = parts.find(p => p.type === 'decimal')?.value  ?? '.'
  const groupSep    = parts.find(p => p.type === 'group')?.value    ?? ','

  // Strip thousands separators, replace locale decimal with ".", remove any
  // other non-numeric characters except a leading minus.
  const normalized = trimmed
    .replace(new RegExp(`\\${groupSep}`, 'g'), '')
    .replace(new RegExp(`\\${decimalSep}`), '.')

  const num = parseFloat(normalized)
  if (isNaN(num)) return null

  return num.toFixed(maxDecimals).replace(/\.?0+$/, '') || '0'
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
