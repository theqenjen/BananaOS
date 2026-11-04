import http from 'node:http';

const PORT = Number(process.env.PORT || 8000);
const UA =
  'Mozilla/5.0 (BananaOS 1.0; arm64) AppleWebKit/537.36 (KHTML, like Gecko) BananaBrowser/1.0 Safari/537.36';

/* ------------------------------- helpers -------------------------------- */

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(body);
}

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  middot: '·',
  copy: '©',
  eacute: 'é',
};

function decodeEntities(str) {
  return str.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const num = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      if (Number.isFinite(num) && num > 0 && num < 0x10ffff) {
        try {
          return String.fromCodePoint(num);
        } catch {
          return match;
        }
      }
      return match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function cleanText(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function isPrivateHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host) return true;
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) return true;
  if (host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80')) return true;
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

function normalizeUrl(raw) {
  let value = String(raw || '').trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (isPrivateHost(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

async function fetchUpstream(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': UA,
        accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'accept-language': 'en-GB,en;q=0.9',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------ extraction ------------------------------ */

function absolutize(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function extractPage(html, baseUrl) {
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)/i);
  const description = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)/i);

  let body = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg|iframe|head)\b[\s\S]*?<\/\1>/gi, ' ');

  const bodyMatch = body.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) body = bodyMatch[1];

  // chrome around the article, not the article itself
  body = body
    .replace(/<(nav|header|footer|aside|form)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<span[^>]*class=["'][^"']*mw-editsection[^"']*["'][\s\S]*?<\/span>/gi, ' ');

  const links = [];
  const seenLinks = new Set();
  for (const match of body.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = absolutize(decodeEntities(match[1]), baseUrl);
    const text = cleanText(match[2]);
    if (!href || !text || text.length < 2 || text.length > 90) continue;
    if (href.startsWith('javascript:') || href.startsWith('mailto:')) continue;
    if (seenLinks.has(href)) continue;
    seenLinks.add(href);
    links.push({ href, text });
    if (links.length >= 40) break;
  }

  const collected = [];
  for (const match of body.matchAll(/<(h1|h2|h3|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = cleanText(match[2]);
    if (!text || text.length < 2) continue;
    const type = match[1].toLowerCase();
    collected.push({ type, text: text.length > 1200 ? `${text.slice(0, 1200)}…` : text });
    if (collected.length >= 400) break;
  }

  // Navigation-heavy pages are mostly list items; articles are mostly paragraphs.
  const paragraphCount = collected.filter((block) => block.type === 'p').length;
  const blocks = (paragraphCount >= 3 ? collected.filter((block) => block.type !== 'li') : collected).slice(0, 160);

  if (!blocks.length) {
    const fallback = cleanText(body);
    if (fallback) blocks.push({ type: 'p', text: fallback.slice(0, 4000) });
  }

  return {
    title: cleanText(ogTitle?.[1] || titleTag?.[1] || 'Untitled page') || 'Untitled page',
    description: description ? cleanText(description[1]) : '',
    blocks,
    links,
  };
}

/* -------------------------------- routes -------------------------------- */

async function handleBrowse(res, rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    return sendJson(res, 400, { ok: false, error: 'That address cannot be opened on BananaOS.' });
  }

  let response;
  try {
    response = await fetchUpstream(url);
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return sendJson(res, timeOutStatus(timedOut), {
      ok: false,
      error: timedOut ? 'The page took too long to respond.' : 'BananaOS could not reach that site.',
    });
  }

  const finalUrl = response.url || url.toString();
  if (isPrivateHost(new URL(finalUrl).hostname)) {
    return sendJson(res, 403, { ok: false, error: 'That address is blocked for security.' });
  }

  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();

  if (contentType.includes('application/json')) {
    return sendJson(res, 200, {
      ok: true,
      url: finalUrl,
      title: new URL(finalUrl).hostname,
      blocks: [{ type: 'pre', text: raw.slice(0, 20000) }],
      links: [],
    });
  }

  if (!contentType.includes('html') && !contentType.includes('xml') && !contentType.includes('text')) {
    return sendJson(res, 415, {
      ok: false,
      error: `BananaOS Browser cannot display ${contentType.split(';')[0] || 'this file type'}.`,
    });
  }

  const page = extractPage(raw, finalUrl);
  return sendJson(res, 200, {
    ok: true,
    url: finalUrl,
    status: response.status,
    ...page,
  });
}

function timeOutStatus(timedOut) {
  return timedOut ? 504 : 502;
}

async function handleSearch(res, query) {
  const q = String(query || '').trim();
  if (!q) return sendJson(res, 400, { ok: false, error: 'Type something to search for.' });

  const endpoint =
    'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=12&srsearch=' +
    encodeURIComponent(q);
  try {
    const response = await fetchUpstream(endpoint);
    if (!response.ok) throw new Error('search failed');
    const data = await response.json();
    const results = (data?.query?.search || []).map((item) => ({
      title: item.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
      snippet: cleanText(item.snippet || ''),
    }));
    return sendJson(res, 200, { ok: true, query: q, results });
  } catch {
    return sendJson(res, 502, { ok: false, error: 'BananaOS search is unavailable right now.' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/health') return sendJson(res, 200, { ok: true, name: 'bananaos-web-proxy' });
    if (url.pathname === '/api/browse') return await handleBrowse(res, url.searchParams.get('url'));
    if (url.pathname === '/api/search') return await handleSearch(res, url.searchParams.get('q'));
    return sendJson(res, 404, { ok: false, error: 'not_found' });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: 'BananaOS proxy error.' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BananaOS network service listening on ${PORT}`);
});
