import type { ClsPmApi } from '../utils/clsPmApi/api'

import { createHttpClient } from '../utils/clsPmApi/client'
import { createClsPmApi } from '../utils/clsPmApi/api'

export const useClsPmApi = (): ClsPmApi => {
	const tokenCookie = useCookie<string | null>('cls_pm_token', {
		sameSite: 'lax'
	})

	const client = createHttpClient({
		baseURL: '/api',
		getAccessToken: () => tokenCookie.value
	})

	return createClsPmApi(client)
}
