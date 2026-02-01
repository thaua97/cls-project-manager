interface ConfirmationDialogState {
	isOpen: boolean
	title: string
	description: string
	projectName: string
	onConfirm?: () => void
	onCancel?: () => void
}

const state = reactive<ConfirmationDialogState>({
	isOpen: false,
	title: 'Remover projeto',
	description: 'Essa ação removerá definitivamente o projeto:',
	projectName: '',
	onConfirm: undefined,
	onCancel: undefined
})

export const useConfirmationDialog = () => {
	const open = (options: {
		title?: string
		description?: string
		projectName: string
		onConfirm?: () => void
		onCancel?: () => void
	}) => {
		state.title = options.title || 'Remover projeto'
		state.description =
			options.description || 'Essa ação removerá definitivamente o projeto:'
		state.projectName = options.projectName
		state.onConfirm = options.onConfirm
		state.onCancel = options.onCancel
		state.isOpen = true
	}

	const close = () => {
		state.isOpen = false
	}

	const confirm = () => {
		if (state.onConfirm) {
			state.onConfirm()
		}
		close()
	}

	const cancel = () => {
		if (state.onCancel) {
			state.onCancel()
		}
		close()
	}

	return {
		state: readonly(state),
		open,
		close,
		confirm,
		cancel
	}
}
