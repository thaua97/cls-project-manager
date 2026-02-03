import { useProjectStore } from '../stores/project'
import type {
	CreateProjectInput,
	UpdateProjectInput
} from '../../shared/types/project'

export const useProject = () => {
	const store = useProjectStore()

	const createProject = async (
		input: CreateProjectInput,
		backgroundFile?: File | null
	) => {
		const project = await store.createProject(input)
		
		if (project) {
			if (backgroundFile) {
				await store.uploadBackground(project.id, backgroundFile)
			}
			await navigateTo('/')
			return { success: true, project }
		}
		
		return { success: false, error: store.error }
	}

	const updateProject = async (
		input: UpdateProjectInput,
		backgroundFile?: File | null
	) => {
		const success = await store.updateProject(input)
		
		if (success) {
			if (backgroundFile) {
				await store.uploadBackground(input.id, backgroundFile)
			}
			await navigateTo('/')
			return { success: true }
		}
		
		return { success: false, error: store.error }
	}

	const deleteProject = async (id: string) => {
		const success = await store.deleteProject(id)
		
		if (success) {
			return { success: true }
		}
		
		return { success: false, error: store.error }
	}

	const toggleFavorite = async (id: string) => {
		const success = await store.toggleFavorite(id)
		
		if (!success) {
			return { success: false, error: store.error }
		}
		
		return { success: true }
	}

	return {
		createProject,
		updateProject,
		deleteProject,
		toggleFavorite
	}
}
