import { ProjectStatus, type CreateProjectInput, type Project } from '#shared/types/project'

import type { ProjectSort } from '@/utils/clsPmApi/types'

const guestStorageKey = 'cls_pm_guest_projects'

const toArray = (value: unknown): Project[] => {
	if (!Array.isArray(value)) {
		return []
	}
	return value.filter((x): x is Project => Boolean(x && typeof x === 'object'))
}

export const useGuestProjectsStorage = () => {
	const readAll = (): Project[] => {
		if (typeof window === 'undefined') {
			return []
		}
		try {
			const raw = localStorage.getItem(guestStorageKey)
			if (!raw) {
				return []
			}
			return toArray(JSON.parse(raw) as unknown)
		} catch {
			return []
		}
	}

	const writeAll = (projects: Project[]) => {
		if (typeof window === 'undefined') {
			return
		}
		try {
			localStorage.setItem(guestStorageKey, JSON.stringify(projects))
		} catch {
			return
		}
	}

	const sort = (projects: Project[], sortBy?: ProjectSort) => {
		const sorted = [...projects]
		switch (sortBy) {
		case 'name_asc':
			return sorted.sort((a, b) => a.name.localeCompare(b.name))
		case 'startDate_desc':
			return sorted.sort(
				(a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
			)
		case 'endDate_asc':
			return sorted.sort(
				(a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
			)
		default:
			return sorted
		}
	}

	const list = (params?: {
		favorites?: boolean
		sort?: ProjectSort
		query?: string
	}) => {
		let projects = readAll()

		if (params?.favorites !== undefined) {
			projects = projects.filter((p) => p.isFavorite === params.favorites)
		}

		if (params?.query && params.query.length >= 3) {
			const q = params.query.toLowerCase()
			projects = projects.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					(p.client?.toLowerCase().includes(q) ?? false)
			)
		}

		return sort(projects, params?.sort)
	}

	const getById = (id: string): Project | undefined => {
		return readAll().find((p) => p.id === id)
	}

	const create = (input: CreateProjectInput): Project => {
		const projects = readAll()
		const now = new Date().toISOString()
		const id =
			typeof window !== 'undefined' && typeof crypto?.randomUUID === 'function'
				? crypto.randomUUID()
				: `guest-${Math.random().toString(36).slice(2)}`

		const project: Project = {
			id,
			name: input.name,
			client: input.client,
			backgroundUrl: input.backgroundUrl,
			startDate: input.startDate,
			endDate: input.endDate,
			userId: 'guest',
			status: ProjectStatus.NOT_STARTED,
			isFavorite: false,
			createdAt: now,
			updatedAt: now
		}

		projects.push(project)
		writeAll(projects)
		return project
	}

	const update = (id: string, updates: Partial<Project>): Project | null => {
		const projects = readAll()
		const index = projects.findIndex((p) => p.id === id)
		if (index === -1) {
			return null
		}
		const current = projects[index]
		if (!current) {
			return null
		}
		const next: Project = {
			...current,
			...updates,
			updatedAt: new Date().toISOString()
		}
		projects[index] = next
		writeAll(projects)
		return next
	}

	const remove = (id: string) => {
		const projects = readAll()
		writeAll(projects.filter((p) => p.id !== id))
	}

	const toggleFavorite = (id: string): Project | null => {
		const project = getById(id)
		if (!project) {
			return null
		}
		return update(id, { isFavorite: !project.isFavorite })
	}

	return {
		list,
		getById,
		create,
		update,
		remove,
		toggleFavorite
	}
}
