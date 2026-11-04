import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createInitialState, contactById, findContactByNumber } from './seed'
import { pickReply, playTone, uid } from './utils'

const STORAGE_KEY = 'bananaos.state.v1'
const OSContext = createContext(null)

function loadState() {
  const initial = createInitialState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initial
    const saved = JSON.parse(raw)
    return {
      ...initial,
      ...saved,
      profile: { ...initial.profile, ...(saved.profile || {}) },
      settings: { ...initial.settings, ...(saved.settings || {}) },
    }
  } catch {
    return initial
  }
}

function persist(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage can be full or blocked — the OS keeps working in memory */
  }
}

const INITIAL_UI = {
  phase: 'boot',
  activeApp: null,
  switcher: false,
  controlCenter: false,
  recents: [],
  banners: [],
  messageTarget: null,
}

export function OSProvider({ children }) {
  const [data, setData] = useState(loadState)
  const [ui, setUi] = useState(INITIAL_UI)
  const uiRef = useRef(ui)
  const timers = useRef([])

  useEffect(() => {
    persist(data)
  }, [data])

  useEffect(() => {
    uiRef.current = ui
  }, [ui])

  useEffect(() => {
    const boot = setTimeout(() => {
      setUi((u) => (u.phase === 'boot' ? { ...u, phase: 'lock' } : u))
    }, 1500)
    return () => {
      clearTimeout(boot)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }, [])

  const dismissBanner = useCallback((id) => {
    setUi((u) => ({ ...u, banners: u.banners.filter((b) => b.id !== id) }))
  }, [])

  const notify = useCallback(
    ({ appId, title, body }) => {
      const id = uid('note')
      setUi((u) => ({ ...u, banners: [...u.banners, { id, appId, title, body }].slice(-3) }))
      if (uiRef.current.phase === 'home' || uiRef.current.phase === 'lock') {
        if (data.settings.sounds) playTone(880, 120, 0.04)
      }
      later(() => dismissBanner(id), 4800)
    },
    [dismissBanner, later, data.settings.sounds],
  )

  const unlock = useCallback(() => {
    setUi((u) => ({ ...u, phase: 'home' }))
  }, [])

  const lock = useCallback(() => {
    setUi((u) => ({ ...u, phase: 'lock', activeApp: null, switcher: false, controlCenter: false }))
  }, [])

  const skipBoot = useCallback(() => {
    setUi((u) => (u.phase === 'boot' ? { ...u, phase: 'lock' } : u))
  }, [])

  const openApp = useCallback((id) => {
    setUi((u) => ({
      ...u,
      phase: 'home',
      activeApp: id,
      switcher: false,
      controlCenter: false,
      recents: [id, ...u.recents.filter((r) => r !== id)].slice(0, 6),
    }))
  }, [])

  const goHome = useCallback(() => {
    setUi((u) => ({ ...u, activeApp: null, switcher: false, controlCenter: false }))
  }, [])

  const openSwitcher = useCallback(() => {
    setUi((u) => ({ ...u, activeApp: null, switcher: true, controlCenter: false }))
  }, [])

  const closeRecent = useCallback((id) => {
    setUi((u) => ({ ...u, recents: u.recents.filter((r) => r !== id) }))
  }, [])

  const setControlCenter = useCallback((open) => {
    setUi((u) => ({ ...u, controlCenter: open }))
  }, [])

  const updateSettings = useCallback((patch) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  }, [])

  const updateProfile = useCallback((patch) => {
    setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }))
  }, [])

  const markRead = useCallback((conversationId) => {
    setData((d) => ({
      ...d,
      conversations: d.conversations.map((c) =>
        c.id === conversationId && c.unread ? { ...c, unread: 0 } : c,
      ),
    }))
  }, [])

  const ensureConversation = useCallback((contactId) => {
    const existing = data.conversations.find((c) => c.contactId === contactId)
    if (existing) return existing.id
    const id = uid('conv')
    setData((d) => ({
      ...d,
      conversations: [{ id, contactId, unread: 0, messages: [] }, ...d.conversations],
    }))
    return id
  }, [data.conversations])

  const openMessageThread = useCallback(
    (contactId) => {
      const existing = data.conversations.find((c) => c.contactId === contactId)
      const id = existing ? existing.id : uid('conv')
      if (!existing) {
        setData((d) => ({
          ...d,
          conversations: [{ id, contactId, unread: 0, messages: [] }, ...d.conversations],
        }))
      }
      setUi((u) => ({
        ...u,
        phase: 'home',
        activeApp: 'messages',
        messageTarget: id,
        switcher: false,
        controlCenter: false,
        recents: ['messages', ...u.recents.filter((r) => r !== 'messages')].slice(0, 6),
      }))
    },
    [data.conversations],
  )

  const clearMessageTarget = useCallback(() => {
    setUi((u) => ({ ...u, messageTarget: null }))
  }, [])

  const sendMessage = useCallback(
    (conversationId, text) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const conversation = data.conversations.find((c) => c.id === conversationId)
      const contact = conversation ? contactById(data.contacts, conversation.contactId) : null

      setData((d) => ({
        ...d,
        conversations: d.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                unread: 0,
                messages: [
                  ...c.messages,
                  { id: uid('m'), from: 'me', text: trimmed, ts: Date.now() },
                ],
              }
            : c,
        ),
      }))

      if (!contact) return

      if (contact.id === 'c6') {
        // Banana Support answers instantly.
        later(() => {
          setData((d) => ({
            ...d,
            conversations: d.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    messages: [
                      ...c.messages,
                      {
                        id: uid('m'),
                        from: 'them',
                        text: 'Thanks for the message — a peel specialist will be with you shortly. 🍌',
                        ts: Date.now(),
                      },
                    ],
                  }
                : c,
            ),
          }))
        }, 1200)
        return
      }

      const reply = pickReply(trimmed)
      later(() => {
        setData((d) => ({
          ...d,
          conversations: d.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  unread:
                    uiRef.current.activeApp === 'messages'
                      ? c.unread
                      : (c.unread || 0) + 1,
                  messages: [
                    ...c.messages,
                    { id: uid('m'), from: 'them', text: reply, ts: Date.now() },
                  ],
                }
              : c,
          ),
        }))
        if (uiRef.current.activeApp !== 'messages') {
          notify({ appId: 'messages', title: contact.name, body: reply })
        }
      }, 1400 + Math.random() * 1500)
    },
    [data.conversations, data.contacts, later, notify],
  )

  const logCall = useCallback(({ contactId, number, type, duration: seconds }) => {
    setData((d) => ({
      ...d,
      calls: [
        {
          id: uid('call'),
          contactId: contactId || null,
          number: number || null,
          type,
          ts: Date.now(),
          duration: Math.round(seconds || 0),
        },
        ...d.calls,
      ].slice(0, 40),
    }))
  }, [])

  const addNote = useCallback(() => {
    const id = uid('n')
    setData((d) => ({
      ...d,
      notes: [{ id, title: 'New note', body: '', updated: Date.now() }, ...d.notes],
    }))
    return id
  }, [])

  const updateNote = useCallback((id, patch) => {
    setData((d) => ({
      ...d,
      notes: d.notes.map((n) => (n.id === id ? { ...n, ...patch, updated: Date.now() } : n)),
    }))
  }, [])

  const deleteNote = useCallback((id) => {
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }))
  }, [])

  const resetOS = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setData(createInitialState())
    setUi({ ...INITIAL_UI, phase: 'home' })
  }, [])

  const contactForNumber = useCallback(
    (number) => findContactByNumber(data.contacts, number),
    [data.contacts],
  )

  const value = useMemo(
    () => ({
      data,
      ui,
      unreadTotal: data.conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
      actions: {
        unlock,
        lock,
        skipBoot,
        openApp,
        goHome,
        openSwitcher,
        closeRecent,
        setControlCenter,
        updateSettings,
        updateProfile,
        markRead,
        ensureConversation,
        openMessageThread,
        clearMessageTarget,
        sendMessage,
        logCall,
        addNote,
        updateNote,
        deleteNote,
        resetOS,
        notify,
        dismissBanner,
        playTone: (freq, ms) => data.settings.sounds && playTone(freq, ms),
        contactForNumber,
      },
    }),
    [
      data,
      ui,
      unlock,
      lock,
      skipBoot,
      openApp,
      goHome,
      openSwitcher,
      closeRecent,
      setControlCenter,
      updateSettings,
      updateProfile,
      markRead,
      ensureConversation,
      openMessageThread,
      clearMessageTarget,
      sendMessage,
      logCall,
      addNote,
      updateNote,
      deleteNote,
      resetOS,
      notify,
      dismissBanner,
      contactForNumber,
    ],
  )

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used inside OSProvider')
  return ctx
}
