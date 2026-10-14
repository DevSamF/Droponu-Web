import { computed, ref } from 'vue'
import api from '../api'

// Estado em nível de módulo: compartilhado por todos que importarem o composable
const me = ref(null)
const loading = ref(false)
const error = ref(null)
let pending = null

async function fetchMe() {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get(import.meta.env.VITE_ME_URL ?? '/auth/me')
    me.value = data
    return data
  } catch (err) {
    // 401 já foi tratado pelo interceptor (refresh + redirect para login)
    error.value = err
    return null
  } finally {
    loading.value = false
    pending = null
  }
}

export function useCurrentUser() {
  // Reaproveita dado em cache ou requisição em andamento
  function load({ force = false } = {}) {
    if (me.value && !force) return Promise.resolve(me.value)
    if (!pending) pending = fetchMe()
    return pending
  }

  // Chamar no logout (e em qualquer clearAuthSession) para não vazar o usuário anterior
  function clear() {
    me.value = null
    error.value = null
    pending = null
  }

  const username = computed(() => me.value?.username ?? me.value?.email ?? '')
  const email = computed(() => me.value?.email ?? '')
  const role = computed(() => me.value?.role ?? '')

  const initials = computed(() => {
    const name = username.value.trim()
    if (!name) return '?'
    if (name.includes('@')) return name.slice(0, 2).toUpperCase()
    const parts = name.split(/[\s._-]+/).filter(Boolean)
    const letters = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '')
    return letters.toUpperCase() || '?'
  })

  return { me, username, email, role, initials, loading, error, load, clear }
}