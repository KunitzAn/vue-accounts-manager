<template>
  <div class="accounts-form">
    <div class="header">
      <h2>Учётные записи</h2>
      <button class="btn-add" @click="add">+</button>
    </div>

    <p class="hint">Для указания нескольких меток для одной пары логин/пароль используйте разделитель <strong>;</strong></p>

    <div class="table-headers">
      <div>Метки</div>
      <div>Тип записи</div>
      <div>Логин</div>
      <div>Пароль</div>
      <div></div>
    </div>

    <div class="rows">
      <AccountItem
        v-for="acc in store.accounts"
        :key="acc.id"
        :account="acc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountItem from './AccountItem.vue'
import { useAccountsStore } from '../store/accounts'

const store = useAccountsStore()
function add() { store.addAccount() }
</script>

<style scoped>
.header { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.btn-add { width:36px; height:36px; border-radius:6px; background:#2f80ed; color:white; border:none; font-size:20px; cursor:pointer; }
.hint { background:#eef6ff; padding:8px; border-radius:6px; color:#333; margin:8px 0; }
.table-headers { display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 40px; gap:8px; font-weight:600; color:#666; margin-top:8px; }
.rows { margin-top:8px; display:flex; flex-direction:column; gap:8px; }
</style>