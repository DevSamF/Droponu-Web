import axios from 'axios'
import { ref } from 'vue'

const STORAGE_KEY = 'droponu.auth'
const refreshUrl = import.meta.env.VITE_REFRESH_URL

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSession(session) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
  }
}

export const authSession = ref(loadSession())

export function setAuthSession(session) {
  authSession.value = session
  persistSession(session)
}

export function clearAuthSession() {
  authSession.value = null
  persistSession(null)
}

let refreshPromise = null

export function refreshSession() {
  if (!refreshPromise) {
    const refreshToken = authSession.value?.refreshToken

    if (!refreshToken) {
      return Promise.reject(new Error('Sessão sem refresh token.'))
    }

    refreshPromise = axios
      .post(refreshUrl, { refresh_token: refreshToken })
      .then((response) => {
        const body = response.data?.data ?? response.data
        const accessToken = body?.access_token
          ?? body?.accessToken
          ?? body?.token
          ?? body?.jwt

        if (!accessToken) {
          throw new Error('A API não retornou um novo access token.')
        }

        if (!authSession.value) {
          throw new Error('Sessão encerrada durante o refresh.')
        }

        setAuthSession({
          ...authSession.value,
          accessToken,
          refreshToken: body?.refresh_token ?? body?.refreshToken ?? refreshToken,
        })
        return accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}
