# MICROSERVICES-ROADMAP: Переход на микросервисную архитектуру

Цель: разделить монолитный `server/` на независимые сервисы с API Gateway перед реализацией Фазы 2 (Admin-режим EduCRM). Каждый сервис — отдельный Node.js-процесс, Dockerfile, порт и схема БД.

Статус-легенда: ⬜ не начато · 🔶 в процессе · ✅ готово

---

## Итоговая архитектура

```
client (React, port 3000)
        │  VITE_API_URL=http://localhost:4000
        ▼
┌─────────────────────────┐
│   API Gateway (nginx)   │  port 4000  ← единственная точка входа для клиента
└──────┬──────────────────┘
       │ маршрутизация по префиксу пути
       ├─ /api/auth/*         → auth-service      :4001
       ├─ /api/users/*        → user-service      :4002
       ├─ /api/courses/*      → course-service    :4003
       ├─ /api/tasks/*        → task-service      :4004
       ├─ /api/groups/*       → group-service     :4005
       ├─ /api/study-teams/*  → study-team-service:4006
       ├─ /api/files/*        → file-service      :4007
       ├─ /uploads/*          → file-service      :4007
       └─ /api/teams/*        → team-service      :4008

       Каждый сервис ↔ PostgreSQL (общий инстанс, отдельная схема)
```

Клиент (`VITE_API_URL`) не меняется — по-прежнему обращается к порту 4000.

---

## Ключевые архитектурные решения

| Решение | Выбор | Обоснование |
|---------|-------|-------------|
| API Gateway | nginx | Простой, надёжный, минимум кода |
| JWT | Shared secret (`JWT_SECRET`) | Каждый сервис валидирует токен самостоятельно — без вызова auth-service на каждый запрос |
| Межсервисная связь | Синхронный REST | Достаточно для текущего масштаба; RabbitMQ/Kafka — в будущем если понадобится |
| База данных | 1 PostgreSQL, отдельные схемы | Логическое разделение без сложности управления N БД |
| Монорепозиторий | Да (`services/` + `packages/`) | Проще рефакторинг, единый CI, общие типы |
| Миграция | Поэтапная (strangler fig) | Монолит продолжает работать пока сервисы выделяются по одному |

---

## Итоговая структура каталогов

```
Ecosystem React/
├── client/                        ← без изменений
├── server/                        ← монолит (постепенно опустошается)
│
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── config/            (env.ts, database.ts)
│   │   │   ├── middleware/        (auth.ts, errorHandler.ts)
│   │   │   └── modules/auth/     (auth.router.ts, auth.service.ts)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── user-service/              ← аналогичная структура
│   ├── course-service/
│   ├── task-service/
│   ├── group-service/
│   ├── study-team-service/
│   ├── file-service/
│   └── team-service/
│
├── packages/
│   └── shared/                    ← переиспользуемый код между сервисами
│       ├── src/
│       │   ├── middleware/
│       │   │   ├── auth.ts        (requireAuth, requireRole — общий)
│       │   │   └── errorHandler.ts
│       │   ├── types/
│       │   │   └── jwt.ts         (JwtPayload interface)
│       │   └── db/
│       │       └── client.ts      (query, queryOne — шаблон)
│       └── package.json
│
├── gateway/
│   └── nginx.conf                 ← конфиг API Gateway
│
├── docker-compose.yml             ← обновлённый (все сервисы)
└── MICROSERVICES-ROADMAP.md
```

---

## Распределение маршрутов и схем БД

| Сервис | Маршруты | Схема PostgreSQL | Таблицы |
|--------|----------|-----------------|---------|
| auth-service | `/api/auth/*` | `auth` | `users`, `refresh_tokens` |
| user-service | `/api/users/*` | `users` | (читает `auth.users` + `study_teams.study_team_members`) |
| course-service | `/api/courses/*` | `courses` | `courses`, `lessons`, `course_enrollments`, `lesson_completions` |
| task-service | `/api/tasks/*` | `tasks` | `tasks` |
| group-service | `/api/groups/*` | `groups` | `groups`, `group_members` |
| study-team-service | `/api/study-teams/*` | `study_teams` | `study_teams`, `study_team_members`, `study_team_tasks` |
| file-service | `/api/files/*`, `/uploads/*` | `files` | `files` |
| team-service | `/api/teams/*` | `teams` | `teams`, `team_members`, `team_tasks`, `team_task_assignments`, `team_files` |

