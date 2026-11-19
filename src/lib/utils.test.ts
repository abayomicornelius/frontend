import { describe, it, expect } from 'vitest'
import { parseMoneyInput } from './utils'

describe('parseMoneyInput', () => {
  it('parses a plain integer', () => {
    expect(parseMoneyInput('42')).toBe('42')
  })

  it('parses a plain decimal', () => {
    expect(parseMoneyInput('1234.56')).toBe('1234.56')
  })

  it('returns null for empty string', () => {
    expect(parseMoneyInput('')).toBeNull()
  })

  it('returns null for whitespace-only input', () => {
    expect(parseMoneyInput('   ')).toBeNull()
  })

  it('returns null for non-numeric input', () => {
    expect(parseMoneyInput('abc')).toBeNull()
  })

  it('respects maxDecimals', () => {
    expect(parseMoneyInput('1.23456789', 2)).toBe('1.23')
  })

  it('strips trailing zeros after decimal', () => {
    expect(parseMoneyInput('1.5000')).toBe('1.5')
  })

  it('handles zero', () => {
    expect(parseMoneyInput('0')).toBe('0')
  })
})
