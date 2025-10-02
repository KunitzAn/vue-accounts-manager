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

   git clone https://github.com/KunitzAn/vue-accounts-manager.git
   cd vue-accounts-manager


2. Установите зависимости:

   npm install


3. Запустите проект в режиме разработки:

   npm run dev

   - Откройте localhost в браузере.

4. Для продакшена:

   npm run build


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


## История коммитов

Проект разбит на логические коммиты для демонстрации этапов разработки (Conventional Commits):
- `chore: init vite project with vue3 + typescript template`
- `feat: add pinia store setup for accounts`
- `chore: setup pinia store and base project structure`
- `feat(types): add Account and Label interfaces`
- `feat(store): implement accounts store with localStorage persistence`
- `feat(components): add AccountsForm with header, hint and list`
- `feat(components): implement AccountItem basic fields and actions`
- `feat(validation): add field validation and error highlighting`
- `style: add basic styles for form and account items`

Полная история: `git log --oneline`.

## Возможные улучшения
- Добавить UI-фреймворк (например, Vuetify) для более polished вида.
- Расширенная валидация (email для логина, strength для пароля).
- Экспорт/импорт данных (JSON/CSV).
- Тесты (Vitest/Jest).

Если есть вопросы — пишите в issues! 😊