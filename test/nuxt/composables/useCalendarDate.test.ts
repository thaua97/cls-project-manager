import { describe, expect, it } from 'vitest'

import { useCalendarDate } from '@/composables/useCalendarDate'

describe('useCalendarDate', () => {
	it('returns default date when value is undefined', () => {
		const { parseCalendarDate } = useCalendarDate()
		const date = parseCalendarDate(undefined)

		expect(date.year).toBe(2022)
		expect(date.month).toBe(1)
		expect(date.day).toBe(10)
	})

	it('returns default date when value is invalid', () => {
		const { parseCalendarDate } = useCalendarDate()
		const date = parseCalendarDate('bad')

		expect(date.year).toBe(2022)
		expect(date.month).toBe(1)
		expect(date.day).toBe(10)
	})

	it('parses yyyy-mm-dd', () => {
		const { parseCalendarDate } = useCalendarDate()
		const date = parseCalendarDate('2025-12-31')

		expect(date.year).toBe(2025)
		expect(date.month).toBe(12)
		expect(date.day).toBe(31)
	})
})