> Примечание по FK: сервисы хранят `user_id` как `UUID`, но **без FK-ограничений** на `auth.users` (cross-schema FK не рекомендуются в микросервисах). Целостность — на уровне бизнес-логики.

---

## Фаза 0. Общий пакет `packages/shared` ⬜

Цель: вынести переиспользуемый код чтобы не копировать его в каждый сервис.

**Что создать:**

```
packages/shared/
├── src/
│   ├── middleware/
│   │   ├── auth.ts          ← копия server/src/middleware/auth.ts (requireAuth, requireRole)
│   │   └── errorHandler.ts  ← копия server/src/middleware/errorHandler.ts
│   ├── types/
│   │   └── jwt.ts           ← interface JwtPayload { userId, role }
│   └── db/
│       └── client.ts        ← шаблон query/queryOne (каждый сервис подставляет свой Pool)
└── package.json
```

**`packages/shared/package.json`:**
```json
{
  "name": "@ecosystem/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "express": "^4.18.0"
  }
}
```

**Подключение в сервисах:**
```json
// services/auth-service/package.json
"dependencies": {
  "@ecosystem/shared": "file:../../packages/shared"
}
```

**Задачи:**
- ⬜ Создать `packages/shared/` с `auth.ts`, `errorHandler.ts`, `jwt.ts`
- ⬜ Проверить что `server/` всё ещё работает (изменений в нём пока нет)

---

## Фаза 1. API Gateway — nginx ⬜

Цель: добавить nginx как единую точку входа. Монолит пока продолжает работать на порту 4000 (временно переносим на 4009).

**`gateway/nginx.conf`:**
```nginx
upstream auth_service     { server auth-service:4001; }
upstream user_service     { server user-service:4002; }
upstream course_service   { server course-service:4003; }
upstream task_service     { server task-service:4004; }
upstream group_service    { server group-service:4005; }
upstream study_team_svc   { server study-team-service:4006; }
upstream file_service     { server file-service:4007; }
upstream team_service     { server team-service:4008; }
# временный fallback на монолит во время миграции
upstream monolith         { server server:4009; }

server {
  listen 4000;

  location /api/auth/        { proxy_pass http://auth_service; }
  location /api/users/       { proxy_pass http://user_service; }
  location /api/courses/     { proxy_pass http://course_service; }
  location /api/tasks/       { proxy_pass http://task_service; }
  location /api/groups/      { proxy_pass http://group_service; }
  location /api/study-teams/ { proxy_pass http://study_team_svc; }
  location /api/files/       { proxy_pass http://file_service; }
  location /uploads/         { proxy_pass http://file_service; }
  location /api/teams/       { proxy_pass http://team_service; }

  # всё остальное — в монолит (пока идёт миграция)
  location /                 { proxy_pass http://monolith; }

  proxy_set_header Host              $host;
  proxy_set_header X-Real-IP         $remote_addr;
  proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
  proxy_set_header Authorization     $http_authorization;
  proxy_pass_header  Authorization;
}
```

**Обновлённый `docker-compose.yml` (скелет):**
```yaml
services:
  db:
    image: postgres:16-alpine
    # ... (без изменений)

  gateway:
    image: nginx:alpine
    ports:
      - "4000:4000"
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - server   # монолит (временно)

  server:                            # монолит — переезжает на 4009
    build: ./server
    environment:
      PORT: 4009
    ports:
      - "4009:4009"
    # ... остальное без изменений

  client:
    # VITE_API_URL: http://localhost:4000 — без изменений
    # ...
```

**Задачи:**
- ⬜ Создать `gateway/nginx.conf` с маршрутами
- ⬜ Добавить `gateway` сервис в `docker-compose.yml`
- ⬜ Перевести монолит с порта 4000 на 4009
- ⬜ Проверить: клиент всё ещё работает через gateway → монолит

---

## Фаза 2. Auth Service ⬜

