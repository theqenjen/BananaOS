/**
 * BananaOS Phone — real outbound calls via the Twilio Programmable Voice REST API.
 *
 * This is a Vite dev middleware (same-origin, like the Browser proxy) so the
 * Phone app can place genuine PSTN calls from the browser. Twilio credentials
 * stay server-side and are read from the environment; if they are not
 * configured the endpoints report `configured: false` and the Phone app falls
 * back to its built-in simulated call so the UI still works in the preview.
 *
 * Endpoints:
 *   POST /api/call            { to }                 -> { ok, sid, status }
 *   GET  /api/call/status?sid=...                    -> { ok, status }
 *   POST /api/call/hangup?sid=...                     -> { ok, status }
 *
 * Twilio's REST API is called with HTTP Basic auth (Account SID:Auth Token) via
 * the global `fetch` available in Node 22, so no extra npm dependency is needed.
 */

const TWILIO_API = 'https://api.twilio.com/2010-04-01'

function creds() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  if (!sid || !token || !from) return null
  return { sid, token, from }
}

/** Best-effort normalisation to E.164 for UK-style dialled numbers. */
function toE164(raw) {
  let n = (raw || '').replace(/[^\d+*#]/g, '')
  if (n.startsWith('+')) return n
  if (n.startsWith('00')) return '+' + n.slice(2)
  if (n.startsWith('0')) return '+44' + n.slice(1)
  return n
}

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  return new Promise((resolve) => {
    let buf = ''
    req.on('data', (chunk) => {
      buf += chunk
      if (buf.length > 4096) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(buf ? JSON.parse(buf) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

async function twilioFetch(path, init = {}) {
  const { sid, token } = creds()
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')
  const res = await fetch(`${TWILIO_API}/Accounts/${sid}/${path}`, {
    ...init,
    headers: {
      authorization: `Basic ${auth}`,
      'content-type': 'application/x-www-form-urlencoded',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = { message: text }
  }
  return { ok: res.ok, status: res.status, body }
}

async function placeCall(req, res) {
  const c = creds()
  if (!c) return json(res, 200, { ok: false, configured: false })

  const { to } = await readBody(req)
  const dest = toE164(to)
  if (dest.length < 6) return json(res, 400, { ok: false, error: 'Enter a valid number' })

  // TwiML spoken to the called party when they answer, proving the call is real.
  const twiml = '<Response><Say voice="Polly.Amy">This is a call from BananaOS.</Say></Response>'
  const form = new URLSearchParams({
    From: c.from,
    To: dest,
    Twiml: twiml,
    Timeout: '30',
  })

  const result = await twilioFetch('Calls.json', {
    method: 'POST',
    body: form.toString(),
  })

  if (!result.ok) {
    return json(res, 200, {
      ok: false,
      error: result.body?.message || `Twilio error ${result.status}`,
    })
  }
  json(res, 200, { ok: true, sid: result.body.sid, status: result.body.status })
}

async function callStatus(req, res, sid) {
  const c = creds()
  if (!c) return json(res, 200, { ok: false, configured: false })
  const result = await twilioFetch(`Calls/${sid}.json`)
  if (!result.ok) {
    return json(res, 200, { ok: false, error: result.body?.message || 'Not found' })
  }
  json(res, 200, { ok: true, status: result.body.status })
}

async function hangupCall(req, res, sid) {
  const c = creds()
  if (!c) return json(res, 200, { ok: false, configured: false })
  const form = new URLSearchParams({ Status: 'completed' })
  const result = await twilioFetch(`Calls/${sid}.json`, {
    method: 'POST',
    body: form.toString(),
  })
  if (!result.ok) {
    return json(res, 200, { ok: false, error: result.body?.message || 'Not found' })
  }
  json(res, 200, { ok: true, status: result.body.status })
}

/** Vite plugin: real Phone-call API backed by Twilio. */
export function callApi() {
  return {
    name: 'banana-call-api',
    configureServer(server) {
      server.middlewares.use('/api/call', async (req, res) => {
        try {
          const url = new URL(req.url || '/', 'http://banana.local')
          const sid = url.searchParams.get('sid')
          if (req.method === 'POST' && sid) return hangupCall(req, res, sid)
          if (req.method === 'GET' && sid) return callStatus(req, res, sid)
          if (req.method === 'POST') return placeCall(req, res)
          json(res, 405, { ok: false, error: 'Method not allowed' })
        } catch (error) {
          json(res, 500, { ok: false, error: 'Call service unavailable' })
        }
      })
    },
  }
}
