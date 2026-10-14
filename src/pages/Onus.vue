<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  accessToken: {
    type: String,
    default: '',
  },
  user: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()

// Dados reativos do formulário
const mac = ref('')

// Formata enquanto digita: AA:BB:CC:DD:EE:FF
const formatMac = (event) => {
  const hex = event.target.value
    .replace(/[^a-fA-F0-9]/g, '') // só caracteres hexadecimais
    .toUpperCase()
    .slice(0, 12)

  const formatted = hex.match(/.{1,2}/g)?.join(':') ?? ''

  mac.value = formatted
  // Mantém o DOM em sincronia mesmo quando o valor do ref não muda
  // (ex.: o usuário digita uma letra inválida)
  event.target.value = formatted
}

// Só permite enviar com 12 caracteres hexadecimais
const isMacValid = computed(() => /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(mac.value))

const sendMac = async () => {
  if (!isMacValid.value) return

  try {
    const response = await fetch('http://127.0.0.1:8000/SUA-ROTA', { // <- ajuste a URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.accessToken}`,
      },
      body: JSON.stringify({ mac: mac.value }),
    })

    if (!response.ok) throw new Error('Erro na requisição')

    const result = await response.json()
    alert(`Sucesso! ID criado: ${result.id}`)

    mac.value = '' // Limpa o campo
  } catch (erro) {
    console.error(erro)
    alert('Erro ao enviar dados para o servidor.')
  }
}
</script>

<template>
  <section class="view">
    <div class="page-head">
      <h1>Desautorizar ONU</h1>
    </div>

    <form class="card manage" id="manage-form" @submit.prevent="sendMac">
      <label for="mac">Endereço MAC</label>

      <input
        class="mono"
        id="mac"
        placeholder="84:16:F9:2A:7C:01"
        maxlength="17"
        autocomplete="off"
        style="text-transform: uppercase;"
        oninput="this.value = this.value.toUpperCase()"
        spellcheck="false"
        autofocus
        required
        :value="mac"
        @input="formatMac"
      />

      <p class="small muted">Use 12 caracteres, separados por dois-pontos.</p>

      <p class="info">Ao aplicar, esta ONU perderá o acesso à rede.</p>

      <div class="manage-foot">
        <button class="btn btn-danger" type="submit">Desautorizar</button>
      </div>
    </form>

    <!--Protótipo de tabela de alterações recentes-->
    <div class="card recent">
      <div class="row-between">
        <h3>Últimas alterações</h3>
        <RouterLink
          class="link"
          :to="{ name: 'historico', params: { username: route.params.username } }"
        >Ver histórico →</RouterLink>
      </div>
      <div class="table-wrap">
        <table id="recent-table">
          <thead><tr><th>Endereço MAC</th><th>Ação aplicada</th><th>Operador</th><th>Data e hora</th></tr></thead>
          <tbody>
            <tr><td data-l="MAC" class="mono">A4:7B:9D:12:8E:03</td><td data-l="Ação">Desautorizar ONU</td><td data-l="Operador">Mariana Souza</td><td data-l="Data">Hoje, 10:38</td></tr>
            <tr><td data-l="MAC" class="mono">C0:25:E9:4B:61:08</td><td data-l="Ação">Desautorizar ONU</td><td data-l="Operador">Rafael Lima</td><td data-l="Data">Hoje, 10:21</td></tr>
            <tr><td data-l="MAC" class="mono">64:6E:EA:03:2D:15</td><td data-l="Ação">Desautorizar ONU</td><td data-l="Operador">Mariana Souza</td><td data-l="Data">Hoje, 09:54</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style>
  #mac {
    background-color: #f0f0f0;
  }
</style>