Первый сервис для выделения — auth содержит минимум зависимостей.

**Что перенести из `server/src/`:**
- `modules/auth/auth.router.ts` → `services/auth-service/src/modules/auth/auth.router.ts`
- `modules/auth/auth.service.ts` → `services/auth-service/src/modules/auth/auth.service.ts`
- `config/database.ts` → `services/auth-service/src/config/database.ts`
- `config/env.ts` → `services/auth-service/src/config/env.ts`

**Минимальный `services/auth-service/src/index.ts`:**
```ts
import "./config/env";
import express from "express";
import cors from "cors";
import { errorHandler } from "@ecosystem/shared/middleware/errorHandler";
import authRouter from "./modules/auth/auth.router";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req, res) => res.json({ service: "auth", status: "ok" }));
app.use("/api/auth", authRouter);
app.use(errorHandler);

app.listen(4001, () => console.log("auth-service :4001"));
```

**`services/auth-service/Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "ts-node", "src/index.ts"]
```

**Добавить в `docker-compose.yml`:**
```yaml
  auth-service:
    build: ./services/auth-service
    environment:
      PORT: 4001
      DB_HOST: db
      DB_SCHEMA: auth          # сервис использует схему auth в PostgreSQL
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "4001:4001"
```

**В nginx.conf маршрут `/api/auth/` уже настроен** (Фаза 1).

**Задачи:**
- ⬜ Создать `services/auth-service/` со структурой выше
- ⬜ Убрать `modules/auth/` из `server/src/index.ts`
- ⬜ Обновить `docker-compose.yml`
- ⬜ Протестировать: логин, регистрация, `/api/auth/me`, `/api/auth/users/search`

---

## Фаза 3. User Service ⬜

**Что перенести:**
- `modules/users/users.router.ts`
- `modules/users/users.service.ts`

**Особенность**: `users.service.ts` читает из таблицы `users` (принадлежит auth-сервису) и `study_team_members`. Решение — user-service подключается к той же БД и тем же таблицам напрямую (допустимо пока схемы в одном PostgreSQL).

**Порт:** 4002  
**Схема:** `users` (только своя бизнес-логика профиля)  
**Таблицы, которые читает из чужих схем:** `auth.users` (bio, social_links), `study_teams.study_team_members`

**Задачи:**
- ⬜ Создать `services/user-service/`
- ⬜ Убрать `modules/users/` из монолита
- ⬜ Протестировать: `GET/PUT /api/users/me/profile`

---

## Фаза 4. Course Service + Task Service ⬜

Два независимых сервиса — можно делать параллельно.

### Course Service (порт 4003)

**Что перенести:**
- `modules/courses/courses.router.ts`
- `modules/courses/courses.service.ts`

**Схема:** `courses`  
**Таблицы:** `courses`, `lessons`, `course_enrollments`, `lesson_completions`

**Задачи:**
- ⬜ Создать `services/course-service/`
- ⬜ Убрать `modules/courses/` из монолита
- ⬜ Проверить: список курсов, запись, прохождение уроков, создание/редактирование (admin)

### Task Service (порт 4004)

**Что перенести:**
- `modules/tasks/tasks.router.ts`
- `modules/tasks/tasks.service.ts`

**Схема:** `tasks`  
**Таблицы:** `tasks`

**Задачи:**
- ⬜ Создать `services/task-service/`
- ⬜ Убрать `modules/tasks/` из монолита
- ⬜ Проверить: список задач, создание, обновление статуса

---

## Фаза 5. Group Service + Study-Team Service ⬜

### Group Service (порт 4005)

**Что перенести:**
- `modules/groups/groups.router.ts`
- `modules/groups/groups.service.ts`

**Схема:** `groups`  
**Таблицы:** `groups`, `group_members`

**Задачи:**
- ⬜ Создать `services/group-service/`
- ⬜ Убрать `modules/groups/` из монолита
- ⬜ Проверить: `GET /api/groups/my`, admin CRUD групп

### Study-Team Service (порт 4006)

**Что перенести:**
- `modules/study-teams/study-teams.router.ts`
- `modules/study-teams/study-teams.service.ts`

