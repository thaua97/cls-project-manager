import { describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/stores/auth'
import { useClsPmApi } from '@/composables/useClsPmApi'

const { createHttpClientMock, createClsPmApiMock } = vi.hoisted(() => {
	return {
		createHttpClientMock: vi.fn(),
		createClsPmApiMock: vi.fn()
	}
})

vi.mock('../../../app/utils/clsPmApi/client', () => {
	return {
		createHttpClient: createHttpClientMock
	}
})

vi.mock('../../../app/utils/clsPmApi/api', () => {
	return {
		createClsPmApi: createClsPmApiMock
	}
})

describe('useClsPmApi', () => {
	it('creates http client with baseURL /api and access token from auth store', async () => {
		const auth = useAuthStore()
		auth.setToken('token-123')

		const apiInstance = { health: vi.fn() }
		createHttpClientMock.mockImplementation(
			(opts: {
				baseURL: string
				getAccessToken: () => string | null | undefined
			}) => {
				expect(opts.baseURL).toBe('/api')
				expect(opts.getAccessToken()).toBe('token-123')
				return { __client: true }
			}
		)
		createClsPmApiMock.mockReturnValue(apiInstance)

		const api = useClsPmApi()

		expect(createHttpClientMock).toHaveBeenCalledTimes(1)
		expect(createClsPmApiMock).toHaveBeenCalledTimes(1)
		expect(api).toBe(apiInstance)
	})
})
