import type { CommandPaletteGroup } from '@nuxt/ui'
import type { Project } from '#shared/types/project'

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

export const useProjectSearch = () => {
	const store = useProjectStore()
	const api = useProjectsApi()

	const open = ref(false)
	const searchTerm = ref('')
	const loading = ref(false)
	const projects = ref<Project[]>([])
	const queryToken = ref(0)
	const suppressNextClearSearch = ref(false)

	const hydrateHistory = () => {
		store.hydrateSearchHistory()
	}

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

	const fetchByQuery = async (term: string, token: number) => {
		loading.value = true
		try {
			const result = await api.listProjects({ query: term })
			if (!result.success) {
				if (queryToken.value === token) {
					projects.value = []
				}
				return
			}

			if (queryToken.value === token) {
				projects.value = result.projects as unknown as Project[]
			}
		} finally {
			if (queryToken.value === token) {
				loading.value = false
			}
		}
	}

	const fetchByQueryDebounced = useDebounceFn(fetchByQuery, 300)

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
		removeHistoryItem
	}
}
