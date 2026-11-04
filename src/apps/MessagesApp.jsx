import { useEffect, useMemo, useRef, useState } from 'react'
import { useOS } from '../os/OSProvider'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Glyph } from '../os/Glyph'
import { clock, relativeDay } from '../os/utils'

export function MessagesApp() {
  const { data, ui, actions } = useOS()
  const [openId, setOpenId] = useState(ui.messageTarget || null)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [picking, setPicking] = useState(false)
  const endRef = useRef(null)
  const typingTimer = useRef(null)

  const conversations = useMemo(
    () =>
      data.conversations
        .map((conv) => {
          const contact = data.contacts.find((c) => c.id === conv.contactId)
          const last = conv.messages[conv.messages.length - 1]
          return { ...conv, contact, last }
        })
        .sort((a, b) => (b.last?.ts || 0) - (a.last?.ts || 0)),
    [data.conversations, data.contacts],
  )

  const open = conversations.find((c) => c.id === openId)

  // Actions change identity whenever device state updates, so keep the latest in a
  // ref and only react to the values that should actually trigger these effects.
  const actionsRef = useRef(actions)
  actionsRef.current = actions

  useEffect(() => {
    if (!ui.messageTarget) return
    setOpenId(ui.messageTarget)
    actionsRef.current.clearMessageTarget()
  }, [ui.messageTarget])

  useEffect(() => {
    if (!openId) return
    actionsRef.current.markRead(openId)
  }, [openId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [open?.messages.length, openId, typing])

  useEffect(() => () => clearTimeout(typingTimer.current), [])

  const send = () => {
    if (!draft.trim() || !open) return
    actions.sendMessage(open.id, draft)
    setDraft('')
    setTyping(true)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setTyping(false), 1800)
  }

  const startConversation = (contactId) => {
    const id = actions.ensureConversation(contactId)
    setPicking(false)
    setOpenId(id)
  }

  if (open) {
    return (
      <AppShell
        className="messages-app"
        title={open.contact?.name || 'Message'}
        subtitle={open.contact?.phone}
        onBack={() => {
          setOpenId(null)
          setTyping(false)
        }}
        actions={
          <button
            type="button"
            className="head-btn"
            aria-label="Call contact"
            onClick={() => {
              actions.openApp('phone')
            }}
          >
            <Glyph name="phone" size={18} strokeWidth={2} />
          </button>
        }
        headless={false}
      >
        <div className="thread">
          <div className="thread-day">{relativeDay(open.messages[0]?.ts || Date.now())}</div>
          {open.messages.map((message, index) => {
            const prev = open.messages[index - 1]
            const grouped = prev && prev.from === message.from
            return (
              <div
                key={message.id}
                className={`bubble-row ${message.from === 'me' ? 'mine' : 'theirs'} ${
                  grouped ? 'grouped' : ''
                }`}
              >
                <div className="bubble">{message.text}</div>
                {!grouped && <span className="bubble-time">{clock(message.ts)}</span>}
              </div>
            )
          })}
          {typing && (
            <div className="bubble-row theirs">
              <div className="bubble typing" aria-label="Typing">
                <i /> <i /> <i />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message"
            aria-label="Message"
            enterKeyHint="send"
          />
          <button
            type="submit"
            className="composer-send"
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <Glyph name="send" size={18} strokeWidth={2} />
          </button>
        </form>
      </AppShell>
    )
  }

  return (
    <AppShell
      className="messages-app"
      title="Messages"
      badge={null}
      actions={
        <button type="button" className="head-btn" aria-label="New message" onClick={() => setPicking(true)}>
          <Glyph name="plus" size={19} strokeWidth={2} />
        </button>
      }
    >
      <div className="list">
        {conversations.map((conv) => (
          <button
            type="button"
            key={conv.id}
            className={`list-row ${conv.unread ? 'is-unread' : ''}`}
            onClick={() => setOpenId(conv.id)}
          >
            <Avatar contact={conv.contact} size={46} />
            <span className="list-main">
              <span className="list-top">
                <strong>{conv.contact?.name || 'Unknown'}</strong>
                <span className="list-time">{clock(conv.last?.ts || Date.now())}</span>
              </span>
              <span className="list-snippet">
                {conv.last ? (
                  <>
                    {conv.last.from === 'me' ? 'You: ' : ''}
                    {conv.last.text}
                  </>
                ) : (
                  'No messages yet'
                )}
              </span>
            </span>
            {conv.unread > 0 && <span className="unread-dot">{conv.unread}</span>}
            <Glyph name="chevronRight" size={15} strokeWidth={2.2} className="row-chevron" />
          </button>
        ))}
      </div>

      {picking && (
        <div className="sheet-layer" role="dialog" aria-label="New message">
          <button
            type="button"
            className="sheet-backdrop"
            aria-label="Close"
            onClick={() => setPicking(false)}
          />
          <div className="sheet">
            <div className="sheet-grip" />
            <h2>New message</h2>
            <div className="sheet-list">
              {data.contacts.map((contact) => (
                <button
                  type="button"
                  key={contact.id}
                  className="list-row"
                  onClick={() => startConversation(contact.id)}
                >
                  <Avatar contact={contact} size={38} />
                  <span className="list-main">
                    <strong>{contact.name}</strong>
                    <span className="list-snippet">{contact.phone}</span>
                  </span>
                  <Glyph name="chevronRight" size={15} strokeWidth={2.2} className="row-chevron" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
