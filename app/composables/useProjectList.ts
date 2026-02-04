import { useProjectStore } from '@/stores/project'

export const useProjectList = () => {
	const store = useProjectStore()

	const projects = computed(() => store.filteredProjects)
	const projectCount = computed(() => store.projectCount)
	const totalProjectCount = computed(() => store.totalProjectCount)
	const favoriteProjects = computed(() => store.favoriteProjects)
	const isLoading = computed(() => store.isLoading)
	const error = computed(() => store.error)

	const fetchProjects = async () => {
		await store.fetchProjects()
	}

	const fetchProjectById = async (id: string) => {
		await store.fetchProjectById(id)
	}

	const getProjectById = (id: string) => {
		return store.getProjectById(id)
	}

	const clearError = () => {
		store.clearError()
	}

	return {
		projects,
		projectCount,
		totalProjectCount,
		favoriteProjects,
		isLoading,
		error,
		fetchProjects,
		fetchProjectById,
		getProjectById,
		clearError
	}
}
