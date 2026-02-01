import axios, { type AxiosInstance } from 'axios'

export interface CreateHttpClientOptions {
	baseURL: string
	getAccessToken?: () => string | null | undefined
}

export const createHttpClient = (
	options: CreateHttpClientOptions
): AxiosInstance => {
	const client = axios.create({
		baseURL: options.baseURL,
		headers: {
			Accept: 'application/json'
		}
	})

	client.interceptors.request.use((config) => {
		const token = options.getAccessToken?.()
		if (token) {
			config.headers = config.headers ?? {}
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	})

	return client
}
