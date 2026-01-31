import { useProjectStore } from '../stores/project'
import type { CreateProjectInput, UpdateProjectInput } from '../../shared/types/project'

export const useProject = () => {
	const store = useProjectStore()
	const router = useRouter()

	const createProject = async (input: CreateProjectInput) => {
		const project = await store.createProject(input)
		
		if (project) {
			await router.push('/')
			return { success: true, project }
		}
		
		return { success: false, error: store.error }
	}

	const updateProject = async (input: UpdateProjectInput) => {
		const success = await store.updateProject(input)
		
		if (success) {
			await router.push('/')
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
