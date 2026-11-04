const MAX_BYTES = 2_000_000
const TIMEOUT_MS = 12_000

const STRIP = [
  /<script\b[\s\S]*?<\/script>/gi,
  /<noscript\b[\s\S]*?<\/noscript>/gi,
  /<iframe\b[\s\S]*?<\/iframe>/gi,
  /<object\b[\s\S]*?<\/object>/gi,
  /<embed\b[^>]*>/gi,
  /<meta[^>]+http-equiv=["']?refresh["']?[^>]*>/gi,
]

/**
 * Strip anything executable from a fetched page so the in-OS browser can show
 * it inside a sandboxed frame. This is a dev-only reader, not a security
 * boundary for untrusted input.
 */
function sanitize(html, baseUrl) {
  let out = html
  for (const pattern of STRIP) out = out.replace(pattern, '')
  out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  out = out.replace(/javascript:/gi, '')

  const injected = `<base href="${baseUrl}">`
  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1>${injected}`)
  } else {
    out = injected + out
  }
  return out
}

async function handle(req, res) {
  const requestUrl = new URL(req.url || '/', 'http://banana.local')
  const raw = requestUrl.searchParams.get('url')

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  if (!raw) {
    res.statusCode = 400
    res.end(JSON.stringify({ ok: false, error: 'Missing url parameter' }))
    return
  }

  let target
  try {
    target = new URL(raw)
  } catch {
    res.statusCode = 400
    res.end(JSON.stringify({ ok: false, error: 'That address is not valid' }))
    return
  }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    res.statusCode = 400
    res.end(JSON.stringify({ ok: false, error: 'Only http and https pages can be opened' }))
    return
  }

  try {
    const upstream = await fetch(target.toString(), {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'user-agent':
          'Mozilla/5.0 (Linux; Android 14; BananaOS 1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'en-GB,en;q=0.9',
      },
    })

    if (!upstream.ok) {
      res.statusCode = 200
      res.end(
        JSON.stringify({
          ok: false,
          status: upstream.status,
          error: `The site replied with ${upstream.status}`,
        }),
      )
      return
    }

    const raw = await upstream.text()
    const html = sanitize(raw.slice(0, MAX_BYTES), upstream.url || target.toString())
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]

    res.statusCode = 200
    res.end(
      JSON.stringify({
        ok: true,
        url: upstream.url || target.toString(),
        title: (title || '').replace(/\s+/g, ' ').trim() || target.hostname,
        html,
      }),
    )
  } catch (error) {
    res.statusCode = 200
    res.end(
      JSON.stringify({
        ok: false,
        error:
          error?.name === 'TimeoutError'
            ? 'The site took too long to answer'
            : 'BananaOS could not reach that site',
      }),
    )
  }
}

/** Vite plugin: a tiny same-origin reader so the Browser app can show real pages. */
export function browserProxy() {
  return {
    name: 'banana-browser-proxy',
    configureServer(server) {
      server.middlewares.use('/api/browse', (req, res) => {
        handle(req, res)
      })
    },
  }
}
