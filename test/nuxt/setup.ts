import { beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref, type Ref } from 'vue'

type CookieRef<T> = { value: T }

type CookieJar = Record<string, CookieRef<unknown> | undefined>

type GlobalWithUseCookie = typeof globalThis & {
	useCookie?: <T>(name: string, opts?: unknown) => CookieRef<T>
}

const { cookieJar } = vi.hoisted(() => {
	return {
		cookieJar: {} as CookieJar
	}
})

const stateJar: Record<string, Ref<unknown> | undefined> = {}

mockNuxtImport('useState', () => {
	return <T>(key: string, init?: () => T): Ref<T> => {
		if (!stateJar[key]) {
			const initial = init ? init() : (undefined as T)
			stateJar[key] = ref(initial) as Ref<unknown>
		}
		return stateJar[key] as Ref<T>
	}
})

mockNuxtImport('useCookie', () => {
	return <T>(name: string, _opts?: unknown): CookieRef<T> => {
		if (!cookieJar[name]) {
			cookieJar[name] = { value: null }
		}
		return cookieJar[name] as CookieRef<T>
	}
})

;(globalThis as GlobalWithUseCookie).useCookie = <T>(
	name: string,
	_opts?: unknown
): CookieRef<T> => {
	if (!cookieJar[name]) {
		cookieJar[name] = { value: null }
	}
	return cookieJar[name] as CookieRef<T>
}

beforeEach(() => {
	setActivePinia(createPinia())
	vi.restoreAllMocks()
	for (const key of Object.keys(cookieJar)) {
		cookieJar[key] = undefined
	}
	for (const key of Object.keys(stateJar)) {
		stateJar[key] = undefined
	}
	if (typeof localStorage !== 'undefined') {
		localStorage.clear()
	}
})
