import { useState } from 'react'
import { useOS } from '../os/OSProvider'
import { AppShell } from '../components/AppShell'
import { Glyph } from '../os/Glyph'
import { relativeDay } from '../os/utils'

export function NotesApp() {
  const { data, actions } = useOS()
  const [openId, setOpenId] = useState(null)
  const note = data.notes.find((item) => item.id === openId)

  if (note) {
    return (
      <AppShell
        className="notes-app"
        title="Note"
        onBack={() => setOpenId(null)}
        actions={
          <button
            type="button"
            className="head-btn"
            aria-label="Delete note"
            onClick={() => {
              actions.deleteNote(note.id)
              setOpenId(null)
            }}
          >
            <Glyph name="trash" size={18} strokeWidth={1.9} />
          </button>
        }
      >
        <div className="note-editor">
          <input
            className="note-title"
            value={note.title}
            placeholder="Title"
            onChange={(event) => actions.updateNote(note.id, { title: event.target.value })}
            aria-label="Note title"
          />
          <span className="note-meta">Edited {relativeDay(note.updated)}</span>
          <textarea
            className="note-body"
            value={note.body}
            placeholder="Start writing…"
            onChange={(event) => actions.updateNote(note.id, { body: event.target.value })}
            aria-label="Note body"
          />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      className="notes-app"
      title="Notes"
      subtitle={`${data.notes.length} notes`}
      actions={
        <button
          type="button"
          className="head-btn"
          aria-label="New note"
          onClick={() => setOpenId(actions.addNote())}
        >
          <Glyph name="plus" size={19} strokeWidth={2} />
        </button>
      }
    >
      <div className="note-list">
        {data.notes.length === 0 && <p className="muted">No notes yet. Tap + to write one.</p>}
        {data.notes.map((item) => (
          <button type="button" key={item.id} className="note-card" onClick={() => setOpenId(item.id)}>
            <strong>{item.title || 'New note'}</strong>
            <span className="note-preview">{item.body.split('\n')[0] || 'No additional text'}</span>
            <span className="note-when">{relativeDay(item.updated)}</span>
          </button>
        ))}
      </div>
    </AppShell>
  )
}
