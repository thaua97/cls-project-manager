import type { ClsPmApi } from '@/utils/clsPmApi/api'

import { createHttpClient } from '@/utils/clsPmApi/client'
import { createClsPmApi } from '@/utils/clsPmApi/api'
import { useAuthStore } from '@/stores/auth'

export const useClsPmApi = (): ClsPmApi => {
	const authStore = useAuthStore()

	const client = createHttpClient({
		baseURL: '/api',
		getAccessToken: () => authStore.token
	})

	return createClsPmApi(client)
}
