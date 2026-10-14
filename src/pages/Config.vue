<script setup>
import { ref, watch } from 'vue'

const olt = ref({
  ip: '10.0.0.1',
  porta: '23',
  usuario: 'admin',
  senha: '',
  equipamento: '',
})

const senhaVisivel = ref(false)
const feedback = ref('')
const feedbackIsError = ref(false)

// Recupera a configuração salva na sessão anterior, se houver
const savedRaw = localStorage.getItem('olt.config')
if (savedRaw) {
  try {
    olt.value = { ...olt.value, ...JSON.parse(savedRaw) }
  } catch {
  }
}

watch(olt, () => {
  feedback.value = ''
  feedbackIsError.value = false
}, { deep: true })

function salvar() {
  localStorage.setItem('olt.config', JSON.stringify(olt.value))
  feedbackIsError.value = false
  feedback.value = 'Credenciais salvas nesta sessão.'
}

function testarConexao() {
  if (!olt.value.ip || !olt.value.porta || !olt.value.usuario) {
    feedbackIsError.value = true
    feedback.value = 'Preencha IP, porta e usuário para testar.'
    return
  }
  feedback.value = 'Teste de conexão ainda não implementado.'
}
</script>

<template>
  <section class="view">
    <div class="page-head">
      <div><h1>Configurações</h1><p class="muted">Credenciais de acesso à OLT.</p></div>
    </div>
    <form class="card settings" id="config-form" @submit.prevent="salvar">
      <div class="field">
        <label for="olt-ip">Endereço IP</label>
        <input class="mono" id="olt-ip" v-model="olt.ip" placeholder="10.0.0.1" autocomplete="off">
      </div>

      <div class="field">
        <label for="olt-porta">Porta</label>
        <input class="mono" id="olt-porta" v-model="olt.porta" placeholder="23" autocomplete="off">
      </div>

      <div class="field">
        <label for="olt-usuario">Usuário</label>
        <input id="olt-usuario" v-model="olt.usuario" placeholder="admin" autocomplete="off">
      </div>

      <div class="field">
        <label for="olt-senha">Senha</label>
        <div class="pw">
          <input :type="senhaVisivel ? 'text' : 'password'" id="olt-senha" v-model="olt.senha" autocomplete="new-password">
          <button type="button" class="icon-btn" id="toggle-pw-olt" :aria-label="senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'" :aria-pressed="senhaVisivel" @click="senhaVisivel = !senhaVisivel">👁</button>
        </div>
      </div>

      <div class="field field--full">
        <label for="olt-equip">Equipamento</label>
        <input id="olt-equip" v-model="olt.equipamento" placeholder="Modelo do equipamento" autocomplete="off">
      </div>

      <p v-if="feedback" class="small settings-feedback" :class="{ error: feedbackIsError }" role="status">{{ feedback }}</p>

      <div class="settings-foot">
        <button class="btn btn-ghost" type="button" id="testar-olt" @click="testarConexao">Testar conexão</button>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </div>
      <p class="small muted">As credenciais ficam apenas nesta sessão do navegador.</p>
    </form>
  </section>
</template>

<style scoped>
.error {
  color: var(--danger);
}
</style>