import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/OSProvider'
import { StatusBar, Island } from './StatusBar'
import { Glyph } from '../os/Glyph'
import { clock, clockTime, longDate } from '../os/utils'
import { AppIcon } from './AppIcon'
import { APPS } from '../os/appRegistry'

export function LockScreen() {
  const { data, actions, unreadTotal } = useOS()
  const [now, setNow] = useState(new Date())
  const [drag, setDrag] = useState(0)
  const startY = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const onPointerDown = (event) => {
    startY.current = event.clientY
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      /* synthetic or already-released pointer */
    }
  }

  const onPointerMove = (event) => {
    if (startY.current === null) return
    setDrag(Math.min(0, event.clientY - startY.current))
  }

  const onPointerUp = () => {
    if (drag < -70) actions.unlock()
    startY.current = null
    setDrag(0)
  }

  const messagesApp = APPS.messages
  const newest = data.conversations
    .filter((c) => c.unread > 0)
    .map((c) => ({
      conv: c,
      contact: data.contacts.find((p) => p.id === c.contactId),
      message: c.messages[c.messages.length - 1],
    }))
    .filter((item) => item.contact && item.message)

  return (
    <div
      className="lock"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <StatusBar />
      <Island />
      <div className="lock-body" style={{ transform: `translateY(${drag}px)`, opacity: 1 + drag / 420 }}>
        <div className="lock-clock">{clockTime(now)}</div>
        <div className="lock-date">{longDate(now)}</div>

        <div className="lock-notifications">
          {newest.slice(0, 2).map(({ conv, contact, message }) => (
            <button
              type="button"
              key={conv.id}
              className="lock-note"
              onClick={() => {
                actions.unlock()
                actions.openApp('messages')
                actions.markRead(conv.id)
              }}
            >
              <AppIcon app={messagesApp} size={34} plain />
              <span className="lock-note-text">
                <strong>
                  {contact.name}
                  {unreadTotal > 1 ? ` · ${conv.unread} new` : ''}
                </strong>
                <span>{message.text}</span>
              </span>
              <span className="lock-note-time">{clock(message.ts)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lock-footer">
        <button type="button" className="unlock-pill" onClick={actions.unlock}>
          <Glyph name="unlock" size={16} strokeWidth={2} />
          Swipe up to unlock
        </button>
      </div>
      <div className="lock-home-bar" aria-hidden="true" />
    </div>
  )
}
