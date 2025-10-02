<template>
  <div class="account-row">
    <!-- МЕТКИ: один инпут, вводятся через ';', maxlength 50 -->
    <input
      class="input labels"
      v-model="labelsInput"
      maxlength="50"
      placeholder="Метки (через ;)"
      @blur="onBlurLabels"
    />

    <!-- ТИП -->
    <select v-model="typeLocal" @change="onChangeType">
      <option value="Локальная">Локальная</option>
      <option value="LDAP">LDAP</option>
    </select>

    <!-- ЛОГИН -->
    <input
      :class="['input', { invalid: errors.login }]"
      v-model="loginLocal"
      maxlength="100"
      placeholder="Логин"
      @blur="onBlurLogin"
    />

    <!-- ПАРОЛЬ: показывается только если Локальная -->
    <input
      v-if="typeLocal === 'Локальная'"
      :class="['input', { invalid: errors.password }]"
      type="password"
      v-model="passwordLocal"
      maxlength="100"
      placeholder="Пароль"
      @blur="onBlurPassword"
    />

    <button class="btn-delete" @click="remove">🗑</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Account } from '../types/account'
import { useAccountsStore } from '../store/accounts'

const props = defineProps<{ account: Account }>()
const store = useAccountsStore()

const labelsInput = ref(props.account.labels.map(l => l.text).join('; '))
const typeLocal = ref(props.account.type)
const loginLocal = ref(props.account.login)
const passwordLocal = ref(props.account.password ?? '')
const errors = ref({ login: !!props.account.errors?.login, password: !!props.account.errors?.password })

watch(
  () => props.account,
  (newVal) => {
    labelsInput.value = newVal.labels.map(l => l.text).join('; ')
    typeLocal.value = newVal.type
    loginLocal.value = newVal.login
    passwordLocal.value = newVal.password ?? ''
    errors.value = { login: !!newVal.errors?.login, password: !!newVal.errors?.password }
  },
  { deep: true }
)

function onBlurLabels() {
  // гарантия длины 50 символов (input maxlength уже контролирует в UI)
  labelsInput.value = labelsInput.value.slice(0, 50)
  const parsed = labelsInput.value.split(';').map(s => s.trim()).filter(Boolean)
  const labels = parsed.map(t => ({ text: t }))
  store.updateAccount(props.account.id, { labels })
  // Если валидация для labels нужна — добавь: store.validateAccount(props.account.id)
}

function onChangeType() {
  const newType = typeLocal.value
  store.updateAccount(props.account.id, { type: newType, password: newType === 'LDAP' ? null : (props.account.password ?? '') })
  // Если нужно: store.validateAccount(props.account.id)
}

function onBlurLogin() {
  loginLocal.value = loginLocal.value.slice(0, 100)
  store.updateAccount(props.account.id, { login: loginLocal.value })
  store.validateAccount(props.account.id)  // Явный вызов валидации для login
}

function onBlurPassword() {
  passwordLocal.value = passwordLocal.value.slice(0, 100)
  store.updateAccount(props.account.id, { password: passwordLocal.value })
  store.validateAccount(props.account.id)  // Явный вызов валидации для password
}

function remove() {
  store.removeAccount(props.account.id)
}
</script>