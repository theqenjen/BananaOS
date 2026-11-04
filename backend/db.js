import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(path.join(DATA_DIR, 'bananaos.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  color TEXT NOT NULL,
  tag TEXT
);

CREATE TABLE IF NOT EXISTS threads (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  updated_at INTEGER NOT NULL,
  unread INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS calls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  direction TEXT NOT NULL,
  status TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT,
  gradient TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const CONTACTS = [
  { id: 'c_mum', name: 'Mum', number: '+44 7700 900123', color: '#F2A65A', tag: 'Family' },
  { id: 'c_leo', name: 'Leo Park', number: '+44 7700 900456', color: '#4F8CF7', tag: 'Work' },
  { id: 'c_priya', name: 'Priya Shah', number: '+44 7700 900877', color: '#B07CF7', tag: 'Friends' },
  { id: 'c_sam', name: 'Sam Okafor', number: '+44 7700 900342', color: '#38B98A', tag: 'Friends' },
  { id: 'c_delivery', name: 'Courier', number: '+44 7700 900999', color: '#7E8CA0', tag: 'Services' },
  { id: 'c_support', name: 'Banana Support', number: '+44 7700 900001', color: '#FFD34E', tag: 'Services' },
];

const SEED_THREADS = [
  {
    id: 't_mum',
    contact: 'c_mum',
    minutesAgo: 26,
    unread: 1,
    messages: [
      ['them', 'Did you eat something proper today?', 4 * HOUR],
      ['me', 'Toast counts. I promise I will cook tonight.', 3.6 * HOUR],
      ['them', 'I am holding you to that. Come round Sunday?', 32 * MIN],
      ['them', 'Also your dad found the old photo album 🙂', 26 * MIN],
    ],
  },
  {
    id: 't_leo',
    contact: 'c_leo',
    minutesAgo: 96,
    messages: [
      ['them', 'Standup moved to 10:15 tomorrow', 2 * DAY],
      ['me', 'Noted, thanks for the heads up', 2 * DAY - 12 * MIN],
      ['them', 'Also the deck renders fine on mobile now', 96 * MIN],
    ],
  },
  {
    id: 't_priya',
    contact: 'c_priya',
    minutesAgo: 4 * 60,
    messages: [
      ['them', 'Are we still on for the climbing wall on Thursday?', 5 * HOUR],
      ['me', 'Yes! Booking it tonight', 4.5 * HOUR],
      ['them', 'Perfect. Bring the good chalk bag', 4 * HOUR],
    ],
  },
  {
    id: 't_sam',
    contact: 'c_sam',
    minutesAgo: 2 * 24 * 60,
    messages: [
      ['them', 'that playlist you sent is unreal', 2 * DAY + 20 * MIN],
    ],
  },
  {
    id: 't_delivery',
    contact: 'c_delivery',
    minutesAgo: 3 * 24 * 60,
    messages: [
      ['them', 'Your parcel is at the front desk. Reference BN-4471.', 3 * DAY],
    ],
  },
];

const PHOTOS = [
  { title: 'Peel Street at golden hour', location: 'London', gradient: 'linear-gradient(145deg,#FFB347,#FF6B6B 55%,#7A2E5D)' },
  { title: 'First light over the estuary', location: 'Whitstable', gradient: 'linear-gradient(160deg,#1E3C72,#2A5298 45%,#F7B733)' },
  { title: 'Sunday market', location: 'Borough', gradient: 'linear-gradient(150deg,#F7971E,#FFD200 70%,#FFEFBA)' },
  { title: 'Palm shade', location: 'Lisbon', gradient: 'linear-gradient(140deg,#0F2027,#2C5364 50%,#4CA1AF)' },
  { title: 'Fog on the hill', location: 'Peak District', gradient: 'linear-gradient(150deg,#3E5151,#7B8794 60%,#DECBA4)' },
  { title: 'Neon alley', location: 'Tokyo', gradient: 'linear-gradient(150deg,#1A0533,#7A1FA2 45%,#F72585)' },
  { title: 'Rooftop pool', location: 'Barcelona', gradient: 'linear-gradient(145deg,#00C9FF,#92FE9D)' },
  { title: 'Snow on the fence', location: 'Edinburgh', gradient: 'linear-gradient(150deg,#E0EAFC,#CFDEF3 60%,#8FA6C4)' },
  { title: 'Late train home', location: 'On the move', gradient: 'linear-gradient(150deg,#232526,#414345 55%,#F2B705)' },
  { title: 'Banana bread attempt #4', location: 'Kitchen', gradient: 'linear-gradient(150deg,#F2B705,#E08D3C 65%,#8C5E2A)' },
];

if (db.prepare('SELECT COUNT(*) n FROM contacts').get().n === 0) {
  const insertContact = db.prepare('INSERT INTO contacts (id,name,number,color,tag) VALUES (@id,@name,@number,@color,@tag)');
  const insertThread = db.prepare('INSERT INTO threads (id,contact_id,updated_at,unread) VALUES (?,?,?,?)');
  const insertMessage = db.prepare('INSERT INTO messages (id,thread_id,sender,body,created_at) VALUES (?,?,?,?,?)');

  db.transaction(() => {
    for (const c of CONTACTS) insertContact.run(c);
    let n = 0;
    for (const t of SEED_THREADS) {
      insertThread.run(t.id, t.contact, now - t.minutesAgo * MIN, t.unread || 0);
      for (const [sender, body, ago] of t.messages) {
        insertMessage.run(`m_seed_${++n}`, t.id, sender, body, Math.round(now - ago));
      }
    }
  })();
}

if (db.prepare('SELECT COUNT(*) n FROM photos').get().n === 0) {
  const insertPhoto = db.prepare('INSERT INTO photos (id,title,location,gradient,created_at) VALUES (?,?,?,?,?)');
  db.transaction(() => {
    PHOTOS.forEach((p, i) => insertPhoto.run(`p_${i + 1}`, p.title, p.location, p.gradient, now - i * 2 * DAY));
  })();
}

if (db.prepare('SELECT COUNT(*) n FROM notes').get().n === 0) {
  const insertNote = db.prepare('INSERT INTO notes (id,title,body,updated_at) VALUES (?,?,?,?)');
  insertNote.run('n_1', 'Groceries', 'Oat milk\nBananas (obviously)\nCoffee beans\nOlive oil', now - 5 * HOUR);
  insertNote.run('n_2', 'Ideas', 'Weekly banana facts newsletter?\nA phone that smells faintly of fruit.', now - 2 * DAY);
}

if (db.prepare('SELECT COUNT(*) n FROM calls').get().n === 0) {
  const insertCall = db.prepare('INSERT INTO calls (id,name,number,direction,status,duration,created_at) VALUES (?,?,?,?,?,?,?)');
  insertCall.run('call_1', 'Mum', '+44 7700 900123', 'incoming', 'answered', 428, now - 5 * HOUR);
  insertCall.run('call_2', 'Leo Park', '+44 7700 900456', 'outgoing', 'answered', 94, now - 22 * HOUR);
  insertCall.run('call_3', 'Courier', '+44 7700 900999', 'incoming', 'missed', 0, now - 2 * DAY);
  insertCall.run('call_4', 'Priya Shah', '+44 7700 900877', 'outgoing', 'answered', 1810, now - 3 * DAY);
}

const defaultSettings = {
  theme: 'dark',
  wallpaper: 'dusk',
  wifi: true,
  bluetooth: true,
  airplane: false,
  dnd: false,
  brightness: 88,
  deviceName: 'Banana Phone',
};

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)');
for (const [key, value] of Object.entries(defaultSettings)) {
  insertSetting.run(key, JSON.stringify(value));
}
