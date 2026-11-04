import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/OSProvider'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Glyph } from '../os/Glyph'
import { KEYPAD_TONES, clock, duration, relativeDay } from '../os/utils'
import { placeCall, getCallStatus, hangupCall, mapStatus } from '../os/callApi'

const KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
]

function formatNumber(number) {
  const digits = number.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('07')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
  }
  return number
}

const TABS = [
  { id: 'keypad', label: 'Keypad', icon: 'keypadGrid' },
  { id: 'recents', label: 'Recents', icon: 'clock' },
  { id: 'contacts', label: 'Contacts', icon: 'addPerson' },
]

function CallScreen({ call, phase, demo, onEnd, playTone }) {
  const [elapsed, setElapsed] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)
  const [showPad, setShowPad] = useState(false)
  const [digits, setDigits] = useState('')

  const connected = phase === 'active'

  useEffect(() => {
    if (!connected) return
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [connected])

  const statusText = connected
    ? duration(elapsed)
    : phase === 'calling'
      ? 'Ringing…'
      : demo
        ? 'Calling…'
        : 'Connecting…'

  const name = call.contact?.name || call.number

  return (
    <div className="call-screen">
      <div className="call-top">
        <span className="call-status">
          {statusText}
          {demo ? ' · demo' : ''}
        </span>
      </div>

      <div className="call-person">
        <Avatar contact={call.contact || { name: call.number, initials: '#' }} size={104} />
        <h2>{name}</h2>
        <p>{call.contact ? call.contact.phone : 'Unknown number'}</p>
      </div>

      {showPad ? (
        <div className="call-pad">
          <div className="call-pad-digits">{digits || 'Keypad'}</div>
          <div className="keypad keypad-compact">
            {KEYS.map((key) => (
              <button
                type="button"
                key={key.digit}
                className="key"
                aria-label={key.digit}
                onClick={() => {
                  setDigits((d) => d + key.digit)
                  playTone(KEYPAD_TONES[key.digit], 80)
                }}
              >
                <strong>{key.digit}</strong>
                <small>{key.letters}</small>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="call-actions">
          <button
            type="button"
            className={`call-btn ${muted ? 'is-on' : ''}`}
            onClick={() => setMuted((m) => !m)}
          >
            <Glyph name={muted ? 'mute' : 'speaker'} size={22} strokeWidth={1.9} />
            <span>{muted ? 'Muted' : 'Mute'}</span>
          </button>
          <button
            type="button"
            className={`call-btn ${showPad ? 'is-on' : ''}`}
            onClick={() => setShowPad(true)}
          >
            <Glyph name="keypadGrid" size={22} strokeWidth={1.9} />
            <span>Keypad</span>
          </button>
          <button
            type="button"
            className={`call-btn ${speaker ? 'is-on' : ''}`}
            onClick={() => setSpeaker((s) => !s)}
          >
            <Glyph name="speaker" size={22} strokeWidth={1.9} />
            <span>Speaker</span>
          </button>
        </div>
      )}

      <button type="button" className="call-end" onClick={() => onEnd(elapsed)} aria-label="End call">
        <Glyph name="phone" size={28} strokeWidth={2} />
      </button>
      {showPad && (
        <button type="button" className="call-pad-close" onClick={() => setShowPad(false)}>
          Hide keypad
        </button>
      )}
    </div>
  )
}

export function PhoneApp() {
  const { data, actions } = useOS()
  const [tab, setTab] = useState('keypad')
  const [number, setNumber] = useState('')
  const [call, setCall] = useState(null)
  const [detail, setDetail] = useState(null)

  const match = actions.contactForNumber(number)

  // Poll the live Twilio call status while a real call is in progress.
  useEffect(() => {
    if (!call?.sid || call.phase === 'ended') return
    const poll = setInterval(async () => {
      const res = await getCallStatus(call.sid)
      if (!res.ok) return
      const next = mapStatus(res.status)
      if (next === 'ended') {
        clearInterval(poll)
        setCall((c) => (c ? { ...c, phase: 'ended' }))
      } else {
        setCall((c) => (c && next !== c.phase ? { ...c, phase: next } : c))
      }
    }, 3000)
    return () => clearInterval(poll)
  }, [call?.sid])

  const finishCall = async (seconds) => {
    if (call?.sid) await hangupCall(call.sid).catch(() => {})
    actions.logCall({
      contactId: call?.contact?.id || null,
      number: call?.contact?.phone || call?.number,
      type: 'out',
      duration: seconds,
    })
    setCall(null)
    setNumber('')
    setTab('recents')
  }

  const startCall = async (dialNumber, contact) => {
    const resolved = contact ?? actions.contactForNumber(dialNumber)
    actions.playTone(660, 160, 0.045)
    setCall({
      number: dialNumber,
      contact: resolved,
      startedAt: Date.now(),
      sid: null,
      phase: 'connecting',
      demo: false,
    })

    const res = await placeCall(dialNumber)
    if (res.ok) {
      setCall((c) => (c ? { ...c, sid: res.sid, phase: mapStatus(res.status) } : c))
    } else if (res.configured === false) {
      // No Twilio credentials — fall back to a simulated call so the UI works.
      setCall((c) => (c ? { ...c, demo: true } : c))
      setTimeout(() => {
        setCall((c) => (c && c.demo ? { ...c, phase: 'active' } : c))
      }, 2200)
    } else {
      // A real Twilio error — still show the call screen briefly with the reason.
      setCall((c) => (c ? { ...c, demo: true, error: res.error } : c))
      setTimeout(() => {
        setCall((c) => (c ? { ...c, phase: 'active' } : c))
      }, 1600)
    }
  }

  if (call) {
    return (
      <div className="app-layer call-layer">
        <CallScreen
          call={call}
          phase={call.phase}
          demo={call.demo}
          onEnd={finishCall}
          playTone={actions.playTone}
        />
      </div>
    )
  }

  return (
    <AppShell className="phone-app" title="Phone" subtitle={undefined} onBack={undefined}>
      <div className="phone-body">
        {tab === 'keypad' && (
          <div className="dialer">
            <div className="dialer-display">
              <span className={`dialer-number ${number ? '' : 'is-empty'}`}>
                {number ? formatNumber(number) : match ? match.name : 'Enter a number'}
              </span>
              {number && match && <span className="dialer-name">mobile · {match.name}</span>}
            </div>

            <div className="keypad">
              {KEYS.map((key) => (
                <button
                  type="button"
                  key={key.digit}
                  className="key"
                  aria-label={key.digit}
                  onClick={() => {
                    setNumber((value) => value + key.digit)
                    actions.playTone(KEYPAD_TONES[key.digit], 80)
                  }}
                >
                  <strong>{key.digit}</strong>
                  <small>{key.letters}</small>
                </button>
              ))}
            </div>

            <div className="dialer-actions">
              <button
                type="button"
                className="dialer-call"
                onClick={() => startCall(number, match)}
                disabled={number.length < 3}
                aria-label="Call"
              >
                <Glyph name="phone" size={26} strokeWidth={2} />
              </button>
              {number && (
                <button
                  type="button"
                  className="dialer-delete"
                  onClick={() => setNumber((value) => value.slice(0, -1))}
                  aria-label="Delete digit"
                >
                  <Glyph name="x" size={16} strokeWidth={2.2} />
                </button>
              )}
            </div>
          </div>
        )}

        {tab === 'recents' && (
          <div className="list recents">
            <div className="list-heading">Recents</div>
            {data.calls.map((entry) => {
              const contact = data.contacts.find((c) => c.id === entry.contactId)
              const label = contact?.name || entry.number || 'Unknown'
              const isMissed = entry.type === 'missed'
              return (
                <div key={entry.id} className={`list-row recents-row ${isMissed ? 'is-missed' : ''}`}>
                  <Glyph
                    name={entry.type === 'in' || entry.type === 'missed' ? 'arrowLeft' : 'arrowRight'}
                    size={16}
                    strokeWidth={2.2}
                    className="recents-icon"
                  />
                  <button
                    type="button"
                    className="list-main recents-main"
                    onClick={() => startCall(contact?.phone || entry.number, contact)}
                  >
                    <strong>{isMissed ? `${label}` : label}</strong>
                    <span className="list-snippet">
                      {isMissed ? 'Missed · ' : ''}
                      {contact ? 'mobile' : entry.number}
                      {entry.duration ? ` · ${duration(entry.duration)}` : ''}
                    </span>
                  </button>
                  <span className="list-time">
                    {relativeDay(entry.ts)} {clock(entry.ts)}
                  </span>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Call ${label}`}
                    onClick={() => startCall(contact?.phone || entry.number, contact)}
                  >
                    <Glyph name="phone" size={16} strokeWidth={2} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'contacts' && (
          <div className="list">
            <div className="list-heading">Contacts</div>
            {data.contacts.map((contact) => (
              <button
                type="button"
                key={contact.id}
                className="list-row"
                onClick={() => setDetail(contact)}
              >
                <Avatar contact={contact} size={40} />
                <span className="list-main">
                  <strong>{contact.name}</strong>
                  <span className="list-snippet">{contact.phone}</span>
                </span>
                <Glyph name="chevronRight" size={15} strokeWidth={2.2} className="row-chevron" />
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="tab-bar" aria-label="Phone sections">
        {TABS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`tab ${tab === item.id ? 'is-active' : ''}`}
            onClick={() => setTab(item.id)}
            aria-current={tab === item.id}
          >
            <Glyph name={item.icon} size={21} strokeWidth={1.8} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {detail && (
        <div className="sheet-layer" role="dialog" aria-label={detail.name}>
          <button
            type="button"
            className="sheet-backdrop"
            aria-label="Close"
            onClick={() => setDetail(null)}
          />
          <div className="sheet contact-sheet">
            <div className="sheet-grip" />
            <Avatar contact={detail} size={74} />
            <h2>{detail.name}</h2>
            <p className="contact-number">{detail.phone}</p>
            <div className="contact-actions">
              <button
                type="button"
                className="contact-action"
                onClick={() => {
                  const target = detail
                  setDetail(null)
                  startCall(target.phone, target)
                }}
              >
                <Glyph name="phone" size={20} strokeWidth={2} />
                Call
              </button>
              <button
                type="button"
                className="contact-action"
                onClick={() => {
                  actions.openMessageThread(detail.id)
                  setDetail(null)
                }}
              >
                <Glyph name="messages" size={20} strokeWidth={2} />
                Message
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
