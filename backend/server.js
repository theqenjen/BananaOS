import express from 'express';
import crypto from 'node:crypto';
import { db } from './db.js';

const app = express();
app.use(express.json());

const id = (prefix) => `${prefix}_${crypto.randomUUID()}`;
const now = () => Date.now();

app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ---------------------------------- contacts --------------------------------- */

app.get('/api/contacts', (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY name').all());
});

/* --------------------------------- messages --------------------------------- */

const REPLIES = [
  'Ha, fair enough.',
  'That actually makes sense. Go on.',
  'I am on the bus, will reply properly in a bit',
  'You are never going to believe what just happened',
  'Banana.',
  'Sending you a photo in a sec',
  'Sounds good to me 👍',
  'Can we do 7 instead of 6?',
  'Just seen this, sorry!',
  'Okay that is genuinely brilliant.',
  'Let me check and get back to you',
  'On my way, five minutes',
];

const threadRow = (tid) =>
  db
    .prepare(
      `SELECT t.id, t.unread, t.updated_at, c.id contact_id, c.name, c.number, c.color, c.tag
       FROM threads t JOIN contacts c ON c.id = t.contact_id WHERE t.id = ?`
    )
    .get(tid);

const threadSummary = (row) => {
  const last = db
    .prepare('SELECT body, created_at, sender FROM messages WHERE thread_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(row.id);
  return {
    id: row.id,
    unread: row.unread,
    updatedAt: row.updated_at,
    contact: { id: row.contact_id, name: row.name, number: row.number, color: row.color, tag: row.tag },
    lastMessage: last ? last.body : '',
    lastSender: last ? last.sender : null,
    lastAt: last ? last.created_at : row.updated_at,
  };
};

app.get('/api/threads', (req, res) => {
  const rows = db
    .prepare(
      `SELECT t.id, t.unread, t.updated_at, c.id contact_id, c.name, c.number, c.color, c.tag
       FROM threads t JOIN contacts c ON c.id = t.contact_id
       ORDER BY t.updated_at DESC`
    )
    .all();
  res.json(rows.map(threadSummary));
});

app.post('/api/threads', (req, res) => {
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.body.contactId);
  if (!contact) return res.status(404).json({ error: 'Unknown contact' });
  const existing = db.prepare('SELECT id FROM threads WHERE contact_id = ?').get(contact.id);
  if (existing) return res.json(threadSummary(threadRow(existing.id)));
  const tid = id('t');
  db.prepare('INSERT INTO threads (id,contact_id,updated_at,unread) VALUES (?,?,?,0)').run(tid, contact.id, now());
  res.status(201).json(threadSummary(threadRow(tid)));
});

app.get('/api/threads/:id/messages', (req, res) => {
  if (!threadRow(req.params.id)) return res.status(404).json({ error: 'Unknown thread' });
  res.json(db.prepare('SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at ASC').all(req.params.id));
});

app.post('/api/threads/:id/messages', (req, res) => {
  const row = threadRow(req.params.id);
  const body = String(req.body.body || '').trim();
  if (!row) return res.status(404).json({ error: 'Unknown thread' });
  if (!body) return res.status(400).json({ error: 'Empty message' });

  const ts = now();
  const message = { id: id('m'), thread_id: row.id, sender: 'me', body, created_at: ts };
  db.prepare('INSERT INTO messages (id,thread_id,sender,body,created_at) VALUES (@id,@thread_id,@sender,@body,@created_at)').run(message);

  let reply = null;
  if (row.contact_id !== 'c_delivery') {
    const replyBody = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    reply = { id: id('m'), thread_id: row.id, sender: 'them', body: replyBody, created_at: ts + 1 };
    db.prepare('INSERT INTO messages (id,thread_id,sender,body,created_at) VALUES (@id,@thread_id,@sender,@body,@created_at)').run(reply);
    db.prepare('UPDATE threads SET updated_at = ?, unread = 0 WHERE id = ?').run(ts + 1, row.id);
  } else {
    db.prepare('UPDATE threads SET updated_at = ? WHERE id = ?').run(ts, row.id);
  }

  res.status(201).json({ message, reply });
});

app.post('/api/threads/:id/read', (req, res) => {
  db.prepare('UPDATE threads SET unread = 0 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ----------------------------------- calls ---------------------------------- */

app.get('/api/calls', (req, res) => {
  res.json(db.prepare('SELECT * FROM calls ORDER BY created_at DESC LIMIT 60').all());
});

app.post('/api/calls', (req, res) => {
  const { name = 'Unknown', number = '', direction = 'outgoing', status = 'answered', duration = 0 } = req.body;
  const call = { id: id('call'), name, number, direction, status, duration: Number(duration) || 0, created_at: now() };
  db.prepare(
    'INSERT INTO calls (id,name,number,direction,status,duration,created_at) VALUES (@id,@name,@number,@direction,@status,@duration,@created_at)'
  ).run(call);
  res.status(201).json(call);
});

/* ----------------------------------- notes ---------------------------------- */

app.get('/api/notes', (req, res) => {
  res.json(db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all());
});

app.post('/api/notes', (req, res) => {
  const note = {
    id: id('n'),
    title: String(req.body.title || '').slice(0, 120),
    body: String(req.body.body || '').slice(0, 8000),
    updated_at: now(),
  };
  db.prepare('INSERT INTO notes (id,title,body,updated_at) VALUES (@id,@title,@body,@updated_at)').run(note);
  res.status(201).json(note);
});

app.patch('/api/notes/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Unknown note' });
  const next = {
    title: req.body.title === undefined ? existing.title : String(req.body.title).slice(0, 120),
    body: req.body.body === undefined ? existing.body : String(req.body.body).slice(0, 8000),
    updated_at: now(),
  };
  db.prepare('UPDATE notes SET title = ?, body = ?, updated_at = ? WHERE id = ?').run(next.title, next.body, next.updated_at, existing.id);
  res.json({ ...existing, ...next });
});

app.delete('/api/notes/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------------------------------- photos ---------------------------------- */

app.get('/api/photos', (req, res) => {
  res.json(db.prepare('SELECT * FROM photos ORDER BY created_at DESC').all());
});

/* --------------------------------- settings --------------------------------- */

const readSettings = () => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = {};
  for (const row of rows) {
    try {
      out[row.key] = JSON.parse(row.value);
    } catch {
      out[row.key] = row.value;
    }
  }
  return out;
};

app.get('/api/settings', (req, res) => res.json(readSettings()));

app.put('/api/settings', (req, res) => {
  const patch = req.body && typeof req.body === 'object' ? req.body : {};
  const statement = db.prepare(
    'INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );
  const allowed = ['theme', 'wallpaper', 'wifi', 'bluetooth', 'airplane', 'dnd', 'brightness', 'deviceName'];
  db.transaction(() => {
    for (const key of allowed) {
      if (key in patch) statement.run(key, JSON.stringify(patch[key]));
    }
  })();
  res.json(readSettings());
});

const PORT = Number(process.env.PORT || 8000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[bananaos] api listening on ${PORT}`);
});
