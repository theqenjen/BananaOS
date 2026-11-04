import React, { useState } from 'react';
import { AppFrame, EmptyState } from '../os/AppFrame';
import { Icon } from '../os/icons';
import { useOS, uid } from '../os/store';
import { usePersistentState } from '../os/storage';
import { shortStamp } from '../os/hooks';

const SEED_NOTES = [
  {
    id: 'n1',
    text: 'Shopping list\nBananas (obviously)\nOat milk\nCoffee beans',
    ts: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'n2',
    text: 'BananaOS ideas\nHome screen widgets\nA torch toggle\nCloud sync for notes',
    ts: Date.now() - 1000 * 60 * 60 * 30,
  },
];

export default function Notes() {
  const { openApp } = useOS();
  const [notes, setNotes] = usePersistentState('notes', SEED_NOTES);
  const [openId, setOpenId] = useState(null);
  const note = notes.find((item) => item.id === openId) || null;

  const updateNote = (text) => {
    setNotes((list) => list.map((item) => (item.id === openId ? { ...item, text, ts: Date.now() } : item)));
  };

  const addNote = () => {
    const id = uid();
    setNotes((list) => [{ id, text: '', ts: Date.now() }, ...list]);
    setOpenId(id);
  };

  const deleteNote = () => {
    setNotes((list) => list.filter((item) => item.id !== openId));
    setOpenId(null);
  };

  if (note) {
    return (
      <AppFrame
        title="Note"
        onBack={() => setOpenId(null)}
        right={
          <button type="button" className="icon-button" onClick={deleteNote} aria-label="Delete note">
            <Icon name="trash" size={19} />
          </button>
        }
        bodyClassName="note-editor-body"
      >
        <textarea
          className="note-editor"
          value={note.text}
          onChange={(event) => updateNote(event.target.value)}
          placeholder="Start writing…"
          autoFocus
        />
        <div className="note-meta">Edited {shortStamp(note.ts)}</div>
      </AppFrame>
    );
  }

  return (
    <AppFrame
      title="Notes"
      subtitle={`${notes.length} notes`}
      right={
        <button type="button" className="icon-button" onClick={addNote} aria-label="New note">
          <Icon name="plus" size={20} />
        </button>
      }
      bodyClassName="notes-body"
    >
      {!notes.length && <EmptyState title="No notes" note="Tap + to write one." icon="notes" />}
      <div className="list-view">
        {notes.map((item) => {
          const [title, ...rest] = item.text.split('\n');
          return (
            <button type="button" key={item.id} className="note-row" onClick={() => setOpenId(item.id)}>
              <span className="note-title">{title || 'New note'}</span>
              <span className="note-preview">{rest.join(' ').slice(0, 70) || 'No additional text'}</span>
              <span className="note-time">{shortStamp(item.ts)}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="text-button notes-link" onClick={() => openApp('settings')}>
        Notes are stored on this Banana One
      </button>
    </AppFrame>
  );
}