**Зависимость от group-service**: `study-teams.service.ts` проверяет, состоит ли пользователь в группе (запрос к `groups.group_members`). Решение: прямой SQL к таблице `group_members` (пока общий PostgreSQL).

**Схема:** `study_teams`  
**Таблицы:** `study_teams`, `study_team_members`, `study_team_tasks`

**Задачи:**
- ⬜ Создать `services/study-team-service/`
- ⬜ Убрать `modules/study-teams/` из монолита
- ⬜ Проверить: создание команды, добавление участников, задачи команды

---

## Фаза 6. File Service + Team Service ⬜

### File Service (порт 4007)

**Особенности**: обслуживает `/uploads/*` (статические файлы) + мультипарт-загрузку.

**Что перенести:**
- `modules/files/files.router.ts`
- `modules/files/files.service.ts`

**Том Docker**: `uploads` volume должен быть примонтирован к file-service.

**Схема:** `files`  
**Таблицы:** `files`

**`docker-compose.yml` для file-service:**
```yaml
  file-service:
    build: ./services/file-service
    environment:
      PORT: 4007
      UPLOAD_DIR: /app/uploads
    volumes:
      - uploads:/app/uploads   # тот же том что был у монолита
    depends_on:
      db:
        condition: service_healthy
```

**Задачи:**
- ⬜ Создать `services/file-service/`
- ⬜ Убрать `modules/files/` из монолита
- ⬜ Убедиться что `/uploads/*` маршрутизируется через gateway к file-service
- ⬜ Проверить: загрузка файла, создание папки, удаление

### Team Service (порт 4008) — TeamHub

**Что перенести:**
- `modules/teams/teams.router.ts`
- `modules/teams/teams.service.ts`

**Схема:** `teams`  
**Таблицы:** `teams`, `team_members`, `team_tasks`, `team_task_assignments`, `team_files`

**Задачи:**
- ⬜ Создать `services/team-service/`
- ⬜ Убрать `modules/teams/` из монолита
- ⬜ Проверить: TeamHub полностью

---

## Фаза 7. Разделение схем PostgreSQL ⬜

После того как все сервисы выделены, применяем PostgreSQL-схемы для явного разделения данных.

**Миграция 003 — создать схемы:**
```sql
-- server/src/db/migrations/003_schemas.sql
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS courses;
CREATE SCHEMA IF NOT EXISTS tasks;
CREATE SCHEMA IF NOT EXISTS groups;
CREATE SCHEMA IF NOT EXISTS study_teams;
CREATE SCHEMA IF NOT EXISTS files;
CREATE SCHEMA IF NOT EXISTS teams;
CREATE SCHEMA IF NOT EXISTS users_svc;

-- Переместить таблицы в нужные схемы
ALTER TABLE refresh_tokens     SET SCHEMA auth;
ALTER TABLE courses            SET SCHEMA courses;
ALTER TABLE lessons            SET SCHEMA courses;
ALTER TABLE course_enrollments SET SCHEMA courses;
ALTER TABLE lesson_completions SET SCHEMA courses;
ALTER TABLE tasks               SET SCHEMA tasks;
ALTER TABLE groups              SET SCHEMA groups;
ALTER TABLE group_members       SET SCHEMA groups;
ALTER TABLE study_teams         SET SCHEMA study_teams;
ALTER TABLE study_team_members  SET SCHEMA study_teams;
ALTER TABLE study_team_tasks    SET SCHEMA study_teams;
ALTER TABLE files               SET SCHEMA files;
ALTER TABLE teams               SET SCHEMA teams;
ALTER TABLE team_members        SET SCHEMA teams;
ALTER TABLE team_tasks          SET SCHEMA teams;
ALTER TABLE team_task_assignments SET SCHEMA teams;
-- users остаётся в public (используется всеми сервисами напрямую)
```

**Настройка `search_path` для каждого сервиса:**
```ts
// В database.ts каждого сервиса — указываем свою схему
pool = new Pool({
  ...connectionParams,
  options: `-c search_path=courses,public`,  // своя схема + public (users)
});
```

**Задачи:**
- ⬜ Написать `003_schemas.sql`
- ⬜ Обновить `database.ts` в каждом сервисе (свой `search_path`)
- ⬜ Проверить все сервисы после переноса схем
- ⬜ Убрать кросс-схемные зависимости там где возможно

