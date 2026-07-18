require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const repo = require('./repository');

const app = express();
app.use(express.json());

function error(res, status, message) {
  return res.status(status).json({ error: message });
}

app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await repo.listTasks();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    error(res, 500, 'Internal error');
  }
});

app.get('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const task = await repo.getTask(id);
    if (!task) return error(res, 404, `Task ${id} not found`);
    res.json(task);
  } catch (err) {
    console.error(err);
    error(res, 500, 'Internal error');
  }
});

app.post('/tasks', async (req, res) => {
  const title = req.body && typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (!title) return error(res, 400, 'Title is required');
  try {
    const task = await repo.createTask(title);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    error(res, 500, 'Internal error');
  }
});

app.put('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
  const hasDone = Object.prototype.hasOwnProperty.call(body, 'done');
  if (!hasTitle && !hasDone) return error(res, 400, 'Request body is empty');
  if (hasTitle) {
    const t = typeof body.title === 'string' ? body.title.trim() : '';
    if (!t) return error(res, 400, 'Title is required');
    body.title = t;
  }
  try {
    const updated = await repo.updateTask(id, { title: body.title, done: body.done });
    if (!updated) return error(res, 404, `Task ${id} not found`);
    res.json(updated);
  } catch (err) {
    console.error(err);
    error(res, 500, 'Internal error');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const ok = await repo.deleteTask(id);
    if (!ok) return error(res, 404, `Task ${id} not found`);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    error(res, 500, 'Internal error');
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
