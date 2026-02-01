export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const apiBaseUrl = config.public.apiBaseUrl

	const { path = '' } = getRouterParams(event)
	const url = getRequestURL(event)

	const targetBase = apiBaseUrl.replace(/\/$/, '')
	const targetPath = String(path).replace(/^\//, '')
	const targetUrl = `${targetBase}/${targetPath}${url.search}`

	const method = getMethod(event)

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
		headers[key] = Array.isArray(value) ? value.join(',') : String(value)
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

	const response = await $fetch.raw(targetUrl, {
		method,
		headers,
		body
	})

	setResponseStatus(event, response.status)

	for (const [key, value] of response.headers.entries()) {
		const lower = key.toLowerCase()
		if (
			lower === 'content-encoding' ||
			lower === 'transfer-encoding' ||
			lower === 'connection'
		) {
			continue
		}
		setHeader(event, key, value)
	}

	return response._data
})
