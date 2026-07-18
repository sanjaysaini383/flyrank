CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO tasks (title, done) VALUES
  ('Buy milk', false),
  ('Walk the dog', true),
  ('Write code', false)
ON CONFLICT DO NOTHING;
