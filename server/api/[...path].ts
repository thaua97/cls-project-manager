export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const apiBaseUrl = config.public.apiBaseUrl

	const { path = '' } = getRouterParams(event)
	const url = getRequestURL(event)

	const targetBase = apiBaseUrl.replace(/\/$/, '')
	const targetPath = String(path).replace(/^\//, '')
	const targetUrl = `${targetBase}/${targetPath}${url.search}`

	const method = getMethod(event)

	const isPublicAuthRoute =
		method === 'POST' &&
		(/auth\/login/.test(targetPath) || /^users$/.test(targetPath))

	const incomingHeaders = getHeaders(event)
	const headers: Record<string, string> = {}
	for (const [key, value] of Object.entries(incomingHeaders)) {
		if (!value) {
			continue
		}
		const lower = key.toLowerCase()
		if (
			lower === 'host' ||
			lower === 'connection' ||
			lower === 'content-length' ||
			lower === 'accept-encoding'
		) {
			continue
		}
		if (isPublicAuthRoute && lower === 'authorization') {
			continue
		}
		headers[key] = Array.isArray(value) ? value.join(',') : String(value)
	}

	if (!isPublicAuthRoute) {
		const existingAuthorization =
			headers.authorization ?? headers.Authorization ?? headers.AUTHORIZATION

		const hasValidBearer =
			typeof existingAuthorization === 'string' &&
			/^Bearer\s+\S+/.test(existingAuthorization)

		if (!hasValidBearer) {
			const cookies = parseCookies(event)
			let rawToken = cookies.cls_pm_token
			const cookieHeader = getHeader(event, 'cookie')
			if (cookieHeader) {
				const matches = Array.from(
					cookieHeader.matchAll(/(?:^|;\s*)cls_pm_token=([^;]+)/g)
				)
				const last = matches.at(-1)
				if (last?.[1]) {
					rawToken = last[1]
				}
			}
			if (rawToken && rawToken !== 'null' && rawToken !== 'undefined') {
				let token = rawToken
				try {
					token = decodeURIComponent(rawToken)
				} catch {
					// keep raw
				}

				headers.authorization = `Bearer ${token}`
				delete (headers as Record<string, unknown>).Authorization
				delete (headers as Record<string, unknown>).AUTHORIZATION
			}
		}
	}

	let body: Record<string, unknown> | BodyInit | null | undefined
	if (method !== 'GET' && method !== 'HEAD') {
		const contentType = getHeader(event, 'content-type') || ''
		if (contentType.includes('application/json')) {
			body = await readBody<Record<string, unknown> | null>(event)
		} else {
			body = await readRawBody(event)
		}
	}

	const response = await $fetch(targetUrl, {
		method,
		headers,
		body,
		responseType: 'json'
	})

	return response
})
