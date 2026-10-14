<script setup>
import { ref } from 'vue'
import EyeIcon from 'vue-material-design-icons/Eye.vue'
import EyeOffIcon from 'vue-material-design-icons/EyeOff.vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { setAuthSession } from '../auth'
import { getCurrentUserSlug } from '../userSlug'

const router = useRouter()

const password = ref('')
const email = ref('')
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)
const feedback = ref('')
const feedbackIsError = ref(false)
const authUrl = import.meta.env.VITE_AUTH_URL

async function submitLogin() {
  isSubmitting.value = true
  feedback.value = ''

  try {
    const response = await api.post(authUrl, {
      email: email.value,
      password: password.value,
    })

    const body = response.data?.data ?? response.data
    const token = body?.access_token
      ?? body?.accessToken
      ?? body?.token
      ?? body?.jwt
      ?? response.headers?.authorization?.replace(/^Bearer\s+/i, '')
      ?? response.headers?.['x-auth-token']

    if (!token) {
      throw new Error('A API autenticou, mas não retornou um token JWT.')
    }

    const refreshToken = body?.refresh_token
      ?? body?.refreshToken
      ?? null

    setAuthSession({
      accessToken: token,
      refreshToken,
      user: body?.user ?? body?.usuario ?? { email: email.value },
    })
    feedbackIsError.value = false
    password.value = ''
    await router.push({
      name: 'gerenciamento',
      params: { username: (await getCurrentUserSlug()) || 'usuario' },
    })
  } catch (error) {
    feedbackIsError.value = true
    feedback.value = error.response?.data?.message
      || error.message
      || 'Não foi possível entrar. Verifique suas credenciais e tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login" id="login" data-screen>
    <div class="brand brand--light">Allanet</div>

    <section class="login-card">
      <form class="login-form" id="login-form" @submit.prevent="submitLogin">
        <h2>Entrar</h2>

        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="operador@provedor.com.br"
          autocomplete="username"
          required
        >

        <label for="senha">Senha</label>
        <div class="pw">
          <input
            id="senha"
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Digite sua senha"
            autocomplete="current-password"
            required
          >
          <button
            type="button"
            class="icon-btn"
            :aria-label="isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'"
            :aria-pressed="isPasswordVisible"
            @click="isPasswordVisible = !isPasswordVisible"
          >
            <EyeOffIcon v-if="isPasswordVisible" :size="20" />
            <EyeIcon v-else :size="20" />
          </button>
        </div>

        <label class="check"><input type="checkbox" id="remember"> Lembrar de mim</label>

        <p v-if="feedback" class="login-feedback" :class="{ 'login-feedback--error': feedbackIsError }" role="status">
          {{ feedback }}
        </p>

        <button class="btn btn-primary btn-block" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <footer class="login-foot"><span>© 2026 Allanet</span></footer>
    </section>
  </main>
</template>

<style scoped>
.login-feedback {
  margin: 0 0 14px;
  color: var(--ok);
  font-size: 13px;
}

.login-feedback--error {
  color: var(--danger);
}

.btn:disabled {
  cursor: wait;
  opacity: .7;
}
</style>