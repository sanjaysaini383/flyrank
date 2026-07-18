# Task API — week1


Minimal Express implementation of the CRUD Task API required by the assignment.

Requirements
- Node.js (14+) and npm

Install

```bash
cd d:/projects/flyrank/week1
npm install
```

Run

```bash
npm start
```

The server listens on port 3000 by default.

Then open:
- API root: http://localhost:3000/
- Health: http://localhost:3000/health
- Swagger UI (Try it out): http://localhost:3000/docs

Endpoints
- GET / -> API info
- GET /health -> {"status":"ok"}
- GET /tasks -> list all tasks (200)
- GET /tasks/{id} -> single task (200) or 404 `{"error":"Task X not found"}`
- POST /tasks -> create task with body `{ "title": "..." }` (201) or 400 `{"error":"..."}`
- PUT /tasks/{id} -> update title and/or done (200) or 400/404 errors
- DELETE /tasks/{id} -> delete (204) or 404 `{"error":"..."}`

Example curl

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```

Notes
- Data is stored in memory and will be lost when the server restarts.
- Error responses use the shape `{ "error": "message" }` to match the assignment.

