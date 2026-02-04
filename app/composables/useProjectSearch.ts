import type { CommandPaletteGroup } from '@nuxt/ui'
import type { Project } from '#shared/types/project'

import Fuse from 'fuse.js'

import { useProjectStore } from '../stores/project'

type ProjectSearchItem = {
	label: string
	suffix?: string
	value: string
	kind: 'project'
	projectId: string
}

type HistorySearchItem = {
	label: string
	value: string
	kind: 'history'
	term: string
	icon: string
	slot: 'history'
}

type SearchItem = ProjectSearchItem | HistorySearchItem

type HighlightPart = {
	text: string
	highlight: boolean
}

export const useProjectSearch = () => {
	const store = useProjectStore()

	const initialized = useState<boolean>('projectSearch:initialized', () => false)
	const open = useState<boolean>('projectSearch:open', () => false)
	const searchTerm = useState<string>('projectSearch:searchTerm', () => '')
	const loading = useState<boolean>('projectSearch:loading', () => false)
	const projects = useState<Project[]>('projectSearch:projects', () => [])
	const queryToken = useState<number>('projectSearch:queryToken', () => 0)
	const suppressNextClearSearch = useState<boolean>(
		'projectSearch:suppressNextClearSearch',
		() => false
	)

	const hydrateHistory = () => {
		store.hydrateSearchHistory()
	}

	if (typeof window !== 'undefined' && !initialized.value) {
		initialized.value = true

		watch(open, (isOpen, wasOpen) => {
			if (isOpen) {
				hydrateHistory()
				return
			}

			if (wasOpen) {
				const term = searchTerm.value.trim()
				store.addToSearchHistory(term)
			}
		})

		watch(searchTerm, (value, oldValue) => {
			const term = value.trim()
			const prevTerm = (oldValue || '').trim()
			if (term.length < 3) {
				queryToken.value++
				projects.value = []
				loading.value = false

				if (suppressNextClearSearch.value) {
					suppressNextClearSearch.value = false
					return
				}

				if (prevTerm.length >= 3) {
					store.clearSearch()
					void store.fetchProjects()
				}
				return
			}

			const nextToken = queryToken.value + 1
			queryToken.value = nextToken
			fetchByQueryDebounced(term, nextToken)
		})
	}

	const fetchByQuery = async (term: string, token: number) => {
		loading.value = true
		try {
			store.setSearch(term)
			await store.fetchProjects()
			if (queryToken.value === token) {
				projects.value = store.projects
			}
		} finally {
			if (queryToken.value === token) {
				loading.value = false
			}
		}
	}

	const fetchByQueryDebounced = useDebounceFn(fetchByQuery, 300)

	const fuseQuery = computed(() => searchTerm.value.trim())
	const fuse = computed(() => {
		return new Fuse(store.projects, {
			keys: ['name'],
			includeMatches: true,
			threshold: 0.35,
			ignoreLocation: true
		})
	})

	const matchIndicesByProjectId = computed(() => {
		const term = fuseQuery.value
		if (term.length < 3) {
			return new Map<string, Array<[number, number]>>()
		}

		const map = new Map<string, Array<[number, number]>>()
		for (const result of fuse.value.search(term)) {
			const indices: Array<[number, number]> = []
			for (const match of result.matches || []) {
				if (match.key !== 'name') {
					continue
				}
				for (const [start, end] of match.indices) {
					indices.push([start, end])
				}
			}
			map.set((result.item as Project).id, indices)
		}
		return map
	})

	const normalizeIndices = (indices: Array<[number, number]>) => {
		const sorted = [...indices]
			.filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end))
			.sort((a, b) => a[0] - b[0])
		const merged: Array<[number, number]> = []
		for (const [start, end] of sorted) {
			const prev = merged[merged.length - 1]
			if (!prev) {
				merged.push([start, end])
				continue
			}
			if (start <= prev[1] + 1) {
				prev[1] = Math.max(prev[1], end)
				continue
			}
			merged.push([start, end])
		}
		return merged
	}

	const buildHighlightParts = (
		text: string,
		indices: Array<[number, number]> | undefined
	): HighlightPart[] => {
		if (!indices?.length) {
			return [{ text, highlight: false }]
		}

		const normalized = normalizeIndices(indices)
		const parts: HighlightPart[] = []
		let cursor = 0
		for (const [start, end] of normalized) {
			if (start > cursor) {
				parts.push({ text: text.slice(cursor, start), highlight: false })
			}
			parts.push({ text: text.slice(start, end + 1), highlight: true })
			cursor = end + 1
		}
		if (cursor < text.length) {
			parts.push({ text: text.slice(cursor), highlight: false })
		}
		return parts.filter((p) => p.text.length)
	}

	const getProjectNameParts = (project: Project): HighlightPart[] => {
		const term = fuseQuery.value
		if (term.length < 3) {
			return []
		}

		const indices = matchIndicesByProjectId.value.get(project.id)
		if (!indices?.length) {
			return []
		}
		return buildHighlightParts(project.name, indices)
	}

	const historyItems = computed<HistorySearchItem[]>(() => {
		return store.searchHistory.map((term) => ({
			label: term,
			value: `history:${term}`,
			kind: 'history',
			term,
			icon: 'i-lucide-clock',
			slot: 'history'
		}))
	})

	const projectItems = computed<ProjectSearchItem[]>(() => {
		return projects.value.map((project) => ({
			label: project.name,
			suffix: project.client,
			value: project.id,
			kind: 'project',
			projectId: project.id
		}))
	})

	const groups = computed<CommandPaletteGroup<SearchItem>[]>(() => {
		const term = searchTerm.value.trim()

		const next: CommandPaletteGroup<SearchItem>[] = []

		if (term.length < 3 && historyItems.value.length) {
			next.push({
				id: 'history',
				label: 'Recentes',
				items: historyItems.value,
				ignoreFilter: true
			})
		}

		if (term.length >= 3) {
			next.push({
				id: 'results',
				label: 'Resultados',
				items: projectItems.value,
				ignoreFilter: true
			})
		}

		return next
	})

	const select = async (item: SearchItem | undefined) => {
		if (!item) {
			return
		}

		if (item.kind === 'project') {
			store.addToSearchHistory(item.label)
			store.setSearch(item.label)
			await store.fetchProjects()
			open.value = false
			suppressNextClearSearch.value = true
			return
		}

		if (item.kind === 'history') {
			searchTerm.value = item.term
		}
	}

	const removeHistoryItem = (term: string) => {
		store.removeSearchHistoryItem(term)
	}

	return {
		open,
		searchTerm,
		groups,
		loading,
		select,
		removeHistoryItem,
		getProjectNameParts
	}
}
