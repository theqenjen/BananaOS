export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function clockTime(date = new Date()) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function clockTime12(date = new Date()) {
  return date
    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase()
}

export function longDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function shortDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function relativeDay(ts) {
  const day = 24 * 60 * 60 * 1000
  const diff = Date.now() - ts
  if (diff < day && new Date(ts).getDate() === new Date().getDate()) return 'Today'
  if (diff < 2 * day) return 'Yesterday'
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function clock(ts) {
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function duration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

const REPLIES = [
  [/tonight|dinner|7:30|table/i, ['See you at 7:30 then 🍌', 'Perfect, I’ll be there']],
  [/fries|food|eat|hungry/i, ['The fries are non-negotiable', 'Now I’m hungry']],
  [/banana|peel/i, ['Potassium approved 🍌', 'Banana. Obviously.']],
  [/thanks|thank you/i, ['Anytime!', 'No worries at all']],
  [/call|ring/i, ['Give me ten minutes and I’ll ring you', 'Calling you now']],
  [/late|sorry/i, ['Don’t worry about it', 'No stress, see you soon']],
  [/love/i, ['❤️', 'Love you too']],
  [/quiz|thursday/i, ['Thursday works for me', 'I’m in — bring the good pen']],
]

const FALLBACK = [
  'Ha, fair enough',
  'Got it 👍',
  'That tracks',
  'Say more?',
  'Ok! Talk in a bit',
  'On it',
]

export function pickReply(text) {
  for (const [pattern, options] of REPLIES) {
    if (pattern.test(text || '')) {
      return options[Math.floor(Math.random() * options.length)]
    }
  }
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]
}

let audioContext = null

/** Short synthesised touch/call tone. Silent when sounds are switched off. */
export function playTone(frequency = 440, ms = 90, gain = 0.05) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!audioContext) audioContext = new Ctx()
    if (audioContext.state === 'suspended') audioContext.resume()
    const osc = audioContext.createOscillator()
    const amp = audioContext.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    amp.gain.setValueAtTime(gain, audioContext.currentTime)
    amp.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + ms / 1000)
    osc.connect(amp).connect(audioContext.destination)
    osc.start()
    osc.stop(audioContext.currentTime + ms / 1000)
  } catch {
    /* audio is a nicety, never a failure */
  }
}

export const KEYPAD_TONES = {
  1: 697,
  2: 770,
  3: 852,
  4: 941,
  5: 770,
  6: 852,
  7: 941,
  8: 697,
  9: 852,
  0: 941,
  '*': 770,
  '#': 852,
}
