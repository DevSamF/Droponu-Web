import axios from 'axios'
import { authSession, clearAuthSession, refreshSession } from './auth'
import router from './router'

const authUrls = [
  import.meta.env.VITE_AUTH_URL,
  import.meta.env.VITE_REFRESH_URL,
].filter(Boolean)

function isAuthRequest(config) {
  return authUrls.includes(config?.url)
}

const api = axios.create()

api.interceptors.request.use((config) => {
  const token = authSession.value?.accessToken
  if (token && !isAuthRequest(config)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original?._retried || isAuthRequest(original)) {
      return Promise.reject(error)
    }

    original._retried = true

    try {
      const token = await refreshSession()
      original.headers.Authorization = `Bearer ${token}`
      return api(original)
    } catch (refreshError) {
      clearAuthSession()
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' })
      }
      return Promise.reject(refreshError)
    }
  }
)

export default api
