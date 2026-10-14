<script setup>
import { onMounted } from 'vue'
import { useCurrentUser } from '../composables/useCurrentUser'

const emit = defineEmits(['logout'])

const { username, email, role, initials, loading, load, clear } = useCurrentUser()

onMounted(() => load())

function handleLogout() {
  clear()
  emit('logout')
}
</script>

<template>
  <div class="user" :title="email">
    <span class="avatar">{{ loading && !username ? '…' : initials }}</span>
    <div>
      <b>{{ username || 'Carregando…' }}</b>
    </div>
    <button class="icon-btn" type="button" aria-label="Sair" @click="handleLogout">⎋</button>
  </div>
</template>