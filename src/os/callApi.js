/**
 * Client helpers for the BananaOS Phone app. They talk to the same-origin
 * `/api/call` middleware, which places real calls through Twilio. When Twilio
 * is not configured the middleware returns `configured: false` and the Phone
 * app falls back to its simulated call.
 */

export async function placeCall(to) {
  const res = await fetch('/api/call', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ to }),
  })
  return res.json()
}

export async function getCallStatus(sid) {
  const res = await fetch(`/api/call/status?sid=${encodeURIComponent(sid)}`)
  return res.json()
}

export async function hangupCall(sid) {
  const res = await fetch(`/api/call/hangup?sid=${encodeURIComponent(sid)}`, {
    method: 'POST',
  })
  return res.json()
}

/**
 * Map a Twilio call status to a simple Phone-app phase the UI can render.
 *   queued  -> connecting
 *   ringing -> calling
 *   in-progress -> active
 *   completed / failed / no-answer / busy / canceled -> ended
 */
export function mapStatus(status) {
  if (status === 'in-progress') return 'active'
  if (status === 'ringing') return 'calling'
  if (status === 'queued' || status === 'connecting') return 'connecting'
  return 'ended'
}
