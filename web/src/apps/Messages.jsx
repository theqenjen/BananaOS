import React, { useEffect, useRef, useState } from 'react';
import { AppFrame, EmptyState, IconButton } from '../os/AppFrame';
import { Icon } from '../os/icons';
import { useOS } from '../os/store';
import { clockTime, initials, shortStamp } from '../os/hooks';

export default function Messages({ params }) {
  const { conversations, sendMessage, setThreadInView } = useOS();
  const [threadId, setThreadId] = useState(params?.threadId || null);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);
  const thread = conversations.find((conv) => conv.id === threadId) || null;

  useEffect(() => {
    if (params?.threadId) setThreadId(params.threadId);
  }, [params?.threadId]);

  useEffect(() => {
    setThreadInView(threadId);
    return () => setThreadInView(null);
  }, [threadId, setThreadInView]);

  useEffect(() => {
    setDraft('');
  }, [threadId]);

  useEffect(() => {
    if (thread && bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end' });
    }
  }, [thread, thread?.messages.length]);

  const submit = (event) => {
    event.preventDefault();
    if (!thread || !draft.trim()) return;
    sendMessage(thread.id, draft);
    setDraft('');
  };

  if (thread) {
    return (
      <div className="app-frame messages-thread">
        <header className="app-header slim">
          <div className="app-header-side left">
            <button type="button" className="icon-button" onClick={() => setThreadId(null)} aria-label="Back to conversations">
              <Icon name="chevronLeft" size={22} />
            </button>
          </div>
          <div className="thread-title">
            <span className="avatar small" style={{ background: thread.color }}>
              {initials(thread.name)}
            </span>
            <span>
              <span className="thread-name">{thread.name}</span>
              <span className="thread-number">{thread.number}</span>
            </span>
          </div>
          <div className="app-header-side right">
            <IconButton name="phone" label="Call contact" onClick={() => {}} />
          </div>
        </header>

        <div className="thread-body">
          {!thread.messages.length && (
            <p className="thread-intro">No messages yet. Say hello to {thread.name.split(' ')[0]}.</p>
          )}
          {thread.messages.map((message) => (
            <div key={message.id} className={`bubble-row ${message.from === 'me' ? 'from-me' : 'from-them'}`}>
              <div className="bubble">
                <span className="bubble-text">{message.text}</span>
                <span className="bubble-time">{clockTime(new Date(message.ts))}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="composer" onSubmit={submit}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message"
            aria-label={`Message ${thread.name}`}
            enterKeyHint="send"
          />
          <button type="submit" className="send-button" disabled={!draft.trim()} aria-label="Send message">
            <Icon name="arrowUp" size={20} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <AppFrame title="Messages" right={<span className="header-chip">{conversations.length} threads</span>} bodyClassName="messages-body">
      {!conversations.length && <EmptyState title="No conversations" note="Start one from Phone → Contacts." icon="messages" />}
      <div className="conversation-list">
        {conversations.map((conv) => {
          const last = conv.messages[conv.messages.length - 1];
          return (
            <button type="button" key={conv.id} className="conversation-row" onClick={() => setThreadId(conv.id)}>
              <span className="avatar" style={{ background: conv.color }}>
                {initials(conv.name)}
              </span>
              <span className="conversation-copy">
                <span className="conversation-head">
                  <span className="conversation-name">{conv.name}</span>
                  <span className="conversation-time">{last ? shortStamp(last.ts) : ''}</span>
                </span>
                <span className="conversation-preview">
                  {last ? (last.from === 'me' ? 'You: ' : '') + last.text : 'No messages yet'}
                </span>
              </span>
              {conv.unread > 0 && <span className="unread-dot">{conv.unread}</span>}
            </button>
          );
        })}
      </div>
    </AppFrame>
  );
}
