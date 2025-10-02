<template>
  <div class="accounts-form">
    <div class="header">
      <h2>Учётные записи</h2>
      <div class="header-controls">
        <input
          v-model="search"
          class="search-input"
          type="text"
          placeholder="Поиск по логину или метке..."
        />
        <button class="btn-add" @click="add">➕</button>
      </div>
    </div>

    <p class="hint">Для указания нескольких меток используйте разделитель <strong>;</strong></p>

    <div class="table-headers">
      <div>Метки</div>
      <div>Тип записи</div>
      <div>Логин</div>
      <div>Пароль</div>
      <div></div>
    </div>

    <div class="rows">
      <AccountItem
        v-for="acc in filteredAccounts"
        :key="acc.id"
        :account="acc"
      />
      <div v-if="filteredAccounts.length === 0" class="empty">Нет записей</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AccountItem from './AccountItem.vue';
import { useAccountsStore } from '../store/accounts';

const store = useAccountsStore();
const search = ref('');

function add() {
  store.addAccount();
}

const filteredAccounts = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return store.accounts;
  return store.accounts.filter(acc => {
    const loginMatch = acc.login?.toLowerCase().includes(q);
    const labelMatch = acc.labels?.some(l => l.text.toLowerCase().includes(q));
    return !!loginMatch || !!labelMatch;
  });
});
</script>

<style scoped>
.accounts-form { max-width: 1000px; margin: 0 auto; padding: 16px; background: #fff; border-radius: 8px; box-shadow: 0 6px 18px rgba(10,10,10,0.04); }
.header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.header-controls { display:flex; align-items:center; gap:8px; }
.btn-add { width:36px; height:36px; border-radius:6px; background:#2f80ed; color:white; border:none; font-size:20px; cursor:pointer; }
.hint { background:#eef6ff; padding:8px; border-radius:6px; color:#333; margin:8px 0; }
.table-headers { display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 40px; gap:8px; font-weight:600; color:#666; margin-top:8px; }
.rows { margin-top:8px; display:flex; flex-direction:column; gap:8px; }
.search-input { padding:6px 8px; border-radius:6px; border:1px solid #ddd; }
.empty { color:#666; padding:12px; text-align:center; }
</style>
