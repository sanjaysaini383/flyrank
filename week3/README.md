# Task API — week1 (Express + Postgres + Docker)

Minimal Express implementation of the CRUD Task API with Postgres and Docker.

Requirements
- Docker & Docker Compose

Quick start (one command)

```bash
cd d:/projects/flyrank/week1
docker compose up --build
```

This starts Postgres (with a named volume for persistence) and the Node app. The app connects to the DB
using `DATABASE_URL` from the environment. See `.env.example`.

Then open:
- API root: http://localhost:3000/
- Health: http://localhost:3000/health
- Swagger UI (Try it out): http://localhost:3000/docs

Endpoints (unchanged from the in-memory version)
- GET / -> API info
- GET /health -> {"status":"ok"}
- GET /tasks -> list all tasks (200)
- GET /tasks/{id} -> single task (200) or 404 `{"error":"Task X not found"}`
- POST /tasks -> create task with body `{ "title": "..." }` (201) or 400 `{"error":"..."}`
- PUT /tasks/{id} -> update title and/or done (200) or 400/404 errors
- DELETE /tasks/{id} -> delete (204) or 404 `{"error":"..."}`

Persistence & proof
- The Postgres service uses a named volume `db_data` to persist `/var/lib/postgresql/data`.
- The DB is initialised with `db/init.sql` (creates `tasks` and seeds three rows).
- To prove persistence:
  1. `docker compose up --build` (or start the stack)
  2. Use curl or Swagger to create a new task.
  3. Stop the stack: `docker compose down` (note: this keeps the named volume by default).
  4. Start again: `docker compose up` and query `GET /tasks` — the created row remains.

Notes about architecture
- I replaced the in-memory store with a Postgres-backed repository in `repository.js`.
- **Service and route handlers in `index.js` did not change** beyond calling the repository functions — only the storage layer was swapped.
