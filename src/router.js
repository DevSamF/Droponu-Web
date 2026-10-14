import { createRouter, createWebHistory } from 'vue-router'
import { authSession } from './auth'
import { getCurrentUserSlug } from './userSlug'
import Management from './pages/Management.vue'
import Onus from './pages/Onus.vue'
import History from './pages/History.vue'
import Config from './pages/Config.vue'
import Login from './pages/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/gerenciamento/:username',
      component: Management,
      props: () => ({
        user: authSession.value?.user,
      }),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'gerenciamento',
          component: Onus,
          props: () => ({
            accessToken: authSession.value?.accessToken,
            user: authSession.value?.user,
          }),
        },
        {
          path: 'historico',
          name: 'historico',
          component: History,
        },
        {
          path: 'config',
          name: 'config',
          component: Config,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'login' },
    },
  ],
})

router.beforeEach(async (to) => {
  const isLogged = !!authSession.value

  if (to.meta.requiresAuth && !isLogged) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isLogged) {
    const slug = await getCurrentUserSlug()
    return { name: 'gerenciamento', params: { username: slug ?? undefined } }
  }

  // Garante que a URL tenha sempre o nome do usuário conectado
  if (isLogged && to.params.username) {
    const slug = await getCurrentUserSlug()
    // Se o /auth/me falhar (slug null), segue sem redirecionar
    if (slug && to.params.username !== slug) {
      return {
        name: to.name || 'gerenciamento',
        params: { ...to.params, username: slug },
        query: to.query,
        hash: to.hash,
      }
    }
  }
})

export default router