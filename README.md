# EduCRM + TeamHub

Full-stack SPA: React 18 + Vite + TypeScript (фронтенд), Node.js + Express + TypeScript (бэкенд), PostgreSQL 16 (база данных), Docker Compose.
Проект представлен по адресу: https://educrm-client.onrender.com/

---

## Быстрый старт (Docker — рекомендуется)

### Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 24+
- Git

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd react-pirksp
```

### 2. Создать `.env`

```bash
cp .env.example .env
```

Откройте `.env` и задайте надёжный `JWT_SECRET` (минимум 32 символа). Остальные значения работают по умолчанию.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educrm
DB_USER=postgres
DB_PASSWORD=secret

JWT_SECRET=замените_это_на_32_и_более_случайных_символа
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
UPLOAD_DIR=./uploads
PORT=4000
```

### 3. Собрать и запустить

```bash
docker compose up --build
```

Команда выполнит:
1. Запуск PostgreSQL 16
2. Сборку и запуск API-сервера на **порту 4000** (миграции и seed-данные применяются автоматически при каждом старте, повторный запуск безопасен)
3. Сборку и запуск React-клиента на **порту 3000**

### 4. Открыть приложение

- **Фронтенд:** http://localhost:3000
- **API:** http://localhost:4000
- **Проверка работоспособности:** http://localhost:4000/api/health

### 5. Зарегистрировать аккаунт

Нажмите «Регистрация» на главной странице. Первый зарегистрированный пользователь получает роль `user`. Чтобы создать пользователя с ролью `admin` — подключитесь к БД и обновите роль вручную (см. ниже).

---

## Запуск без Docker (локальная разработка)

### Требования

- Node.js 20+
- PostgreSQL 16 (запущен локально)
- npm

### 1. Создать базу данных

```bash
psql -U postgres
CREATE DATABASE educrm;
\q
```

### 2. Настроить окружение

```bash
cp .env.example .env
# Отредактируйте .env: задайте DB_HOST=localhost, DB_PASSWORD=<ваш пароль pg>, JWT_SECRET=<32+ символа>
```

### 3. Применить миграции БД

```bash
cd server
npm install
npm run migrate
```

### 4. Запустить бэкенд

```bash
# находясь в server/
npm run dev
# API доступен по адресу http://localhost:4000
```

### 5. Запустить фронтенд

```bash
cd ../client
npm install
npm run dev
# Фронтенд по адресу http://localhost:3000
```

---

## Тестовые данные

При старте контейнера seed-скрипт автоматически наполняет базу демо-данными. Готовые аккаунты для входа:

| Email | Пароль | Роль (система) | Роль в TeamHub |
|-------|--------|----------------|----------------|
| `admin@example.com` | `Admin123!` | admin | — |
| `alice@example.com` | `User123!` | user | Team Leader (Frontend Dev) |
| `bob@example.com` | `User123!` | user | Moderator (Frontend Dev), Member (Backend Dev) |
| `carol@example.com` | `User123!` | user | Member (Frontend Dev), Viewer (Backend Dev) |

Seed-данные включают: 2 команды, 3 проекта, 6 задач, 1 спецификация, 2 курса.

---

## Структура проекта

```
react-pirksp/
├── client/                   # React + Vite + TypeScript SPA
│   └── src/
│       ├── api/              # API-клиенты (auth, teams, courses, tasks)
│       ├── components/
│       │   ├── auth/         # Вход, Регистрация, Восстановление пароля
│       │   ├── dashboard/    # Представления студента EduCRM
│       │   ├── educrm-admin/ # Панель администратора EduCRM
│       │   ├── teamhub/      # TeamHub — оболочка и все 7 вкладок команды
│       │   ├── admin/        # Системный центр администрирования
│       │   └── ui/           # Компоненты shadcn/ui (не редактировать напрямую)
│       └── lib/              # Контексты: Theme, Language, User
│
├── server/                   # Node.js + Express + TypeScript API
│   └── src/
│       ├── config/           # Переменные окружения, пул соединений с БД
│       ├── db/
│       │   └── migrations/   # 001_init.sql — полная схема БД
│       ├── middleware/       # Аутентификация (JWT), обработчик ошибок
│       └── modules/
│           ├── auth/         # register, login, refresh, logout, me
│           ├── courses/      # CRUD + запись + уроки
│           ├── tasks/        # CRUD
│           ├── groups/       # CRUD
│           └── teams/        # команды, проекты, ТЗ, задачи, участники, файлы, роли
│
├── docker-compose.yml
├── .env.example
└── server/tests/fuzz/        # Скрипты для фаззинг-тестирования безопасности
```

---

## Обзор API

Все эндпоинты требуют заголовка `Authorization: Bearer <access_token>`, кроме auth-эндпоинтов.

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация аккаунта |
| POST | `/api/auth/login` | Вход → access + refresh токены |
| POST | `/api/auth/refresh` | Обновление токенов |
| POST | `/api/auth/logout` | Инвалидация refresh-токена |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/courses` | Список курсов с прогрессом |
| GET | `/api/tasks` | Список задач |
| GET/POST | `/api/teams` | Список / создание команд |
| GET | `/api/teams/:id` | Детали команды |
| GET/POST | `/api/teams/:id/projects` | Проекты |
| GET/POST | `/api/teams/:id/tasks` | Задачи (канбан) |
| GET/POST | `/api/teams/:id/specs` | Технические задания |
| GET/POST | `/api/teams/:id/members` | Участники |
| POST | `/api/teams/:id/files` | Загрузка файла (multipart) |
| GET | `/api/teams/:id/roles` | Пользовательские роли |

---

## Роли

**Системные роли** (хранятся в `users.role`):
- `user` — стандартный доступ
- `admin` — может создавать/удалять курсы, управлять группами

**Роли TeamHub** (хранятся в `team_members.role`):
- `Team Leader` — полное управление командой
- `Moderator` — управление контентом, не может удалить команду
- `Member` — чтение + создание задач и ТЗ
- `Viewer` — только чтение

---

## Фаззинг / тесты безопасности

```bash
# Сервер должен быть запущен на порту 4000
# Пользователь test@example.com должен быть зарегистрирован
cd server/tests/fuzz
bash runner.sh http://localhost:4000
```

Тесты проверяют: SQL-инъекции, некорректный JSON, слишком большой ввод, невалидные UUID, подделанный JWT, отсутствие аутентификации, IDOR, неверные HTTP-методы, быстрые повторные запросы.

---

## Полезные команды

```bash
# Просмотр логов сервера
docker compose logs -f server

# Подключение к базе данных
docker compose exec db psql -U postgres -d educrm

# Пересборка только сервера после изменений кода
docker compose build server && docker compose up -d server

# Остановить всё
docker compose down

# Остановить и очистить том с базой данных (полный сброс)
docker compose down -v
```

---

## Технологический стек

| Слой | Технологии |
|------|-----------|
| Фронтенд | React 18, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react |
| Бэкенд | Node.js 20, Express, TypeScript |
| База данных | PostgreSQL 16 |
| Аутентификация | JWT (access 15м + refresh 7д), bcryptjs cost=12 |
| Валидация | Zod |
| Загрузка файлов | multer (макс. 10 МБ) |
| Инфраструктура | Docker Compose |
