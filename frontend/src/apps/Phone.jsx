import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Delete,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Mic,
  MicOff,
  Volume2,
  UserPlus,
  Grid3x3,
  Users,
  Clock3,
  CircleUser,
} from 'lucide-react';
import { api } from '../lib/api';
import { duration as fmtDuration, initials, timeAgo, digitsOnly, prettyNumber } from '../lib/format';

const KEYS = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
  ['*', ''],
  ['0', '+'],
  ['#', ''],
];

export default function PhoneApp() {
  const [tab, setTab] = useState('keypad');
  const [dial, setDial] = useState('');
  const [contacts, setContacts] = useState([]);
  const [calls, setCalls] = useState([]);
  const [call, setCall] = useState(null);

  const loadCalls = useCallback(() => {
    api.calls().then(setCalls).catch(() => {});
  }, []);

  useEffect(() => {
    api.contacts().then(setContacts).catch(() => {});
    loadCalls();
  }, [loadCalls]);

  /* dialing -> connected */
  useEffect(() => {
    if (!call || call.status !== 'dialing') return;
    const timer = setTimeout(() => {
      setCall((current) => (current ? { ...current, status: 'active', startedAt: Date.now() } : current));
    }, 2400);
    return () => clearTimeout(timer);
  }, [call]);

  /* call duration ticker */
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!call || call.status !== 'active') {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [call]);

  const startCall = (name, number) => {
    setCall({ name, number, status: 'dialing', muted: false, speaker: false, showPad: false });
  };

  const endCall = () => {
    if (!call) return;
    const answered = call.status === 'active';
    api
      .logCall({
        name: call.name,
        number: call.number,
        direction: 'outgoing',
        status: answered ? 'answered' : 'cancelled',
        duration: answered ? seconds : 0,
      })
      .then(loadCalls)
      .catch(() => {});
    setCall(null);
    setDial('');
  };

  const appendKey = (key) => {
    if (call?.showPad) return;
    setDial((prev) => (prev + key).slice(0, 18));
  };

  const matched = contacts.find((c) => {
    const a = digitsOnly(c.number).replace('+', '').slice(-9);
    const b = digitsOnly(dial).replace('+', '');
    return b.length >= 4 && a.endsWith(b);
  });

  return (
    <div className="phone">
      <header className="phone-head">
        <div>
          <h1 className="phone-title">Phone</h1>
          <p className="phone-sub">{contacts.length} contacts · BananaNet</p>
        </div>
        <span className="phone-badge">
          <span className="dot" /> Connected
        </span>
      </header>

      <div className="phone-content">
        {tab === 'keypad' && (
          <div className="keypad-view">
            <div className="dial-display">
              {matched && <span className="dial-name">{matched.name}</span>}
              <span className={`dial-number ${dial ? '' : 'is-placeholder'}`}>{dial ? prettyNumber(dial) : 'Enter a number'}</span>
            </div>

            <div className="keypad">
              {KEYS.map(([digit, letters]) => (
                <button key={digit} className="key" type="button" onClick={() => appendKey(digit)}>
                  <span className="key-digit">{digit}</span>
                  {letters && <span className="key-letters">{letters}</span>}
                </button>
              ))}
            </div>

            <div className="dial-actions">
              <button
                className="dial-call"
                type="button"
                disabled={!dial}
                onClick={() => startCall(matched ? matched.name : prettyNumber(dial), prettyNumber(dial))}
              >
                <Phone size={26} strokeWidth={2.2} />
              </button>
              <button className="dial-delete" type="button" onClick={() => setDial((prev) => prev.slice(0, -1))} aria-label="Delete digit">
                <Delete size={20} />
              </button>
            </div>
          </div>
        )}

        {tab === 'recents' && (
          <div className="recents-view">
            {calls.length === 0 && <p className="empty-state">No calls yet. Dial a number to get started.</p>}
            {calls.map((item) => {
              const Icon = item.status === 'missed' ? PhoneMissed : item.direction === 'incoming' ? PhoneIncoming : PhoneOutgoing;
              return (
                <button
                  key={item.id}
                  className="row call-row"
                  type="button"
                  onClick={() => startCall(item.name, item.number)}
                >
                  <Icon size={15} className={item.status === 'missed' ? 'call-icon is-missed' : 'call-icon'} />
                  <div className="row-main">
                    <div className="row-title">{item.name}</div>
                    <div className="row-sub">
                      {item.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
                      {item.status === 'missed' ? ' · Missed' : item.duration ? ` · ${fmtDuration(item.duration)}` : ''}
                    </div>
                  </div>
                  <span className="row-meta">{timeAgo(item.created_at)}</span>
                </button>
              );
            })}
          </div>
        )}

        {tab === 'contacts' && (
          <div className="contacts-view">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                className="row"
                type="button"
                onClick={() => startCall(contact.name, contact.number)}
              >
                <span className="avatar" style={{ background: contact.color }}>
                  {initials(contact.name)}
                </span>
                <div className="row-main">
                  <div className="row-title">{contact.name}</div>
                  <div className="row-sub">{contact.number}</div>
                </div>
                <span className="contact-call">
                  <Phone size={16} />
                </span>
              </button>
            ))}
            <p className="hint">Tap a contact to call. Calls are simulated inside BananaOS.</p>
          </div>
        )}
      </div>

      <nav className="phone-nav">
        <button className={tab === 'keypad' ? 'is-on' : ''} onClick={() => setTab('keypad')} type="button">
          <Grid3x3 size={19} />
          <span>Keypad</span>
        </button>
        <button className={tab === 'recents' ? 'is-on' : ''} onClick={() => setTab('recents')} type="button">
          <Clock3 size={19} />
          <span>Recents</span>
        </button>
        <button className={tab === 'contacts' ? 'is-on' : ''} onClick={() => setTab('contacts')} type="button">
          <Users size={19} />
          <span>Contacts</span>
        </button>
      </nav>

      {call && (
        <CallScreen
          call={call}
          seconds={seconds}
          dial={dial}
          onAppend={appendKey}
          onEnd={endCall}
          onToggle={(key) => setCall((current) => (current ? { ...current, [key]: !current[key] } : current))}
        />
      )}
    </div>
  );
}

