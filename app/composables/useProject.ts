import { useProjectStore } from '@/stores/project'
import type {
	CreateProjectInput,
	UpdateProjectInput
} from '#shared/types/project'
import dayjs from 'dayjs'

export const useProject = () => {
	const store = useProjectStore()
	const toast = useToast()
	

	const createProject = async (
		input: CreateProjectInput,
		backgroundFile?: File | null
	) => {
		try {
			const project = await store.createProject(input)
		
			if (project) {
				if (backgroundFile) {
					await store.uploadBackground(project.id, backgroundFile)
				}
				await navigateTo('/')
				toast.add({ 
					title: 'Projeto criado com sucesso',
					description: `O projeto ${project.name} para o cliente ${project.client} foi definido para o periodo de ${dayjs(project.startDate).format('DD/MM/YYYY')} a ${dayjs(project.endDate).format('DD/MM/YYYY')}.`,
					icon: 'i-lucide-calendar-days'
				})
				return { success: true, project }
			}
	
		} catch (e: unknown) {
			toast.add({ 
				title: 'Erro ao criar projeto',
				description: (e as Error).message,
				color: 'error',
				icon: 'i-lucide-calendar-days'
			})
			return { success: false, error: store.error }
		}
	}

	const updateProject = async (
		input: UpdateProjectInput,
		backgroundFile?: File | null
	) => {
		try {
			const success = await store.updateProject(input)
		
			if (success) {
				if (backgroundFile) {
					await store.uploadBackground(input.id, backgroundFile)
				}
				await navigateTo('/')
				toast.add({ 
					title: 'Projeto atualizado com sucesso',
					description: `O projeto ${input.name} para o cliente ${input.client} foi definido para o periodo de ${dayjs(input.startDate).format('DD/MM/YYYY')} a ${dayjs(input.endDate).format('DD/MM/YYYY')}.`,
					icon: 'i-lucide-calendar-days'
				})
				return { success: true }
			}
		} catch (e: unknown) {
			toast.add({ 
				title: 'Erro ao atualizar projeto',
				description: (e as Error).message,
				color: 'error',
				icon: 'i-lucide-calendar-days'
			})
			return { success: false, error: store.error }
		}
		
	}

	const deleteProject = async (id: string) => {
		try {
			const success = await store.deleteProject(id)
		
			if (success) {
				toast.add({
					title: 'Projeto Removido',
					description: 'O projeto foi removido com sucesso.',
					icon: 'i-lucide-trash'
				})
				return { success: true }
			}
			
		} catch (e: unknown) {
			toast.add({
				title: 'Erro ao remover projeto',
				description: (e as Error)?.message,
				color: 'error',
				icon: 'i-lucide-calendar-days'
			})
			return { success: false, error: store.error }
		}
		
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
