<template>
  <div class="account-row">
    <div class="field">
      <input
        class="input labels"
        v-model="labelsInput"
        maxlength="50"
        placeholder="Метки (через ;)"
        @blur="onBlurLabels"
      />
    </div>

    <div class="field">
      <select class="input" v-model="typeLocal" @change="onChangeType">
        <option value="Локальная">Локальная</option>
        <option value="LDAP">LDAP</option>
      </select>
    </div>

    <div class="field">
      <input
        :class="['input', { invalid: currentErrors.login }]"
        v-model="loginLocal"
        maxlength="100"
        placeholder="Логин"
        @blur="onBlurLogin"
      />
      <span v-if="currentErrors.login" class="error-text">Логин обязателен и до 100 символов</span>
    </div>

    <div class="field password-wrap">
      <input
        v-if="typeLocal === 'Локальная'"
        :class="['input', { invalid: currentErrors.password }]"
        type="password"
        v-model="passwordLocal"
        maxlength="100"
        placeholder="Пароль"
        @blur="onBlurPassword"
      />
      <button
        v-if="typeLocal === 'Локальная'"
        class="copy-btn"
        type="button"
        @click="copyPassword"
        :disabled="!passwordLocal"
        title="Скопировать пароль"
      >
        📋
      </button>
      <span v-if="copied" class="copied-tip">Скопировано</span>
      <span v-if="typeLocal === 'Локальная' && currentErrors.password" class="error-text">Пароль обязателен и до 100 символов</span>
    </div>

    <div class="field actions">
      <button class="btn-delete" @click="remove">🗑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Account } from '../types/account';
import { useAccountsStore } from '../store/accounts';

const props = defineProps<{ account: Account }>();
const store = useAccountsStore();

const labelsInput = ref<string>(props.account.labels.map(l => l.text).join('; '));
const typeLocal = ref<Account['type']>(props.account.type);
const loginLocal = ref<string>(props.account.login);
const passwordLocal = ref<string>(props.account.password ?? '');

const copied = ref(false);
const currentErrors = computed(() => ({
  login: !!props.account.errors?.login,
  password: !!props.account.errors?.password
}));

watch(() => props.account, (newA) => {
  labelsInput.value = newA.labels.map(l => l.text).join('; ');
  typeLocal.value = newA.type;
  loginLocal.value = newA.login;
  passwordLocal.value = newA.password ?? '';
}, { deep: true });

function onBlurLabels() {
  labelsInput.value = labelsInput.value.slice(0, 50);
  const parsed = labelsInput.value.split(';').map(s => s.trim()).filter(Boolean);
  const labels = parsed.map(t => ({ text: t }));
  store.updateAccount(props.account.id, { labels });
}

function onChangeType() {
  const newType = typeLocal.value;
  store.updateAccount(props.account.id, { type: newType, password: newType === 'LDAP' ? null : (passwordLocal.value ?? '') });
}

function onBlurLogin() {
  loginLocal.value = loginLocal.value.slice(0, 100);
  store.updateAccount(props.account.id, { login: loginLocal.value });
}

function onBlurPassword() {
  passwordLocal.value = passwordLocal.value.slice(0, 100);
  store.updateAccount(props.account.id, { password: passwordLocal.value });
}

function remove() {
  store.removeAccount(props.account.id);
}

function copyPassword() {
  const text = passwordLocal.value || props.account.password || '';
  if (!text) return;
  navigator.clipboard.writeText(text)
    .then(() => {
      copied.value = true;
      setTimeout(() => (copied.value = false), 1500);
    })
    .catch(() => { alert('Не удалось скопировать'); });
}
</script>

<style scoped>
.account-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 40px; gap: 8px; align-items: start; }
.field { display: flex; flex-direction: column; }
.input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; width: 100%; box-sizing: border-box; }
.invalid { border-color: #ff4d4f; box-shadow: 0 0 0 3px rgba(255,77,79,0.06); }
.error-text { color: #ff4d4f; font-size: 12px; margin-top: 4px; }
.password-wrap { display: flex; gap: 8px; align-items: center; }
.copy-btn { border: none; background: #f1f5f9; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
.copied-tip { font-size: 12px; color: #22c55e; margin-left: 6px; }
.btn-delete { background: none; border: none; cursor: pointer; font-size: 18px; margin-top: 8px; }
.actions { display: flex; align-items: center; }

/* Responsive: под мобильные устройства делаем колонки вертикальными */
@media (max-width: 600px) {
  .account-row { grid-template-columns: 1fr; gap: 10px; }
  .password-wrap { flex-direction: row; align-items: center; }
  .btn-delete { justify-self: end; }
}
</style>
