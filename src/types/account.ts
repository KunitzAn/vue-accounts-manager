export type AccountType = 'Локальная' | 'LDAP';

export interface Label {
  text: string;
}

export interface Account {
  id: string;
  labels: Label[]; // [{text: '...'}, ...]
  type: AccountType;
  login: string;
  password: string | null;
  isValid?: boolean;
  errors?: { login?: boolean; password?: boolean };
}
