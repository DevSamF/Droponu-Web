<script setup>
import { ref } from 'vue'

const historico = ref([
  { mac: 'A4:7B:9D:12:8E:03', acao: 'Desautorizar ONU', operador: 'Mariana Souza', data: 'Hoje, 10:38' },
  { mac: 'C0:25:E9:4B:61:08', acao: 'Desautorizar ONU', operador: 'Rafael Lima', data: 'Hoje, 10:21' },
  { mac: '64:6E:EA:03:2D:15', acao: 'Desautorizar ONU', operador: 'Mariana Souza', data: 'Hoje, 09:54' },
  { mac: 'F8:4D:FC:70:19:AA', acao: 'Desautorizar ONU', operador: 'Rafael Lima', data: 'Ontem, 17:12' },
  { mac: '2C:3A:FD:55:0B:9E', acao: 'Desautorizar ONU', operador: 'Mariana Souza', data: 'Ontem, 15:40' },
])
</script>

<template>
  <section class="view">
    <div class="page-head"><div><h1>Histórico</h1></div></div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Endereço MAC</th><th>Ação aplicada</th><th>Operador</th><th>Data e hora</th></tr></thead>
          <tbody id="history-body">
            <tr v-for="item in historico" :key="item.mac">
              <td data-l="MAC" class="mono">{{ item.mac }}</td>
              <td data-l="Ação">{{ item.acao }}</td>
              <td data-l="Operador">{{ item.operador }}</td>
              <td data-l="Data">{{ item.data }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>