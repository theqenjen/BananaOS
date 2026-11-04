import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { load, save, clearAll } from './storage';

const OSContext = createContext(null);
export const useOS = () => useContext(OSContext);

export const uid = () => Math.random().toString(36).slice(2, 10);

export const WALLPAPERS = {
  ripen: {
    label: 'Ripen',
    css: 'radial-gradient(120% 90% at 20% 8%, #FFE066 0%, #F5B92B 34%, #B47608 68%, #3A2606 100%)',
  },
  midnight: {
    label: 'Midnight',
    css: 'radial-gradient(120% 100% at 80% 0%, #2E3A6B 0%, #131736 42%, #07080F 100%)',
  },
  grove: {
    label: 'Grove',
    css: 'radial-gradient(120% 100% at 15% 100%, #2F6B3F 0%, #123322 45%, #050B08 100%)',
  },
  ember: {
    label: 'Ember',
    css: 'radial-gradient(120% 100% at 75% 10%, #FF9A5B 0%, #C23E1F 40%, #3A0F06 80%, #120402 100%)',
  },
};

export const DEFAULT_SETTINGS = {
  deviceName: 'Banana One',
  wallpaper: 'ripen',
  brightness: 100,
  volume: 65,
  wifi: true,
  bluetooth: false,
  airplane: false,
  dnd: false,
  flashlight: false,
};

const now = Date.now();

const SEED_CONVERSATIONS = [
  {
    id: 'mum',
    name: 'Mum',
    number: '+44 7700 900 118',
    color: '#FF7A8A',
    autoReply: true,
    unread: 1,
    messages: [
      { id: 's1', from: 'them', text: 'Did you eat breakfast? 🍌', ts: now - 1000 * 60 * 46 },
      { id: 's2', from: 'me', text: 'Yes — banana on toast, obviously', ts: now - 1000 * 60 * 44 },
      { id: 's3', from: 'them', text: 'Good. Call me later?', ts: now - 1000 * 60 * 41 },
    ],
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    number: '+44 7700 900 274',
    color: '#5AC8FA',
    autoReply: true,
    unread: 0,
    messages: [
      { id: 's4', from: 'them', text: 'Are you coming to the climbing wall tonight?', ts: now - 1000 * 60 * 180 },
      { id: 's5', from: 'me', text: 'Maybe. Depends on my battery', ts: now - 1000 * 60 * 176 },
    ],
  },
  {
    id: 'pizza',
    name: 'Pizza Palace',
    number: '+44 7700 900 442',
    color: '#FFB020',
    autoReply: true,
    unread: 0,
    messages: [
      { id: 's6', from: 'them', text: 'Your order is on its way. ETA 18 minutes.', ts: now - 1000 * 60 * 300 },
    ],
  },
  {
    id: 'bank',
    name: 'BananBank',
    number: '20250',
    color: '#9B8CFF',
    autoReply: false,
    unread: 0,
    messages: [
      { id: 's7', from: 'them', text: 'Your balance is £412.66. Reply HELP for support.', ts: now - 1000 * 60 * 60 * 26 },
    ],
  },
];

const REPLIES = {
  greeting: [
    'Hey! 👋',
    'Hey you. What’s up?',
    'Hello! I was just thinking about you.',
    'Hiya — how’s the phone treating you?',
  ],
  question: [
    'Honestly? Probably yes.',
    'Good question. Let me think and get back to you.',
    'I’d say so, yeah.',
    'Not sure — what do you reckon?',
  ],
  thanks: ['Anytime 💛', 'No worries at all.', 'Of course!'],
  yesno: ['Yep, works for me.', 'Sure thing.', 'Can’t tonight, but how about tomorrow?'],
  default: [
    'Got it 👍',
    'Ha, fair enough.',
    'Makes sense to me.',
    'Sounds good — talk in a bit.',
    'Nice one.',
    'I’ll let you know as soon as I hear anything.',
  ],
};

function pickReply(text) {
  const value = text.toLowerCase();
  let bucket = REPLIES.default;
  if (/^(hi|hey|hello|yo)\b/.test(value)) bucket = REPLIES.greeting;
  else if (/\?$/.test(value.trim())) bucket = REPLIES.question;
  else if (/thank/.test(value)) bucket = REPLIES.thanks;
  else if (/^(yes|no|ok|sure|can you|are you|shall we)\b/.test(value)) bucket = REPLIES.yesno;
  return bucket[Math.floor(Math.random() * bucket.length)];
}

const SAMPLE_PHOTOS = [
  { id: 'p1', type: 'sample', label: 'Sunset over the grove', css: 'linear-gradient(160deg,#FFB347,#FF6F61 55%,#5B2C6F)' },
  { id: 'p2', type: 'sample', label: 'Banana, studio light', css: 'linear-gradient(150deg,#FFE27A,#F2B01E 60%,#8C5A05)' },
  { id: 'p3', type: 'sample', label: 'Blue hour', css: 'linear-gradient(170deg,#1B2A6B,#3D6CB9 55%,#89C4E1)' },
  { id: 'p4', type: 'sample', label: 'Palm shade', css: 'linear-gradient(140deg,#0E5A3C,#2E9E6B 55%,#BDE59B)' },
];

