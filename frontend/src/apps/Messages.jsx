import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, SquarePen, ArrowUp, Phone, X } from 'lucide-react';
import { api } from '../lib/api';
import { initials, messageStamp, timeAgo } from '../lib/format';

export default function MessagesApp() {
  const [threads, setThreads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [composing, setComposing] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const active = threads.find((thread) => thread.id === activeId) || null;
  const scroller = useRef(null);
  const replyTimer = useRef(null);

  useEffect(() => {
    api
      .threads()
      .then(setThreads)
      .catch(() => {})
      .finally(() => setLoadingThreads(false));
    api.contacts().then(setContacts).catch(() => {});
    return () => clearTimeout(replyTimer.current);
  }, []);

  useEffect(() => {
    if (!scroller.current) return;
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, typing, activeId]);

  const openThread = useCallback(async (thread) => {
    setActiveId(thread.id);
    setTyping(false);
    setDraft('');
    setThreads((prev) => prev.map((t) => (t.id === thread.id ? { ...t, unread: 0 } : t)));
    setLoadingMessages(true);
    try {
      const list = await api.messages(thread.id);
      setMessages(list);
      api.markRead(thread.id).catch(() => {});
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const back = () => {
    clearTimeout(replyTimer.current);
    setTyping(false);
    setActiveId(null);
    setMessages([]);
    api.threads().then(setThreads).catch(() => {});
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || !active || sending) return;
    setDraft('');
    setSending(true);
    try {
      const { message, reply } = await api.sendMessage(active.id, text);
      setMessages((prev) => [...prev, message]);
      setThreads((prev) =>
        prev
          .map((t) => (t.id === active.id ? { ...t, lastMessage: text, lastSender: 'me', lastAt: message.created_at, updatedAt: message.created_at } : t))
          .sort((a, b) => b.lastAt - a.lastAt)
      );
      if (reply) {
        clearTimeout(replyTimer.current);
        setTyping(true);
        replyTimer.current = setTimeout(() => {
          setTyping(false);
          setMessages((prev) => [...prev, reply]);
          setThreads((prev) =>
            prev.map((t) =>
              t.id === active.id ? { ...t, lastMessage: reply.body, lastSender: 'them', lastAt: reply.created_at, updatedAt: reply.created_at } : t
            )
          );
        }, 1700);
      }
    } catch {
      setDraft(text);
    } finally {
      setSending(false);
    }
  };

  const startThread = async (contact) => {
    setComposing(false);
    try {
      const thread = await api.createThread(contact.id);
      setThreads((prev) => (prev.some((t) => t.id === thread.id) ? prev : [thread, ...prev]));
      openThread(thread);
    } catch {
      /* ignore */
    }
  };

  if (active) {
    return (
      <div className="messages">
        <header className="thread-head">
          <button className="nav-btn" type="button" onClick={back} aria-label="Back to conversations">
            <ChevronLeft size={19} />
          </button>
          <div className="thread-who">
            <span className="avatar is-round-sq" style={{ background: active.contact.color, width: 34, height: 34, fontSize: 12 }}>
              {initials(active.contact.name)}
            </span>
            <div>
              <div className="thread-name">{active.contact.name}</div>
              <div className="thread-status">{typing ? 'typing…' : `${active.contact.tag} · BananaNet`}</div>
            </div>
          </div>
          <button className="nav-btn" type="button" aria-label="Call contact">
            <Phone size={17} />
          </button>
        </header>

        <div className="thread-messages" ref={scroller}>
          <p className="thread-intro">
            Conversation with <strong>{active.contact.name}</strong> · {active.contact.number}
          </p>
          {loadingMessages && messages.length === 0 && <p className="empty-state">Loading conversation…</p>}
          {!loadingMessages && messages.length === 0 && <p className="empty-state">No messages yet. Say hello 👋</p>}
          {messages.map((message, index) => {
            const next = messages[index + 1];
            const showStamp = !next || next.sender !== message.sender || next.created_at - message.created_at > 6 * 60 * 1000;
            return (
              <div key={message.id} className={`msg-row ${message.sender === 'me' ? 'is-me' : ''}`}>
                {message.sender === 'them' && index === 0 && (
                  <span className="avatar is-round-sq msg-avatar" style={{ background: active.contact.color }}>
                    {initials(active.contact.name)}
                  </span>
                )}
                <div className="msg-stack">
                  <div className={`bubble ${message.sender === 'me' ? 'is-me' : ''}`}>{message.body}</div>
                  {showStamp && <span className="bubble-stamp">{messageStamp(message.created_at)}</span>}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="msg-row">
              <span className="avatar is-round-sq msg-avatar" style={{ background: active.contact.color }}>
                {initials(active.contact.name)}
              </span>
              <div className="bubble typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          )}
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <input
            className="composer-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message"
            aria-label="Message"
          />
          <button className="composer-send" type="submit" disabled={!draft.trim()} aria-label="Send">
            <ArrowUp size={19} strokeWidth={2.6} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="messages">
      <header className="messages-head">
        <div>
          <h1 className="phone-title">Messages</h1>
          <p className="phone-sub">{threads.reduce((sum, t) => sum + (t.unread || 0), 0)} unread</p>
        </div>
        <button className="nav-btn is-accent" type="button" onClick={() => setComposing(true)} aria-label="New message">
          <SquarePen size={17} />
        </button>
      </header>

      <div className="thread-list">
        {threads.map((thread) => (
          <button key={thread.id} className="row thread-row" type="button" onClick={() => openThread(thread)}>
            <span className="avatar" style={{ background: thread.contact.color }}>
              {initials(thread.contact.name)}
            </span>
            <div className="row-main">
              <div className="thread-row-top">
                <span className="row-title">{thread.contact.name}</span>
                <span className="row-meta">{timeAgo(thread.lastAt)}</span>
              </div>
              <div className="thread-row-bottom">
                <span className="row-sub">
                  {thread.lastSender === 'me' ? 'You: ' : ''}
                  {thread.lastMessage || 'New conversation'}
                </span>
                {thread.unread > 0 && <span className="unread-badge">{thread.unread}</span>}
              </div>
            </div>
          </button>
        ))}
        {!loadingThreads && threads.length === 0 && <p className="empty-state">No conversations yet.</p>}
      </div>

      {composing && (
        <div className="sheet-layer">
          <div className="sheet-scrim" onClick={() => setComposing(false)} />
          <div className="sheet">
            <div className="sheet-grabber" />
            <div className="sheet-head">
              <h3 className="sheet-title">New message</h3>
              <button className="nav-btn" type="button" onClick={() => setComposing(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="sheet-contacts">
              {contacts.map((contact) => (
                <button key={contact.id} className="row" type="button" onClick={() => startThread(contact)}>
                  <span className="avatar" style={{ background: contact.color }}>
                    {initials(contact.name)}
                  </span>
                  <div className="row-main">
                    <div className="row-title">{contact.name}</div>
                    <div className="row-sub">{contact.number}</div>
                  </div>
                  <span className="row-meta">{contact.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
