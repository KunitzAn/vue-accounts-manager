<template>
  <div class="account-row">
    <!-- Метки -->
    <input
      class="input labels"
      v-model="labelsInput"
      maxlength="50"
      placeholder="Метки (через ;)"
      @blur="onBlurLabels"
    />

    <!-- Тип записи -->
    <select class="input" v-model="typeLocal" @change="onChangeType">
      <option value="Локальная">Локальная</option>
      <option value="LDAP">LDAP</option>
    </select>

    <!-- Логин -->
    <input
      class="input"
      v-model="loginLocal"
      maxlength="100"
      placeholder="Логин"
      @blur="onBlurLogin"
    />

    <!-- Пароль (показывается только для Локальная) + копирование -->
    <div v-if="typeLocal === 'Локальная'" class="password-wrap">
      <input
        class="input"
        type="password"
        v-model="passwordLocal"
        maxlength="100"
        placeholder="Пароль"
        @blur="onBlurPassword"
      />
      <button
        class="copy-btn"
        type="button"
        @click="copyPassword"
        :disabled="!passwordLocal"
        title="Скопировать пароль"
      >
        📋
      </button>

      <span v-if="copied" class="copied-tip">Скопировано</span>
    </div>

    <!-- Удаление -->
    <button class="btn-delete" @click="remove">🗑</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Account } from '../types/account';
import { useAccountsStore } from '../store/accounts';

const props = defineProps<{ account: Account }>();
const store = useAccountsStore();

const labelsInput = ref<string>(props.account.labels.map(l => l.text).join('; '));
const typeLocal = ref(props.account.type);
const loginLocal = ref(props.account.login);
const passwordLocal = ref(props.account.password ?? '');

const copied = ref(false);

// Синхронизируемся, если стор обновит аккаунт извне
watch(() => props.account, (newA) => {
  labelsInput.value = newA.labels.map(l => l.text).join('; ');
  typeLocal.value = newA.type;
  loginLocal.value = newA.login;
  passwordLocal.value = newA.password ?? '';
}, { deep: true });

// Метки — при blur парсим на массив объектов { text: '...' }
function onBlurLabels() {
  labelsInput.value = labelsInput.value.slice(0, 50);
  const parsed = labelsInput.value
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);
  const labels = parsed.map(t => ({ text: t }));
  store.updateAccount(props.account.id, { labels });
}

// Изменение типа — при выборе LDAP пароль становится null
function onChangeType() {
  const newType = typeLocal.value as Account['type'];
  store.updateAccount(props.account.id, {
    type: newType,
    password: newType === 'LDAP' ? null : (passwordLocal.value ?? '')
  });
}

// Логин / пароль сохраняем на blur
function onBlurLogin() {
  loginLocal.value = loginLocal.value.slice(0, 100);
  store.updateAccount(props.account.id, { login: loginLocal.value });
}

function onBlurPassword() {
  passwordLocal.value = passwordLocal.value.slice(0, 100);
  store.updateAccount(props.account.id, { password: passwordLocal.value });
}

// Удаление
function remove() {
  store.removeAccount(props.account.id);
}

// Копирование пароля в буфер
function copyPassword() {
  const text = passwordLocal.value || props.account.password || '';
  if (!text) return;
  navigator.clipboard.writeText(text)
    .then(() => {
      copied.value = true;
      setTimeout(() => (copied.value = false), 1500);
    })
    .catch(() => {
      // на старых браузерах просто ничего, можно показать alert
      alert('Не удалось скопировать в буфер обмена');
    });
}
</script>

<style scoped>
.account-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 40px; gap: 8px; align-items: center; }
.input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; width: 100%; box-sizing: border-box; }
.password-wrap { display: flex; gap: 8px; align-items: center; }
.copy-btn { border: none; background: #f1f5f9; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
.copy-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.copied-tip { font-size: 12px; color: #22c55e; margin-left: 6px; }
.btn-delete { background: none; border: none; cursor: pointer; font-size: 18px; }
</style>
