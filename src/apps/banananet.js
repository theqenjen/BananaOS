export const SEARCH_RESULTS = [
  {
    title: 'Banana — Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Banana',
    snippet:
      'A banana is an elongated, edible fruit produced by several kinds of large herbaceous flowering plants in the genus Musa.',
  },
  {
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    snippet: 'News and discussion for the technically curious, updated all day.',
  },
  {
    title: 'BBC News — Front Page',
    url: 'https://www.bbc.co.uk/news',
    snippet: 'Breaking news, analysis and features from around the world.',
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/',
    snippet: 'Resources for developers, by developers. HTML, CSS, JavaScript and the web platform.',
  },
  {
    title: 'The Weather Channel',
    url: 'https://weather.com',
    snippet: 'Local weather forecasts, radar maps and severe weather alerts.',
  },
]

export const HELPER_ARTICLES = {
  help: {
    title: 'Using BananaOS',
    intro: 'Everything on this device is driven by a few gestures. Here is the whole map.',
    sections: [
      {
        heading: 'Lock screen',
        body: 'Drag upwards anywhere on the lock screen, or tap the unlock pill, to reach the home screen. Unread messages appear as cards you can tap straight into.',
      },
      {
        heading: 'Home screen',
        body: 'Tap any icon to open an app. The dock at the bottom keeps Phone, Messages, Browser and Photos within reach from every page.',
      },
      {
        heading: 'Leaving an app',
        body: 'Tap the white home bar at the bottom of the screen to go home, or drag it up to open the app switcher. Swipe an app card closed with the × button.',
      },
      {
        heading: 'Control Centre',
        body: 'Pull down from the status bar at the very top of the screen to reveal Wi-Fi, Bluetooth, Focus, brightness and volume.',
      },
      {
        heading: 'Browser',
        body: 'Search the web in the address bar. Type a full address to open a real site; BananaOS reads the page and renders it here. Pages with heavy scripts may render simplified.',
      },
    ],
  },
  about: {
    title: 'About BananaOS',
    intro: 'BananaOS 1.0 (build 24B71) · ARM64 userland · WebRender shell.',
    sections: [
      {
        heading: 'A phone that fits in a tab',
        body: 'BananaOS is a complete mobile operating system experience: a lock screen, a home screen with widgets, a notification banner system, Control Centre, an app switcher and a suite of system apps. Every app is real software — the dialler places calls and logs them, Messages persists threads on the device, and the Browser reads live pages from the web.',
      },
      {
        heading: 'What is simulated',
        body: 'This build runs as a web application rather than booting a kernel on phone hardware. Calls connect to a simulated carrier and the Weather app shows a fixed forecast for London. Everything else — storage, navigation, messaging state — is genuinely local and survives a reload.',
      },
      {
        heading: 'Credits',
        body: 'Designed and built as an exercise in interface craft. No bananas were harmed. Peel responsibly.',
      },
    ],
  },
}

export const BOOKMARKS = [
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Banana', emoji: '🌍' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com', emoji: '📰' },
  { label: 'BBC News', url: 'https://www.bbc.co.uk/news', emoji: '🇬🇧' },
  { label: 'MDN', url: 'https://developer.mozilla.org/en-US/', emoji: '📚' },
]
