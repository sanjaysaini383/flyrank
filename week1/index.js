const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Walk the dog', done: true },
  { id: 3, title: 'Write code', done: false }
];

function findIndex(id) {
  return tasks.findIndex(t => t.id === id);
}

// Error helper that returns { error: message }
function error(res, status, message) {
  return res.status(status).json({ error: message });
}

app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = findIndex(id);
  if (idx === -1) return error(res, 404, `Task ${id} not found`);
  res.json(tasks[idx]);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};
  const text = typeof title === 'string' ? title.trim() : '';
  if (!text) return error(res, 400, 'Title is required');
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task = { id: nextId, title: text, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = findIndex(id);
  if (idx === -1) return error(res, 404, `Task ${id} not found`);
  const body = req.body || {};
  const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
  const hasDone = Object.prototype.hasOwnProperty.call(body, 'done');
  if (!hasTitle && !hasDone) return error(res, 400, 'Request body is empty');
  if (hasTitle) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return error(res, 400, 'Title is required');
    tasks[idx].title = title;
  }
  if (hasDone) {
    tasks[idx].done = Boolean(body.done);
  }
  res.json(tasks[idx]);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = findIndex(id);
  if (idx === -1) return error(res, 404, `Task ${id} not found`);
  tasks.splice(idx, 1);
  res.status(204).send();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