export function OSProvider({ children }) {
  const [booted, setBooted] = useState(false);
  const [locked, setLocked] = useState(true);
  const [app, setApp] = useState(null);
  const [panel, setPanel] = useState(null);
  const [recents, setRecents] = useState([]);
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...load('settings', {}) }));
  const [notifications, setNotifications] = useState(() => load('notifications', []));
  const [conversations, setConversations] = useState(() => load('conversations', SEED_CONVERSATIONS));
  const [photos, setPhotos] = useState(() => load('photos', SAMPLE_PHOTOS));
  const threadInView = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 2100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => save('settings', settings), [settings]);
  useEffect(() => save('notifications', notifications), [notifications]);
  useEffect(() => save('conversations', conversations), [conversations]);
  useEffect(() => save('photos', photos), [photos]);

  const notify = useCallback((entry) => {
    setNotifications((list) => [{ id: uid(), ts: Date.now(), ...entry }, ...list].slice(0, 40));
  }, []);

  const openApp = useCallback((id, params = null) => {
    setApp({ id, params });
    setPanel(null);
    setRecents((list) => [id, ...list.filter((item) => item !== id)].slice(0, 6));
  }, []);

  const goHome = useCallback(() => {
    setApp(null);
    setPanel(null);
  }, []);

  const togglePanel = useCallback((name) => {
    setPanel((current) => (current === name ? null : name));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const lock = useCallback(() => {
    setLocked(true);
    setApp(null);
    setPanel(null);
  }, []);

  const unlock = useCallback(() => {
    setLocked(false);
    setPanel(null);
  }, []);

  const markThreadRead = useCallback((convId) => {
    setConversations((list) => list.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)));
  }, []);

  const setThreadInView = useCallback((convId) => {
    threadInView.current = convId;
    if (convId) markThreadRead(convId);
  }, [markThreadRead]);

  const sendMessage = useCallback(
    (convId, rawText) => {
      const text = String(rawText || '').trim();
      if (!text) return;
      setConversations((list) => {
        const conv = list.find((c) => c.id === convId);
        if (!conv) return list;
        const reply = conv.autoReply ? pickReply(text) : null;
        if (reply) {
          setTimeout(() => {
            setConversations((current) =>
              current.map((c) =>
                c.id === convId
                  ? {
                      ...c,
                      unread: threadInView.current === convId ? 0 : (c.unread || 0) + 1,
                      messages: [...c.messages, { id: uid(), from: 'them', text: reply, ts: Date.now() }],
                    }
                  : c,
              ),
            );
            if (threadInView.current !== convId) {
              notify({ appId: 'messages', title: conv.name, body: reply, convId });
            }
          }, 1500 + Math.random() * 1200);
        }
        return list.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, { id: uid(), from: 'me', text, ts: Date.now() }] }
            : c,
        );
      });
    },
    [notify],
  );

  const startConversation = useCallback((contact) => {
    setConversations((list) => {
      if (list.some((c) => c.id === contact.id)) return list;
      return [
        { id: contact.id, name: contact.name, number: contact.number, color: contact.color, autoReply: true, unread: 0, messages: [] },
        ...list,
      ];
    });
    setApp({ id: 'messages', params: { threadId: contact.id } });
    setPanel(null);
    setRecents((list) => ['messages', ...list.filter((item) => item !== 'messages')].slice(0, 6));
  }, []);

  const addPhoto = useCallback((src) => {
    setPhotos((list) => [{ id: uid(), type: 'photo', src, ts: Date.now() }, ...list]);
  }, []);

  const removePhoto = useCallback((id) => {
    setPhotos((list) => list.filter((p) => p.id !== id));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const resetDevice = useCallback(() => {
    clearAll();
    window.location.reload();
  }, []);

  const unreadTotal = conversations.reduce((total, c) => total + (c.unread || 0), 0);
  const unreadByConversation = conversations.reduce((acc, c) => {
    acc[c.id] = c.unread || 0;
    return acc;
  }, {});

  const value = {
    booted,
    locked,
    app,
    panel,
    recents,
    settings,
    notifications,
    conversations,
    unreadTotal,
    unreadByConversation,
    photos,
    wallpaper: WALLPAPERS[settings.wallpaper] || WALLPAPERS.ripen,
    setPanel,
    togglePanel,
    openApp,
    goHome,
    updateSettings,
    lock,
    unlock,
    notify,
    sendMessage,
    startConversation,
    markThreadRead,
    setThreadInView,
    addPhoto,
    removePhoto,
    clearNotifications,
    resetDevice,
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}
