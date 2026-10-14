<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearAuthSession } from '../auth.js'
import { useCurrentUser } from '../composables/useCurrentUser'
import SideBar from '../components/SideBar.vue'

defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
})

const router = useRouter()
const route = useRoute()
const { email: userEmail, clear: clearCurrentUser } = useCurrentUser()

const menuOpen = ref(false)

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

function logout() {
  clearCurrentUser()
  clearAuthSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app" :class="{ 'menu-open': menuOpen }">
    <div class="scrim" @click="menuOpen = false"></div>

    <SideBar @logout="logout" />

    <div class="main">
      <main class="content">
        <header class="row-between">
          <button
            class="menu-btn icon-btn"
            type="button"
            aria-label="Abrir menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = true"
          >
            <svg class="ico" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3,6h18v2H3zM3,11h18v2H3zM3,16h18v2H3z"/></svg>
          </button>
          <div>
            <div class="brand">Allanet</div>
            <p class="muted hide-sm">{{ userEmail || user.email || 'Usuário autenticado' }}</p>
          </div>
          <button class="btn btn-ghost" type="button" @click="logout">Sair</button>
        </header>

        <RouterView />
      </main>
    </div>
  </div>
</template>