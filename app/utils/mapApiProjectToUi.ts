import type { ApiProject } from '@/utils/clsPmApi/types'

import { ProjectStatus, type Project } from '#shared/types/project'

export const mapApiProjectToUi = (project: ApiProject): Project => {
	return {
		id: project.id,
		name: project.name,
		client: project.client ?? '',
		backgroundUrl: project.backgroundUrl ?? undefined,
		startDate: project.startDate,
		endDate: project.endDate,
		userId: project.userId,
		status: ProjectStatus.NOT_STARTED,
		isFavorite: project.isFavorite,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	}
}
