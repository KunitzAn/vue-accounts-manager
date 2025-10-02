# Vue Accounts Manager

## Описание проекта

Тестовое задание для позиции Vue Frontend Developer. Реализована форма управления учетными записями с использованием Vue 3, Composition API, TypeScript и Pinia для управления состоянием. Данные сохраняются в localStorage, чтобы сохраняться при обновлении страницы.

## Стек технологий
- **Vue.js 3** с Composition API
- **TypeScript**
- **Pinia** (стейт-менеджер с persistence в localStorage)
- **Vite** (build-tool)
- **CSS** (scoped стили + глобальные)

## Установка и запуск

1. Клонируйте репозиторий:
   ```
   git clone https://github.com/your-username/vue-accounts-manager.git
   cd vue-accounts-manager
   ```

2. Установите зависимости:
   ```
   npm install
   ```

3. Запустите проект в режиме разработки:
   ```
   npm run dev
   ```
   - Откройте http://localhost:5173 в браузере.

4. Для продакшена:
   ```
   npm run build
   ```

## Функциональность

- **Добавление записи**: Нажмите "+" — новая пустая запись добавится в конец списка.
- **Редактирование**: Вводите данные в поля. Метки через ";" (преобразуются в массив). Для LDAP пароль скрывается и сбрасывается в null.
- **Валидация**: 
  - Логин: не может быть пустым.
  - Пароль: обязателен для "Локальная", не может быть пустым.
  - По blur/change: проверка, сохранение в store, красная обводка при ошибке.
- **Удаление**: Кнопка 🗑 удаляет запись.
- **Сохранение**: Все данные в Pinia, с автосохранением в localStorage. При перезагрузке — восстановление.

### Пример использования
1. Добавьте запись (+).
2. Выберите "Локальная", введите логин/пароль.
3. Попробуйте оставить логин пустым — увидите красную рамку.
4. Добавьте метки: "work;personal" → [{ text: "work" }, { text: "personal" }].

## Структура проекта

```
vue-accounts-manager/
├── src/
│   ├── components/
│   │   ├── AccountsForm.vue      # Основная форма: заголовок, hint, таблица
│   │   └── AccountItem.vue       # Элемент записи: поля, валидация, удаление
│   ├── store/
│   │   └── accounts.ts           # Pinia store: accounts, add/update/remove, validate, localStorage
│   ├── types/
│   │   └── account.ts            # Interfaces: Account, Label, Errors
│   ├── App.vue                   # Корневой компонент (рендерит AccountsForm)
│   └── main.ts                   # Входная точка, импорт Pinia и стилей
├── style.css                     # Глобальные стили (опционально)
├── package.json                  # Зависимости (vue, pinia, typescript)
└── README.md                     # Этот файл
```