---

## Фаза 8. Вывод монолита из эксплуатации ⬜

К этому моменту монолит (`server/`) должен быть пустым — все маршруты выделены.

**`server/src/index.ts` к концу миграции:**
```ts
// Остаётся только health-check (fallback в nginx)
app.get("/api/health", (_req, res) => res.json({ status: "monolith-retired" }));
```

**Задачи:**
- ⬜ Убедиться что `server/` не содержит бизнес-логики
- ⬜ Убрать `gateway/nginx.conf` → убрать fallback на monolith (строку `location / { proxy_pass http://monolith; }`)
- ⬜ Удалить `server/` или оставить как архив

---

## Финальный `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-educrm}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secret}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 5s
      timeout: 5s
      retries: 5

  gateway:
    image: nginx:alpine
    ports:
      - "4000:4000"
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - auth-service
      - user-service
      - course-service
      - task-service
      - group-service
      - study-team-service
      - file-service
      - team-service

  auth-service:
    build: ./services/auth-service
    environment:
      PORT: 4001
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  user-service:
    build: ./services/user-service
    environment:
      PORT: 4002
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  course-service:
    build: ./services/course-service
    environment:
      PORT: 4003
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  task-service:
    build: ./services/task-service
    environment:
      PORT: 4004
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  group-service:
    build: ./services/group-service
    environment:
      PORT: 4005
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  study-team-service:
    build: ./services/study-team-service
    environment:
      PORT: 4006
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  file-service:
    build: ./services/file-service
    environment:
      PORT: 4007
      DB_HOST: db
      UPLOAD_DIR: /app/uploads
    env_file: .env
    volumes:
      - uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy

  team-service:
    build: ./services/team-service
    environment:
      PORT: 4008
      DB_HOST: db
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  client:
    build: ./client
    environment:
      VITE_API_URL: http://localhost:4000
    ports:
      - "3000:3000"
    depends_on:
      - gateway

volumes:
  pgdata:
  uploads:
```

---

## Межсервисное взаимодействие (Phase 2 Admin Mode)

Admin-режим требует агрегации данных из нескольких сервисов. Решение: **внутренние admin-эндпоинты** в каждом сервисе, которые вызываются из admin-dashboard через gateway.

```
Admin Dashboard (client)
  │
  ├─ GET /api/auth/admin/users         → auth-service (список пользователей с ролями)
  ├─ GET /api/courses/admin/stats      → course-service (статистика по курсам)
  ├─ GET /api/tasks/admin/stats        → task-service (статистика по задачам)
  ├─ GET /api/groups/admin/all         → group-service (все группы + состав)
  └─ GET /api/files/admin/stats        → file-service (общий объём файлов)
```

Каждый такой эндпоинт защищён `requireRole("admin")`.  
Gateway маршрутизирует их так же как обычные запросы — без изменений в nginx.

---

## Порядок выполнения (рекомендуемый)

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
     │   │   │   │   │   │   │
     │   └───┘   └───┘   └───┘   Параллельно:
     │                            • 4: course + task
     │                            • 5: group + study-team
     └── Монолит продолжает работать до конца Фазы 6
         (fallback в nginx.conf)
```

**Общее время**: ~3–5 сессий разработки (Фаза 0–1 быстро, каждый сервис в Фазах 2–6 ~1–2 часа).

После завершения Фазы 6 (все сервисы выделены) — переходить к EduCRM Phase 2 Admin Mode.

---

## Зависимости между сервисами (известные)

| Сервис | Читает данные из | Решение |
|--------|-----------------|---------|
| user-service | `auth.users` (bio, social_links) | Прямой SQL — одна БД |
| study-team-service | `groups.group_members` | Прямой SQL — одна БД |
| file-service | `auth.users` (uploadedBy) | Хранит только `user_id` |
| team-service | `auth.users` (memberId) | Хранит только `user_id` |

Все зависимости — read-only к чужим таблицам. Полная изоляция по схемам (Фаза 7) это не ломает, так как `search_path` каждого сервиса включает `public`.
