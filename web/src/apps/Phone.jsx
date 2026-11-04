import React, { useEffect, useMemo, useState } from 'react';
import { AppFrame, IconButton } from '../os/AppFrame';
import { Icon } from '../os/icons';
import { useOS, uid } from '../os/store';
import { usePersistentState } from '../os/storage';
import { clockTime, initials, mmss, shortStamp } from '../os/hooks';

const KEYPAD = [
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

const normalise = (value) => String(value || '').replace(/[^\d+]/g, '');

export default function Phone() {
  const { conversations, openApp } = useOS();
  const [tab, setTab] = useState('keypad');
  const [dialled, setDialled] = useState('');
  const [call, setCall] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [calls, setCalls] = usePersistentState('calls', [
    { id: 'seed-call', name: 'Mum', number: '+44 7700 900 118', color: '#FF7A8A', ts: Date.now() - 1000 * 60 * 200, duration: 184, direction: 'outgoing' },
  ]);

  const contacts = useMemo(
    () =>
      conversations.map((conv) => ({
        id: conv.id,
        name: conv.name,
        number: conv.number,
        color: conv.color,
      })),
    [conversations],
  );

  const match = contacts.find((contact) => dialled.length >= 3 && normalise(contact.number).includes(normalise(dialled)));

  useEffect(() => {
    if (!call || !call.connectedAt) {
      setElapsed(0);
      return undefined;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - call.connectedAt) / 1000));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [call]);

  const startCall = (contact) => {
    const id = uid();
    setCall({ id, name: contact.name, number: contact.number, color: contact.color || '#F5D142', connectedAt: null, muted: false, speaker: false });
    setTab('keypad');
    setTimeout(() => {
      setCall((current) => (current && current.id === id && !current.connectedAt ? { ...current, connectedAt: Date.now() } : current));
    }, 2600);
  };

  const endCall = () => {
    if (!call) return;
    const duration = call.connectedAt ? Math.round((Date.now() - call.connectedAt) / 1000) : 0;
    setCalls((list) => [
      { id: uid(), name: call.name || call.number, number: call.number, color: call.color, ts: Date.now(), duration, direction: 'outgoing' },
      ...list,
    ].slice(0, 60));
    setCall(null);
  };

  const press = (key) => setDialled((value) => `${value}${key}`);

  return (
    <AppFrame
      title="Phone"
      right={
        <span className="header-chip">
          <Icon name="signal" size={12} /> Banana
        </span>
      }
      bodyClassName="phone-body"
    >
      <div className="segmented">
        {['keypad', 'recents', 'contacts'].map((name) => (
          <button
            type="button"
            key={name}
            className={`segment ${tab === name ? 'active' : ''}`}
            onClick={() => setTab(name)}
          >
            {name === 'keypad' ? 'Keypad' : name === 'recents' ? 'Recents' : 'Contacts'}
          </button>
        ))}
      </div>

      {tab === 'keypad' && (
        <div className="dialer">
          <div className="dial-display">
            <div className="dial-number">{dialled || ' '}</div>
            <div className="dial-match">{match ? match.name : dialled ? 'Unknown number' : 'Enter a number'}</div>
          </div>
          <div className="keypad">
            {KEYPAD.map(([key, sub]) => (
              <button type="button" key={key} className="key" onClick={() => press(key)}>
                <span className="key-digit">{key}</span>
                <span className="key-sub">{sub}</span>
              </button>
            ))}
          </div>
          <div className="dial-actions">
            <span className="dial-spacer" />
            <button
              type="button"
              className="call-button"
              aria-label="Call"
              disabled={!dialled}
              onClick={() => {
                const contact = match || { name: dialled, number: dialled, color: '#F5D142' };
                startCall(contact);
              }}
            >
              <Icon name="phone" size={26} />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Delete digit"
              onClick={() => setDialled((value) => value.slice(0, -1))}
              disabled={!dialled}
            >
              <Icon name="backspace" size={20} />
            </button>
          </div>
        </div>
      )}

      {tab === 'recents' && (
        <div className="list-view">
          {calls.map((item) => (
            <button type="button" key={item.id} className="list-row" onClick={() => startCall(item)}>
              <span className="avatar" style={{ background: item.color || '#3a3a42' }}>
                {initials(item.name || 'Unknown')}
              </span>
              <span className="row-main">
                <span className="row-title">{item.name || item.number}</span>
                <span className="row-sub">
                  Outgoing · {shortStamp(item.ts)} · {mmss(item.duration)}
                </span>
              </span>
              <Icon name="phone" size={18} className="row-action" />
            </button>
          ))}
          {!calls.length && <p className="list-empty">No recent calls</p>}
        </div>
      )}

      {tab === 'contacts' && (
        <div className="list-view">
          {contacts.map((contact) => (
            <div key={contact.id} className="list-row static">
              <span className="avatar" style={{ background: contact.color }}>
                {initials(contact.name)}
              </span>
              <span className="row-main">
                <span className="row-title">{contact.name}</span>
                <span className="row-sub">{contact.number}</span>
              </span>
              <IconButton name="messages" label={`Message ${contact.name}`} onClick={() => openApp('messages', { threadId: contact.id })} />
              <IconButton name="phone" label={`Call ${contact.name}`} onClick={() => startCall(contact)} />
            </div>
          ))}
        </div>
      )}

      {call && (
        <div className="call-screen">
          <div className="call-head">
            <div className="call-name">{call.name}</div>
            <div className="call-status">{call.connectedAt ? mmss(elapsed) : 'Calling…'}</div>
            <div className="call-sub">{call.number}</div>
          </div>
          <div className="call-avatar" style={{ background: call.color }}>
            {initials(call.name || '?')}
          </div>
          <div className="call-actions">
            <button
              type="button"
              className={`call-action ${call.muted ? 'on' : ''}`}
              onClick={() => setCall((current) => ({ ...current, muted: !current.muted }))}
            >
              <Icon name={call.muted ? 'mute' : 'mic'} size={22} />
              <span>{call.muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              type="button"
              className={`call-action ${call.speaker ? 'on' : ''}`}
              onClick={() => setCall((current) => ({ ...current, speaker: !current.speaker }))}
            >
              <Icon name="speaker" size={22} />
              <span>Speaker</span>
            </button>
            <button type="button" className="call-action" onClick={() => setTab('keypad')}>
              <Icon name="keypad" size={22} />
              <span>Keypad</span>
            </button>
          </div>
          <button type="button" className="call-end" onClick={endCall} aria-label="End call">
            <Icon name="phone" size={28} />
          </button>
          <p className="call-note">{call.connectedAt ? 'Connected · BananaOS Cellular' : 'Ringing…'}</p>
        </div>
      )}
    </AppFrame>
  );
}
