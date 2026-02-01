import { CalendarDate } from '@internationalized/date'

export const useCalendarDate = () => {
	const defaultCalendarDate = () => new CalendarDate(2022, 1, 10)

	const parseCalendarDate = (value?: string): CalendarDate => {
		if (!value) {
			return defaultCalendarDate()
		}
		const [y, m, d] = value.split('-').map(Number)
		if (!y || !m || !d) {
			return defaultCalendarDate()
		}
		return new CalendarDate(y, m, d)
	}

	return {
		parseCalendarDate
	}
}
