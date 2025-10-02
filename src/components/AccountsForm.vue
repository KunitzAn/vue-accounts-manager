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