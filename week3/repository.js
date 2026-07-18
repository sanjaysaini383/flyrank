const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function listTasks() {
  const res = await pool.query('SELECT id, title, done FROM tasks ORDER BY id');
  return res.rows;
}

async function getTask(id) {
  const res = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
  return res.rows[0] || null;
}

async function createTask(title) {
  const res = await pool.query('INSERT INTO tasks(title, done) VALUES($1, false) RETURNING id, title, done', [title]);
  return res.rows[0];
}

async function updateTask(id, { title, done }) {
  // Build dynamic query depending on provided fields
  const sets = [];
  const values = [];
  let idx = 1;
  if (typeof title !== 'undefined') {
    sets.push(`title = $${idx++}`);
    values.push(title);
  }
  if (typeof done !== 'undefined') {
    sets.push(`done = $${idx++}`);
    values.push(done);
  }
  if (sets.length === 0) return null;
  values.push(id);
  const sql = `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, title, done`;
  const res = await pool.query(sql, values);
  return res.rows[0] || null;
}

async function deleteTask(id) {
  const res = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
