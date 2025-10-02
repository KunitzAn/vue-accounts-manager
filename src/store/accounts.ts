import { defineStore } from 'pinia'
import type { Account } from '../types/account'

const STORAGE_KEY = 'vue-accounts-manager:accounts'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: (JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Account[])
  }),
  actions: {
    addAccount() {
      const acc: Account = {
        id: crypto.randomUUID(),
        labels: [],
        type: 'Локальная',
        login: '',
        password: '',
        isValid: false,
        errors: { login: false, password: false }
      }
      this.accounts.push(acc)
      this.save()
    },

    updateAccount(id: string, patch: Partial<Account>) {
      const idx = this.accounts.findIndex(a => a.id === id)
      if (idx === -1) return
      const updated = { ...this.accounts[idx], ...patch }

      // если тип LDAP — пароль хранится как null
      if (updated.type === 'LDAP') {
        updated.password = null
      } else if (updated.password === null) {
        // при переключении на локальную, если было null — приводим к ''
        updated.password = ''
      }

      this.accounts[idx] = updated
      this.validateAndSave(this.accounts[idx])
    },

    removeAccount(id: string) {
      this.accounts = this.accounts.filter(a => a.id !== id)
      this.save()
    },

    validateAccount(a: Account) {
      const loginValid = typeof a.login === 'string' && a.login.trim().length > 0 && a.login.length <= 100
      const passwordValid = a.type === 'LDAP' || (typeof a.password === 'string' && a.password.length > 0 && a.password.length <= 100)
      return {
        valid: loginValid && passwordValid,
        errors: {
          login: !loginValid,
          password: !passwordValid
        }
      }
    },

    validateAndSave(a: Account) {
      const res = this.validateAccount(a)
      a.isValid = res.valid
      a.errors = res.errors
      this.save()
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accounts))
    },

    load() {
      try {
        this.accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      } catch {
        this.accounts = []
      }
    }
  }
})
