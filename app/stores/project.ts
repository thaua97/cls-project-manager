import { defineStore } from 'pinia'
import { initialState } from './project/state'
import { projectGetters } from './project/getters'
import { projectActions } from './project/actions'

export const useProjectStore = defineStore('project', {
	state: initialState,
	getters: projectGetters,
	actions: projectActions
})
