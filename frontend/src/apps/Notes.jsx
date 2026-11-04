import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Plus, Trash2, Search } from 'lucide-react';
import { api } from '../lib/api';

const stamp = (ts) =>
  new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState({ title: '', body: '' });
  const [status, setStatus] = useState('idle');
  const [query, setQuery] = useState('');
  const dirty = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    api.notes().then(setNotes).catch(() => {});
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!activeId || !dirty.current) return;
    setStatus('saving');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      api
        .updateNote(activeId, draft)
        .then((saved) => {
          setNotes((prev) => prev.map((note) => (note.id === saved.id ? saved : note)));
          setStatus('saved');
        })
        .catch(() => setStatus('error'));
    }, 600);
    return () => clearTimeout(timer.current);
  }, [draft, activeId]);

  const open = (note) => {
    dirty.current = false;
    setActiveId(note.id);
    setDraft({ title: note.title, body: note.body });
    setStatus('idle');
  };

  const edit = (patch) => {
    dirty.current = true;
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const create = async () => {
    try {
      const note = await api.createNote({ title: '', body: '' });
      setNotes((prev) => [note, ...prev]);
      open(note);
    } catch {
      /* ignore */
    }
  };

  const remove = async () => {
    if (!activeId) return;
    const id = activeId;
    setActiveId(null);
    setNotes((prev) => prev.filter((note) => note.id !== id));
    api.deleteNote(id).catch(() => {});
  };

  if (activeId) {
    return (
      <div className="notes-editor">
        <header className="notes-editor-head">
          <button type="button" className="nav-btn" onClick={() => setActiveId(null)} aria-label="Back to notes">
            <ChevronLeft size={18} />
          </button>
          <span className="notes-status">
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : status === 'error' ? 'Not saved' : 'Note'}
          </span>
          <button type="button" className="nav-btn" onClick={remove} aria-label="Delete note">
            <Trash2 size={16} />
          </button>
        </header>
        <input
          className="notes-title-input"
          value={draft.title}
          onChange={(event) => edit({ title: event.target.value })}
          placeholder="Title"
          aria-label="Note title"
        />
        <textarea
          className="notes-body-input"
          value={draft.body}
          onChange={(event) => edit({ body: event.target.value })}
          placeholder="Start writing…"
          aria-label="Note body"
        />
      </div>
    );
  }

  const visible = notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="notes">
      <header className="app-head">
        <div>
          <h1 className="app-head-title">Notes</h1>
          <p className="app-head-sub">{notes.length} notes · synced</p>
        </div>
        <button type="button" className="nav-btn is-accent" onClick={create} aria-label="New note">
          <Plus size={17} />
        </button>
      </header>

      <div className="notes-search">
        <Search size={14} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" aria-label="Search notes" />
      </div>

      <div className="notes-list">
        {visible.map((note) => (
          <button key={note.id} type="button" className="note-card" onClick={() => open(note)}>
            <strong>{note.title || 'New note'}</strong>
            <span>{note.body ? note.body.split('\n')[0] : 'No additional text'}</span>
            <em>{stamp(note.updated_at)}</em>
          </button>
        ))}
        {visible.length === 0 && <p className="empty-state">No notes match “{query}”.</p>}
      </div>
    </div>
  );
}
