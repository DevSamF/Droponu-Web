import { useCurrentUser } from './composables/useCurrentUser'

// "Maria Clara" -> "maria-clara"
export function toUserSlug(name = '') {
  return (
    String(name)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'usuario'
  )
}

// Slug do usuário conectado (busca /auth/me se ainda não estiver em cache).
// Retorna null se não for possível obter o usuário.
export async function getCurrentUserSlug() {
  const { load, username } = useCurrentUser()
  await load()

  // O composable usa o e-mail como fallback: pega só a parte antes do @
  const name = username.value.split('@')[0]
  return name ? toUserSlug(name) : null
}