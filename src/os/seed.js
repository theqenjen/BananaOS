const minute = 60_000
const hour = 60 * minute

export const CONTACTS = [
  { id: 'c1', name: 'Maya Chen', initials: 'MC', color: '#FF9F6B', phone: '07700 900341' },
  { id: 'c2', name: 'Dad', initials: 'RD', color: '#6C8CFF', phone: '07700 900128' },
  { id: 'c3', name: 'Sam Rivera', initials: 'SR', color: '#57D9A3', phone: '07700 900772' },
  { id: 'c4', name: 'Priya Patel', initials: 'PP', color: '#C48CFF', phone: '07700 900455' },
  { id: 'c5', name: 'Leo', initials: 'LT', color: '#FFD166', phone: '07700 900610' },
  { id: 'c6', name: 'Banana Support', initials: 'BS', color: '#F5D33F', phone: '0800 226 262' },
  { id: 'c7', name: 'Pizza Palace', initials: 'PZ', color: '#FF6B6B', phone: '020 7946 0821' },
  { id: 'c8', name: 'Mum', initials: 'JM', color: '#7BD3EA', phone: '07700 900907' },
]

export function contactById(contacts, id) {
  return contacts.find((c) => c.id === id)
}

export function findContactByNumber(contacts, number) {
  const digits = (number || '').replace(/\D/g, '')
  if (digits.length < 3) return undefined
  return contacts.find((c) => c.phone.replace(/\D/g, '').endsWith(digits.slice(-7)))
}

function buildConversations() {
  const t = Date.now()
  return [
    {
      id: 'conv1',
      contactId: 'c1',
      unread: 1,
      messages: [
        { id: 'm1', from: 'them', text: 'Morning! Are we still on for tonight?', ts: t - 3 * hour },
        { id: 'm2', from: 'me', text: 'Absolutely 🍌 booked the table for 7:30', ts: t - 3 * hour + 4 * minute },
        { id: 'm3', from: 'them', text: 'Perfect. I’ll bring the film camera', ts: t - 52 * minute },
        { id: 'm4', from: 'them', text: 'Also I found the place with the good fries', ts: t - 50 * minute },
      ],
    },
    {
      id: 'conv2',
      contactId: 'c2',
      unread: 0,
      messages: [
        { id: 'm5', from: 'them', text: 'Call me when you land', ts: t - 26 * hour },
        { id: 'm6', from: 'me', text: 'Landed. All good, talk in a bit', ts: t - 25 * hour },
      ],
    },
    {
      id: 'conv3',
      contactId: 'c3',
      unread: 0,
      messages: [
        { id: 'm7', from: 'them', text: 'sent you the files', ts: t - 5 * hour },
        { id: 'm8', from: 'me', text: 'got them, thanks! the second one is huge', ts: t - 5 * hour + 9 * minute },
      ],
    },
    {
      id: 'conv4',
      contactId: 'c6',
      unread: 0,
      messages: [
        {
          id: 'm9',
          from: 'them',
          text: 'Welcome to BananaOS 1.0. The whole peel is yours — try the Browser, Phone and Messages apps.',
          ts: t - 2 * 24 * hour,
        },
      ],
    },
    {
      id: 'conv5',
      contactId: 'c4',
      unread: 0,
      messages: [
        { id: 'm10', from: 'me', text: 'Quiz night Thursday?', ts: t - 30 * hour },
        { id: 'm11', from: 'them', text: 'Only if we get the sport round this time 😅', ts: t - 29 * hour },
      ],
    },
  ]
}

function buildCalls() {
  const t = Date.now()
  return [
    { id: 'call1', contactId: 'c1', type: 'out', ts: t - 4 * hour, duration: 412 },
    { id: 'call2', contactId: 'c2', type: 'in', ts: t - 26 * hour, duration: 96 },
    { id: 'call3', contactId: null, number: '0800 226 262', type: 'missed', ts: t - 28 * hour, duration: 0 },
    { id: 'call4', contactId: 'c3', type: 'out', ts: t - 2 * 24 * hour, duration: 63 },
  ]
}

function buildNotes() {
  const t = Date.now()
  return [
    {
      id: 'n1',
      title: 'Groceries',
      body: 'Bananas (a lot)\nOat milk\nCoffee beans\nOlive oil\nSomething green',
      updated: t - 40 * minute,
    },
    {
      id: 'n2',
      title: 'Film ideas',
      body: 'A phone that remembers everything.\nA city at 5am.\nSomeone learning to swim at 40.',
      updated: t - 6 * hour,
    },
  ]
}

export const WALLPAPERS = ['aurora', 'sunset', 'mint']

export function createInitialState() {
  return {
    profile: { name: 'Maya', handle: 'maya@banana.os' },
    settings: {
      wallpaper: 'aurora',
      brightness: 0.94,
      sounds: true,
      wifi: true,
      bluetooth: true,
      airplane: false,
      focus: false,
      volume: 0.7,
    },
    contacts: CONTACTS,
    conversations: buildConversations(),
    calls: buildCalls(),
    notes: buildNotes(),
    battery: 82,
  }
}

export const PHOTOS = [
  { id: 'p1', a: '#FFB86B', b: '#FF5F6D', label: 'Sunset over the rooftops' },
  { id: 'p2', a: '#6EE7C8', b: '#2C7BE5', label: 'Cold swim' },
  { id: 'p3', a: '#F5D33F', b: '#E8B923', label: 'The peel' },
  { id: 'p4', a: '#C48CFF', b: '#5B5BF7', label: 'Night bus' },
  { id: 'p5', a: '#FFB3C7', b: '#FF6B6B', label: 'Market flowers' },
  { id: 'p6', a: '#9BE15D', b: '#00E3AE', label: 'Morning run' },
  { id: 'p7', a: '#FFD166', b: '#FF9F1C', label: 'Kitchen light' },
  { id: 'p8', a: '#A1C4FD', b: '#C2E9FB', label: 'Window seat' },
  { id: 'p9', a: '#F78CA0', b: '#F9748F', label: 'Birthday' },
  { id: 'p10', a: '#43E97B', b: '#38F9D7', label: 'Allotment' },
  { id: 'p11', a: '#30CFD0', b: '#330867', label: 'Late swim' },
  { id: 'p12', a: '#FDCB82', b: '#E07A5F', label: 'Old town' },
]