function CallScreen({ call, seconds, dial, onAppend, onEnd, onToggle }) {
  const padRef = useRef(null);
  const active = call.status === 'active';
  const contact = call.name;

  return (
    <div className="call-screen">
      <div className="call-bg" />
      <div className="call-inner">
        <div className="call-top">
          <span className="call-quality">
            <span className="dot" /> HD voice
          </span>
        </div>

        <div className="call-who">
          <div className="call-avatar">
            <CircleUser size={52} strokeWidth={1.4} />
          </div>
          <h2>{contact || 'Unknown'}</h2>
          <p className="call-number">{call.number}</p>
          <p className={`call-status ${active ? 'is-live' : ''}`}>
            {active ? fmtDuration(seconds) : 'Calling…'}
          </p>
        </div>

        {call.showPad ? (
          <div className="call-pad" ref={padRef}>
            {KEYS.slice(0, 12).map(([digit, letters]) => (
              <button key={digit} type="button" className="key is-small" onClick={() => onAppend(digit)}>
                <span className="key-digit">{digit}</span>
                {letters && <span className="key-letters">{letters}</span>}
              </button>
            ))}
            <p className="call-pad-number">{dial || '—'}</p>
          </div>
        ) : (
          <div className="call-actions">
            <button className={`call-action ${call.muted ? 'is-on' : ''}`} type="button" onClick={() => onToggle('muted')}>
              {call.muted ? <MicOff size={21} /> : <Mic size={21} />}
              <span>Mute</span>
            </button>
            <button className={`call-action ${call.speaker ? 'is-on' : ''}`} type="button" onClick={() => onToggle('speaker')}>
              <Volume2 size={21} />
              <span>Speaker</span>
            </button>
            <button className="call-action" type="button" onClick={() => onToggle('showPad')}>
              <Grid3x3 size={21} />
              <span>Keypad</span>
            </button>
            <button className="call-action" type="button">
              <UserPlus size={21} />
              <span>Add</span>
            </button>
          </div>
        )}

        <div className="call-end-wrap">
          {call.showPad && (
            <button className="call-action is-ghost" type="button" onClick={() => onToggle('showPad')}>
              <span>Hide keypad</span>
            </button>
          )}
          <button className="call-end" type="button" onClick={onEnd} aria-label="End call">
            <Phone size={26} strokeWidth={2.4} style={{ transform: 'rotate(133deg)' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
