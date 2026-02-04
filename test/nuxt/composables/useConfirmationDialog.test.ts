import { describe, expect, it, vi } from 'vitest'

import { useConfirmationDialog } from '@/composables/useConfirmationDialog'

describe('useConfirmationDialog', () => {
	it('opens with provided options and closes on confirm', () => {
		const dialog = useConfirmationDialog()
		const onConfirm = vi.fn()

		dialog.open({
			projectName: 'Alpha',
			onConfirm
		})

		expect(dialog.state.isOpen).toBe(true)
		expect(dialog.state.projectName).toBe('Alpha')

		dialog.confirm()

		expect(onConfirm).toHaveBeenCalledTimes(1)
		expect(dialog.state.isOpen).toBe(false)
	})

	it('calls onCancel and closes', () => {
		const dialog = useConfirmationDialog()
		const onCancel = vi.fn()

		dialog.open({
			projectName: 'Alpha',
			onCancel
		})

		dialog.cancel()

		expect(onCancel).toHaveBeenCalledTimes(1)
		expect(dialog.state.isOpen).toBe(false)
	})

	it('uses default title/description when not provided', () => {
		const dialog = useConfirmationDialog()
		dialog.open({ projectName: 'Alpha' })

		expect(dialog.state.title).toBe('Remover projeto')
		expect(dialog.state.description).toBe(
			'Essa ação removerá definitivamente o projeto:'
		)
	})
})
